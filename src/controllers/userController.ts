// src/controllers/userController.ts
import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import { validationResult } from "express-validator";
import { AuthRequest } from "../middleware/auth";
import { logAction } from "../utils/logAction";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

/**
 * GET /api/users
 */
export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "10", 10);
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      User.countDocuments(),
      User.find().skip(skip).limit(limit).select("-password").lean(),
    ]);

    const response: PaginatedResponse<IUser> = {
      data,
      meta: { total, page, limit },
    };
    res.json(response);
  } catch (err) {
    console.error("listUsers error:", err);
    res.status(500).json({ error: "Server error listing users" });
  }
};

/**
 * GET /api/users/:id
 */
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    console.error("getUser error:", err);
    res.status(500).json({ error: "Server error fetching user" });
  }
};

/**
 * POST /api/users
 */
export const createUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { name, email, password, role, status, photo } = req.body;

    if (await User.exists({ email })) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      status,
      photo,
    });

    // log action
    await logAction(req.user!._id, "Created user", `User ${user._id} created`);

    res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        photo: user.photo,
      },
    });
  } catch (err) {
    console.error("createUser error:", err);
    res.status(500).json({ error: "Server error creating user" });
  }
};

/**
 * PUT /api/users/:id
 */
export const updateUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const updates = { ...req.body };
    delete (updates as any).password; // disallow password changes here

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    })
      .select("-password")
      .lean();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // log action
    await logAction(req.user!._id, "Updated user", `User ${user.id} updated`);

    res.json({ message: "User updated", user });
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ error: "Server error updating user" });
  }
};

/**
 * DELETE /api/users/:id
 */
export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).lean();
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // log action
    await logAction(
      req.user!._id,
      "Deleted user",
      `User ${req.params.id} deleted`
    );

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ error: "Server error deleting user" });
  }
};
