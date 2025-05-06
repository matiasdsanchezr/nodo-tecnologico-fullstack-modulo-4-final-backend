import { User } from "../user/userModel.mjs";
import { Profile } from "./profileModel.mjs";
import { Role } from "../role/roleModel.mjs";
import {
  BadRequestError,
  CustomError,
  NotFoundError,
} from "../../utils/errors.mjs";
import { watchlistService } from "../watchlist/watchlistService.mjs";
import { Watchlist } from "../watchlist/watchlistModel.mjs";

class ProfileService {
  async checkEmailExists(email) {
    const user = await User.findOne({ email });
    return Boolean(user);
  }

  async getAllByUserId(userId) {
    const profiles = await Profile.find({ user: userId }).populate({
      path: "role",
      populate: {
        path: "permissions",
        model: "Permission",
      },
    });
    return profiles;
  }

  async getById(profileId) {
    const profile = await Profile.findById(profileId).populate({
      path: "role",
      populate: {
        path: "permissions",
        model: "Permission",
      },
    });
    return profile;
  }

  /**
   * Crea un nuevo perfil para el usuario
   * @param {Object} params - Parámetros para crear el perfil
   * @param {string | import("mongoose").Types.ObjectId} params.userId - ID del usuario
   * @param {string} params.type - Tipo de perfil
   * @param {Object} params.profileData - Datos del perfil
   * @returns {Promise<Object>} - Perfil creado
   */
  async create({ userId, type, profileData }) {
    if (!userId || !type || !profileData) {
      throw new BadRequestError("Datos incompletos para crear perfil");
    }

    const user = await User.findById(userId).populate("profiles");

    // Verificar límite de perfiles
    if (user.profiles.length >= 4) {
      throw new BadRequestError("Límite de perfiles alcanzado (máximo 4)");
    }

    // @ts-ignore
    // Verificar que el nombre no este registrado
    if (user.profiles.some((profile) => profile.name === profileData.name)) {
      throw new BadRequestError("Nombre de perfil ya registrado");
    }

    const role = await Role.findOne({ name: type });
    if (!role) {
      throw new NotFoundError(`Rol '${type}' no encontrado`);
    }

    const profile = new Profile({
      user: userId,
      role: role._id,
      ...profileData,
    });
    await profile.save();

    // Crear watchlist
    await watchlistService.create(profile._id);

    // Actualizar usuario
    user.profiles.push(profile._id);
    await user.save();

    // Retornar el perfil con información completa
    return Profile.findById(profile._id).populate({
      path: "role",
      populate: {
        path: "permissions",
        model: "Permission",
      },
    });
  }

  async delete(userId, profileId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Usuario no encontrado");
    }

    const profile = await Profile.findById(profileId).populate({
      path: "role",
      populate: {
        path: "permissions",
        model: "Permission",
      },
    });

    if (!profile) {
      throw new NotFoundError("Perfil no encontrado");
    }

    if (!profile.user.equals(userId)) {
      throw new BadRequestError("No tienes permiso para eliminar este perfil");
    }

    // @ts-ignore
    if (profile.role.name === "owner") {
      throw new BadRequestError(
        "No se puede eliminar el perfil principal (owner)"
      );
    }

    // Remover de la lista de perfiles adicionales
    user.profiles = user.profiles.filter((id) => !id.equals(profileId));

    try {
      await user.save();
      await watchlistService.deleteByProfileId(profileId);
      await Profile.deleteOne({ _id: profileId });
    } catch (error) {
      throw error;
    }
  }

  async update(userId, profileId, profileData) {
    const user = await User.findById(userId).populate("profiles");

    if (
      user.profiles.some(
        (profile) =>
          // @ts-ignore
          profile.name === profileData.name && profile._id != profileId
      )
    ) {
      throw new BadRequestError("Nombre de perfil ya registrado");
    }

    const profile = await Profile.findById(profileId).populate({
      path: "role",
      populate: {
        path: "permissions",
        model: "Permission",
      },
    });
    if (
      // @ts-ignore
      profile.role.name === "owner" &&
      // @ts-ignore
      profileData.type != profile.role.name
    ) {
      profileData.type = "owner";
    }

    const roleType = profileData.type;
    const role = await Role.findOne({ name: roleType });
    if (!role) throw new CustomError(`No se encontro el rol ${roleType}`, 500);

    profile.name = profileData.name;
    profile.role = role.id;
    await profile.save();

    // const profile = await Profile.findByIdAndUpdate(profileId, {
    //   name: profileData.name,
    //   role,
    // });
    return profile;
  }
}

export const profileService = new ProfileService();
