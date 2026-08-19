import mongoose, { Schema, Model } from "mongoose";
import type { IAIInsightDocument } from "./types/index.js";

const aiSchema = new Schema<IAIInsightDocument>(
  {
    monitorId: {
      type: Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
      index: true,
    },

    incidentId: {
      type: Schema.Types.ObjectId,
      ref: "Incident",
      default: null,
      index: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["STABLE", "UNSTABLE", "DEGRADED", "DOWN", "ERROR", "UNKNOWN"],
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    suggestion: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const AIInsight: Model<IAIInsightDocument> =
  mongoose.models.AIInsight ||
  mongoose.model<IAIInsightDocument>("AIInsight", aiSchema);

export default AIInsight;
