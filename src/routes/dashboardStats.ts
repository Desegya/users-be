// routes/dashboardStats.ts
import express from "express";
import User from "../models/User";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "Active" });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newSignups = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const pendingInvites = await User.countDocuments({ status: "invited" }); // Adjust to match your model

    res.json({
      totalUsers,
      activeUsers,
      newSignups,
      pendingInvites,
    });
  } catch (err) {
    console.error("Error getting dashboard stats:", err);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

export default router;
