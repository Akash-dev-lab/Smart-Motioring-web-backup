import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    monitorId: {
      type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model("Log", logSchema);