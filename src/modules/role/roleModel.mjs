import { Schema, model } from "mongoose";
import { Permission } from "./permissionModel.mjs";

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
