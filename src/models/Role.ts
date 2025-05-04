import { Schema, model, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  description?: string;
  permissions: string[];
}

const RoleSchema = new Schema<IRole>(
  {
    name:        { type: String, required: true, unique: true },
    description: { type: String },
    permissions: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default model<IRole>('Role', RoleSchema);
