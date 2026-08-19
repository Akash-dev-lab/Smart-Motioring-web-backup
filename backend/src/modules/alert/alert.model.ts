import mongoose, { Schema, Model } from "mongoose";
import type { IAlertDocument } from "./types/index.js";

const alertSchema = new Schema<IAlertDocument>(
  {
    monitorId: {
      type: Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
    },
    incidentId: {
      type: Schema.Types.ObjectId,
      ref: "Incident",
      required: true,
    },
    type: {
      type: String,
      enum: ["EMAIL", "WEBHOOK"],
      default: "EMAIL",
    },
    status: {
      type: String,
      enum: ["SENT", "FAILED"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },

    ai: {
      status: String,
      reason: String,
      suggestion: [String],
    },
  },
  { timestamps: true }
);

const Alert: Model<IAlertDocument> =
  mongoose.models.Alert ||
  mongoose.model<IAlertDocument>("Alert", alertSchema);

export default Alert;
