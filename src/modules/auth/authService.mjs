import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../user/userModel.mjs";
import {
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
} from "../../utils/errors.mjs";
import { profileService } from "../profile/profileService.mjs";
import { getConfig } from "../../config/index.mjs";
import { Profile } from "../profile/profileModel.mjs";
import mongoose from "mongoose";

const config = getConfig();

class AuthService {
  async checkUserExists(userId) {
    const user = await User.findById(userId);
    return !!user;
  }

  async register(userData) {
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }],
    });

    if (existingUser) {
      throw new ConflictError("Usuario o email ya existe");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = new User({
      ...userData,
      password: hashedPassword,
    });
    await user.save();

    // Crear nuevo perfil
    const profileData = { name: user.username };
    await profileService.create({
      userId: user._id,
      type: "owner",
      profileData,
    });

    return user.toJSON();
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select("+password").exec();
    if (!user) {
      throw new UnauthorizedError("Usuario no encontrado");
    }

    // @ts-ignore
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Correo o contraseña incorrectos");
    }

    return user.toJSON();
  }

  async getUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }
    return user.toJSON();
  }

  /**
   * Verificar y decodificar un token de autenticación
   * @param {string} token
   * @returns {{id:string} | undefined}
   */
  decodeToken(token) {
    try {
      const decodedToken = jwt.verify(token, config.jwtSecret);
      if (typeof decodedToken === "string") {
        throw new Error("El token debe contener un objeto usuario");
      }
      // @ts-ignore
      return decodedToken;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Verificar y decodificar un token de autenticación
   * @param {string} userId
   * @param {string} profileId
   * @param {string} requiredPermission
   * @returns *
   */
  async verifyProfilePermissions(userId, profileId, requiredPermission) {
    const profile = await Profile.findById(profileId).populate({
      path: "role",
      populate: {
        path: "permissions",
        model: "Permission",
      },
    });

    const userObjectId = new mongoose.Types.ObjectId(userId);
    if (profile.user != userObjectId) {
      throw new UnauthorizedError(
        "Se requiere un header active-profile-id valido."
      );
    }

    if (requiredPermission) {
      // @ts-ignore
      const hasPermission = profile.role.permissions.some(
        (permission) => permission.name === requiredPermission
      );

      if (!hasPermission) {
        throw new ForbiddenError(
          "El perfil en uso no tiene permisos para realizar esta acción."
        );
      }
    }
  }

  // Método auxiliar para generar tokens JWT
  generateToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "24h" });
  }
}

export const authService = new AuthService();
