import mongoose from 'mongoose';
import {
  createMonitor,
  getAllMonitors,
  getMonitorById,
  updateMonitorById,
  deleteMonitorById,
  pauseMonitor,
  resumeMonitor
} from './monitor.service.js';

export const createMonitorController = async (req, res) => {
  try {
    const {
      url,
      method,
      interval,
      monitoringTargets,
    } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required',
      });
    }

    if (!method) {
      return res.status(400).json({
        success: false,
        message: 'HTTP method is required',
      });
    }

    if (interval == null) {
      return res.status(400).json({
        success: false,
        message: 'Interval is required',
      });
    }

    if (!Array.isArray(monitoringTargets)) {
      return res.status(400).json({
        success: false,
        message: 'monitoringTargets must be an array',
      });
    }

    if (!monitoringTargets.length) {
      return res.status(400).json({
        success: false,
        message: 'monitoringTargets array must be hold a value.',
      });
    }

    const monitor = await createMonitor({
      url,
      method,
      interval,
      monitoringTargets,
      userId: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: 'Monitor created successfully',
      data: monitor,
    });
  } catch (err) {
    if (
      err.name === 'ValidationError' ||
      err.name === 'CastError' ||
      err.message?.includes('required') ||
      err.message?.includes('monitoring target') ||
      err.message?.includes('monitoring regions') ||
      err.message?.includes('Duplicate')
    ) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(409).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllMonitorsController = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = '',
      active,
      method,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page must be a positive integer',
      });
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100',
      });
    }

    if (active !== undefined && active !== 'true' && active !== 'false') {
      return res.status(400).json({
        success: false,
        message: 'Active must be true or false',
      });
    }

    const activeFilter =
      active === undefined ? undefined : active === 'true';

    const result = await getAllMonitors(req.user.userId, {
      page,
      limit,
      search,
      active: activeFilter,
      method,
      sortBy,
      sortOrder,
    });

    return res.json({
      success: true,
      message: 'Monitors fetched successfully',
      count: result.monitors.length,
      data: result.monitors,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNextPage: result.page < result.totalPages,
        hasPreviousPage: result.page > 1,
      },
    });
  } catch (err) {
    console.error('Get monitors error:', err);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getMonitorByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid monitor ID',
      });
    }

    const monitor = await getMonitorById(id, req.user.userId);

    if (!monitor) {
      return res.status(404).json({
        success: false,
        message: 'Monitor not found or unauthorized',
      });
    }

    return res.json({
      success: true,
      message: 'Monitor fetched successfully',
      data: monitor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const updateMonitorController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid monitor ID',
      });
    }

    const updated = await updateMonitorById(
      id,
      req.user.userId,
      req.body
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Monitor not found or unauthorized',
      });
    }

    return res.json({
      success: true,
      message: 'Monitor updated successfully',
      data: updated,
    });
  } catch (err) {
    if (
      err.name === 'ValidationError' ||
      err.name === 'CastError' ||
      err.message?.includes('monitoring target') ||
      err.message?.includes('monitoring regions') ||
      err.message?.includes('Duplicate')
    ) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const deleteMonitorController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid monitor ID',
      });
    }

    const deleted = await deleteMonitorById(id, req.user.userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Monitor not found or unauthorized',
      });
    }

    return res.json({ success: true, message: 'Monitor deleted' });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const pauseMonitorController = async (req, res) => {
  try {
    const { id } = req.params;

    const monitor = await pauseMonitor(id, req.user.userId);

    if (!monitor) {
      return res.status(404).json({
        success: false,
        message: 'Monitor not found',
      });
    }

    return res.json({
      success: true,
      message: 'Monitor paused successfully',
      data: monitor,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid monitor ID',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const resumeMonitorController = async (req, res) => {
  try {
    const { id } = req.params;

    const monitor = await resumeMonitor(id, req.user.userId);

    if (!monitor) {
      return res.status(404).json({
        success: false,
        message: 'Monitor not found',
      });
    }

    return res.json({
      success: true,
      message: 'Monitor resumed successfully',
      data: monitor,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid monitor ID',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
