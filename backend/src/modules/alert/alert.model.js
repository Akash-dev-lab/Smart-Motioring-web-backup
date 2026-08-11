import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  monitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monitor",
    required: true
  },
  incidentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Incident",
    required: true
  },
  type: {
    type: String,
    enum: ["EMAIL", "WEBHOOK"],
    default: "EMAIL",
  },
  status: {
    type: String,
    enum: ["SENT", "FAILED"],
    required: true
  },
  message: {
    type: String,
    required: true
  },

  ai: {
    status: String,
    reason: String,
    suggestion: [String],
  }
}, { timestamps: true });

export default mongoose.model("Alert", alertSchema);