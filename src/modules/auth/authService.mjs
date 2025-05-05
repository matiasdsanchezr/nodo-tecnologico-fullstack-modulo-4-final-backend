import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../user/userModel.mjs";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "../../utils/errors.mjs";
import { profileService } from "../profile/profileService.mjs";
import mongoose from "mongoose";

export class AuthService {
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

  // Método auxiliar para generar tokens JWT
  generateToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "24h" });
  }
}
