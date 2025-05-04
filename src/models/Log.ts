import { Schema, model, Document, Types } from "mongoose";

export interface ILog extends Document {
  action: string;
  user: Types.ObjectId; // the actor’s user ID
  details?: string;
  timestamp: Date;
}

const LogSchema = new Schema<ILog>(
  {
    action: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    details: { type: String },
  },
  {
    timestamps: { createdAt: "timestamp", updatedAt: false },
  }
);

export default model<ILog>("Log", LogSchema);
