import { Request, Response } from "express";
import Log from "../models/Log";

/**
 * GET /api/logs
 * List activity logs (paginated)
 */
export const listLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "10", 10);
    const skip = (page - 1) * limit;

    const [total, logs] = await Promise.all([
      Log.countDocuments(),
      Log.find()
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email") // include actor’s name & email
        .lean(),
    ]);

    res.json({
      logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("listLogs error:", err);
    res.status(500).json({ error: "Server error listing logs" });
  }
};
