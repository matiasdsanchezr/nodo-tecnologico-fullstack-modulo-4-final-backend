import { Schema, model } from "mongoose";

/**
 * @typedef {Object} Permission
 * @property {string} name
 * @property {string} description
 */

/**
 * @typedef {Object} PopulatedPermission
 * @property {string} name
 * @property {string} description
 */

const permissionSchema = new Schema(
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

export const Permission = model("Permission", permissionSchema);
