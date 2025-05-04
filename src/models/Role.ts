// src/models/Role.ts
import { Schema, model, Document } from 'mongoose';
import { ALL_PERMISSIONS, Permission } from '../utils/permissions';

type PermissionsMap = Record<Permission, boolean>;

export interface IRole extends Document {
  name: string;
  description?: string;
  permissions: PermissionsMap;
}

const permsSchemaDef: Record<Permission, any> = {} as any;
ALL_PERMISSIONS.forEach((perm) => {
  permsSchemaDef[perm] = { type: Boolean, default: false };
});

const RoleSchema = new Schema<IRole>(
  {
    name:        { type: String, required: true, unique: true },
    description: { type: String },
    permissions: { type: Object, of: Boolean, default: {} },
  },
  { timestamps: true }
);

// Ensure all keys exist
RoleSchema.pre('save', function () {
  const perms = this.permissions as PermissionsMap;
  ALL_PERMISSIONS.forEach((p) => {
    if (perms[p] === undefined) perms[p] = false;
  });
});

export default model<IRole>('Role', RoleSchema);
