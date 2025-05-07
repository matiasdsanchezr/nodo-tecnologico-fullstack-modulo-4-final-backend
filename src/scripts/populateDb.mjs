import "dotenv/config.js";
import { connectDB } from "../config/database.mjs";
import { Permission } from "../modules/role/permissionModel.mjs";
import { Role } from "../modules/role/roleModel.mjs";

const seedDataba = async () => {
  const permissions = await Permission.countDocuments();
  if (permissions === 0) {
    Permission.insertMany([
      { name: "create:profile", description: "create profiles" },
      { name: "delete:profile", description: "delete profiles" },
      { name: "edit:profile", description: "edit profiles" },
    ]);
  }

  const roles = await Role.countDocuments();
  if (roles === 0) {
    const createPermission = await Permission.findOne({
      name: "create:profile",
    });
    const deletePermission = await Permission.findOne({
      name: "delete:profile",
    });
    const editPermission = await Permission.findOne({ name: "edit:profile" });

    Role.create({
      name: "owner",
      description: "admin profile",
      permissions: [
        createPermission._id,
        deletePermission._id,
        editPermission._id,
      ],
    });

    Role.create({
      name: "standard",
      description: "standard adult profile",
      permissions: [],
    });

    Role.create({
      name: "kid",
      description: "for kids profiles",
      permissions: [],
    });
  }
};

connectDB().then(() => {
  seedDataba();
});
