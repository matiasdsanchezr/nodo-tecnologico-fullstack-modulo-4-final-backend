import { Schema, model } from "mongoose";
import { Profile } from "../profile/profileModel.mjs";

/**
 * @typedef {Object} User
 * @property {string} username
 * @property {string} email
 * @property {import('mongoose').Types.ObjectId} ownerProfile
 * @property {import('mongoose').Types.ObjectId[]} additionalProfiles
 */

/**
 * @typedef {Object} PopulatedUser
 * @property {string} username
 * @property {string} email
 * @property {import("../profile/profileModel.mjs").PopulatedProfile} ownerProfile
 * @property {import("../profile/profileModel.mjs").PopulatedProfile[]} additionalProfiles
 */

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profiles: {
      type: [Schema.Types.ObjectId],
      ref: "Profile",
      validate: {
        validator: function (arr) {
          return arr.length <= 4; // Máximo 4 elementos
        },
        message: (props) =>
          `Un usuario solo puede tener 4 perfiles! Tienes ${props.value.length}`,
      },
      default: [],
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        return { id: ret._id, username: ret.username, email: ret.email };
      },
    },
    timestamps: true,
  }
);

// Borrar los perfiles asociados a usuario
userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const userId = this._id;
    const profilesToDelete = await Profile.find({ user: userId });
    for (const profile of profilesToDelete) {
      await profile.deleteOne();
    }
    next();
  }
);

export const User = model("User", userSchema);
