import { Router } from "express";
import { query } from "express-validator";
import { listLogs } from "../controllers/logController";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";

const router = Router();

// Protected
router.use(protect);

// GET /api/logs?page=&limit=
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1 }),
  ],
  validate,
  listLogs
);

export default router;
