// src/controllers/userController.ts
import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import { validationResult } from 'express-validator';

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  const page  = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '10', 10);
  const skip  = (page - 1) * limit;

  const [ total, data ] = await Promise.all([
    User.countDocuments(),
    User.find()
      .skip(skip)
      .limit(limit)
      .select('-password')
      .lean()
  ]);

  res.json({ data, meta: { total, page, limit } });
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, email, password, role, status, photo } = req.body;
  if (await User.exists({ email })) {
    res.status(400).json({ error: 'Email already in use' });
    return;
  }

  const user = await User.create({ name, email, password, role, status, photo });
  res.status(201).json({
    message: 'User created',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      photo: user.photo
    }
  });
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const updates = { ...req.body };
  delete (updates as any).password;

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true
  }).select('-password');

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ message: 'User updated', user });
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ message: 'User deleted' });
};
