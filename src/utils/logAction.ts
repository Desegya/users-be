// src/utils/logAction.ts
import Log from "../models/Log";
import { Types } from "mongoose";

export async function logAction(
  actorId: Types.ObjectId,
  action: string,
  details?: string
) {
  try {
    await Log.create({ user: actorId, action, details });
  } catch (err) {
    console.error("Failed to log action:", action, err);
  }
}
