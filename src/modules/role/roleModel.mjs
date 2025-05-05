import { Schema, model } from "mongoose";
import { Permission } from "../permission/permissionModel.mjs";

/**
 * @typedef {Object} Role
 * @property {string} name
 * @property {string} description
 * @property {import('mongoose').Types.ObjectId[]} permissions
 */

/**
 * @typedef {Object} PopulatedRole
 * @property {string} name
 * @property {string} description
 * @property {import("../permission/permissionModel.mjs").Permission[]} permissions
 */

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v; // Eliminar __v
        ret.id = ret._id; // Crear campo id con el valor de _id
        delete ret._id; // Eliminar _id
        return ret;
      },
    },
  }
);

export const Role = model("Role", roleSchema);
