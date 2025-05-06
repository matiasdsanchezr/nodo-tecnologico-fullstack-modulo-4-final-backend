import { model, Schema } from "mongoose";

/**
 * @typedef {Object} Profile
 * @property {import('mongoose').Types.ObjectId} user
 * @property {string} name
 * @property {import('mongoose').Types.ObjectId} role
 */

/**
 * @typedef {Object} PopulatedProfile
 * @property {import("../user/userModel.mjs").User} user
 * @property {string} name
 * @property {import("../../types/role").PopulatedRole} role
 */

const profileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    timestamps: true,
  }
);

// Índice compuesto para asegurar que un usuario no tenga perfiles con el mismo nombre
// profileSchema.index({ user: 1, name: 1 }, { unique: true });

// Middleware que solo haya un perfil owner por usuario
// profileSchema.pre("save", async function (next) {
//   // @ts-ignore
//   if (this.role.name) {
//     const existingOwner = await Profile.findOne({
//       user: this.user,
//       isOwnerProfile: true,
//     });

//     if (existingOwner && !existingOwner._id.equals(this._id)) {
//       throw new Error("El usuario ya tiene un perfil owner");
//     }
//   }
//   next();
// });

export const Profile = model("Profile", profileSchema);
