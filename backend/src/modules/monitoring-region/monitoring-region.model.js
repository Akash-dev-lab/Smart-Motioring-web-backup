import mongoose from "mongoose";

const monitoringRegionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "Monitoring Region key is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Region key must contain lowercase letters, numbers, and hyphens only",
      ],
    },
    name: {
      type: String,
      required: [true, "Region name is required"],
      trim: true,
      minlength: [2, "Region name must be at least 2 characters"],
      maxlength: [100, "Region name cannot exceed 100 characters"],
    },
    provider: {
      type: String,
      required: [true, "Provider is required"],
      lowercase: true,
      trim: true,
      default: "aws",
    },
    enabled: {
      type: Boolean,
      default: true,
      index: true,
    },
    workerQueue: {
      type: String,
      required: [true, "Worker queue is required"],
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

monitoringRegionSchema.index({ enabled: 1, name: 1 });

export default mongoose.model("MonitoringRegion", monitoringRegionSchema);
