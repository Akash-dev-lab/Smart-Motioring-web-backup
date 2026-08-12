import mongoose from "mongoose";

const aiSchema = new mongoose.Schema(
  {
    monitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
      index: true,
    },

    incidentId: {
      type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model("AIInsight", aiSchema);