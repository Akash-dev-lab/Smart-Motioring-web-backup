import mongoose from 'mongoose';
import { ALLOWED_HTTP_METHODS } from '../../utils/constants.js';
import { isValidMonitorUrl } from '../../utils/validators/monitor.validator.js';

const monitoringTargetSchema = new mongoose.Schema(
  {
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MonitoringRegion',
      required: [true, 'Monitoring region is required'],
    },

    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  }
);

const monitorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
      validate: {
        validator: isValidMonitorUrl,
        message: 'Please provide a valid HTTP/HTTPS URL',
      },
    },

    method: {
      type: String,
      uppercase: true,
      trim: true,
      default: 'GET',
      enum: {
        values: ALLOWED_HTTP_METHODS,
        message: '{VALUE} is not a supported HTTP method',
      },
    },

    interval: {
      type: Number,
      default: 60000,
      min: [5000, 'Minimum interval is 5000 ms'],
      max: [86400000, 'Maximum interval is 86400000 ms'],
    },

    active: {
      type: Boolean,
      default: true,
    },

    monitoringTargets: {
      type: [monitoringTargetSchema],
      default: [],
      validate: {
        validator: targets => {
          const regionIds = targets.map(target => target.region?.toString());

          return new Set(regionIds).size === regionIds.length;
        },
        message: 'Duplicate monitoring regions are not allowed',
      },
    },
  },
  { timestamps: true }
);

monitorSchema.index({ active: 1 });

monitorSchema.index({
  userId: 1,
  createdAt: -1,
});

monitorSchema.index(
  {
    userId: 1,
    url: 1,
    method: 1,
  },
  {
    unique: true,
    name: 'unique_user_monitor',
  }
);

export default mongoose.model('Monitor', monitorSchema);
