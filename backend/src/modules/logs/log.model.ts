import mongoose, { Schema, Model } from "mongoose";
import type { ILogDocument } from "./types/index.js";

const logSchema = new Schema<ILogDocument>(
  {
    monitorId: {
      type: Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
      index: false,
    },

    status: {
      type: Number,
      required: true,
      min: 100,
      max: 599,
    },

    responseTime: {
      type: Number,
      required: true,
      min: 0,
    },

    success: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Fast monitor-wise log retrieval / analytics
logSchema.index({
  monitorId: 1,
  createdAt: -1,
});

// Automatically delete logs after 7 days
logSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 7,
  }
);

const Log: Model<ILogDocument> =
  mongoose.models.Log || mongoose.model<ILogDocument>("Log", logSchema);

export default Log;
