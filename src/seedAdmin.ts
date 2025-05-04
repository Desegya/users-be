// src/seedAdmin.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("🗄️  Connected to MongoDB");

    const exists = await User.findOne({ email: "admin@example.com" });
    if (exists) {
      console.log("⚠️  Admin already exists");
      process.exit(0);
    }

    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123", // will be hashed by your model's pre-save hook
      role: "admin",
      status: "Active",
      photo: "",
    });

    console.log("✅ Admin seeded:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
