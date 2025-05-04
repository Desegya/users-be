import { Router } from "express";
import { body } from "express-validator";
import { login, me } from "../controllers/authController";
import { validate } from "../middleware/validate";
import { protect } from "../middleware/auth";

const router = Router();

// POST /api/auth/login
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  validate,
  login
);

// GET /api/auth/me
router.get("/me", protect, me);

export default router;
