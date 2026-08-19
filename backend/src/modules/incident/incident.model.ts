import mongoose, { Schema, Model } from "mongoose";
import type { IIncidentDocument } from "./types/index.js";

const incidentSchema = new Schema<IIncidentDocument>(
  {
    monitorId: {
      type: Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "RESOLVED"],
      default: "OPEN",
    },
    message: String,
    failCount: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: Date,
  },
  { timestamps: true }
);

incidentSchema.index({
  status: 1,
  createdAt: -1,
});

incidentSchema.index({
  monitorId: 1,
  createdAt: -1,
});

const Incident: Model<IIncidentDocument> =
  mongoose.models.Incident ||
  mongoose.model<IIncidentDocument>("Incident", incidentSchema);

export default Incident;
