// src/controllers/roleController.ts
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Role, { IRole } from '../models/Role';

// GET /api/roles
export const listRoles = async (req: Request, res: Response): Promise<void> => {
  const roles = await Role.find().lean();
  res.json(roles);
};

// GET /api/roles/:id
export const getRole = async (req: Request, res: Response): Promise<void> => {
  const role = await Role.findById(req.params.id).lean();
  if (!role) {
    res.status(404).json({ error: 'Role not found' });
    return;
  }
  res.json(role);
};

// POST /api/roles
export const createRole = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { name, description, permissions } = req.body;
  const exists = await Role.exists({ name });
  if (exists) {
    res.status(400).json({ error: 'Role name already in use' });
    return;
  }
  const role = await Role.create({ name, description, permissions });
  res.status(201).json(role);
};

// PUT /api/roles/:id
export const updateRole = async (req: Request, res: Response): Promise<void> => {
  const updates = req.body as Partial<IRole>;
  const role = await Role.findByIdAndUpdate(req.params.id, updates, { new: true }).lean();
  if (!role) {
    res.status(404).json({ error: 'Role not found' });
    return;
  }
  res.json(role);
};

// DELETE /api/roles/:id
export const deleteRole = async (req: Request, res: Response): Promise<void> => {
  const role = await Role.findByIdAndDelete(req.params.id).lean();
  if (!role) {
    res.status(404).json({ error: 'Role not found' });
    return;
  }
  res.json({ message: 'Role deleted successfully' });
};
