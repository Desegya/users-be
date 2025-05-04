// src/controllers/roleController.ts
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Role, { IRole } from "../models/Role";
import { AuthRequest } from "../middleware/auth";
import { logAction } from "../utils/logAction";
import { ALL_PERMISSIONS, Permission } from "../utils/permissions";

/**
 * GET /api/roles
 */
export const listRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await Role.find().lean();
    res.json(roles);
  } catch (err) {
    console.error("listRoles error:", err);
    res.status(500).json({ error: "Server error listing roles" });
  }
};

/**
 * GET /api/roles/:id
 */
export const getRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const role = await Role.findById(req.params.id).lean();
    if (!role) {
      res.status(404).json({ error: "Role not found" });
      return;
    }
    res.json(role);
  } catch (err) {
    console.error("getRole error:", err);
    res.status(500).json({ error: "Server error fetching role" });
  }
};

/**
 * POST /api/roles
 */
export const createRole = async (
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
    const { name, description, permissions } = req.body as {
      name: string;
      description?: string;
      permissions: Partial<Record<Permission, boolean>>;
    };

    const permsMap: Record<Permission, boolean> = {} as any;
    ALL_PERMISSIONS.forEach((p) => {
      permsMap[p] = Boolean(permissions[p]);
    });

    if (await Role.exists({ name })) {
      res.status(400).json({ error: "Role name already in use" });
      return;
    }

    const role = await Role.create({
      name,
      description,
      permissions: permsMap,
    });

    // log action
    await logAction(
      req.user!._id,
      "Created role",
      `Role ${role._id} (${role.name}) created`
    );

    res.status(201).json(role);
  } catch (err) {
    console.error("createRole error:", err);
    res.status(500).json({ error: "Server error creating role" });
  }
};

/**
 * PUT /api/roles/:id
 */
export const updateRole = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const updates = req.body as Partial<IRole>;
    const role = await Role.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).lean();

    if (!role) {
      res.status(404).json({ error: "Role not found" });
      return;
    }

    // log action
    await logAction(req.user!._id, "Updated role", `Role ${role._id} updated`);

    res.json(role);
  } catch (err) {
    console.error("updateRole error:", err);
    res.status(500).json({ error: "Server error updating role" });
  }
};

/**
 * DELETE /api/roles/:id
 */
export const deleteRole = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id).lean();
    if (!role) {
      res.status(404).json({ error: "Role not found" });
      return;
    }

    // log action
    await logAction(
      req.user!._id,
      "Deleted role",
      `Role ${req.params.id} (${role.name}) deleted`
    );

    res.json({ message: "Role deleted successfully" });
  } catch (err) {
    console.error("deleteRole error:", err);
    res.status(500).json({ error: "Server error deleting role" });
  }
};
