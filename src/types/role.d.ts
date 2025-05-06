import mongoose from "mongoose";

interface Permission {
  name: string;
  description: string;
}

interface PopulatedPermission {
  name: string;
  description: string;
}

interface Role {
  name: string;
  description: string;
  permissions: mongoose.Types.ObjectId[];
}

interface PopulatedRole {
  name: string;
  description: string;
  permissions: Permission[];
}
