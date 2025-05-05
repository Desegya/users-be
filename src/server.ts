import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import roleRoutes from "./routes/roles";
import logRoutes from "./routes/logs";
import dashboardStatsRouter from "./routes/dashboardStats";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Mount routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/logs", logRoutes);
app.use("/stats", dashboardStatsRouter);

app.get("/", (_req: Request, res: Response): void => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
