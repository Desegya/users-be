import { Router } from "express";
import { body, query } from "express-validator";
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { protect } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validate";

const router = Router();

// All routes require auth
router.use(protect);

// GET /api/users
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1 }),
  ],
  validate,
  listUsers
);

// GET /api/users/:id
router.get("/:id", getUser);

// POST /api/users
router.post(
  "/",
  authorize("admin", "manager"),
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").notEmpty(),
    body("status").notEmpty(),
  ],
  validate,
  createUser
);

// PUT /api/users/:id
router.put("/:id", authorize("admin", "manager"), updateUser);

// DELETE /api/users/:id
router.delete("/:id", authorize("admin"), deleteUser);

export default router;
