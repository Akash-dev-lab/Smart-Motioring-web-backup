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
    const { url, method, interval } = req.body;

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

    const monitor = await createMonitor({
      url,
      method,
      interval,
      userId: req.user.userId,
    });
    return res.status(201).json({
      success: true,
      message: 'Monitor created successfully',
      data: monitor,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if(err) {
      return res.status(409).json({
        success: false,
        message: err.message
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getAllMonitorsController = async (req, res) => {
  try {
    const monitors = await getAllMonitors(req.user.userId);

    return res.json({
      success: true,
      message: 'Monitors fetched successfully',
      count: monitors.length,
      data: monitors,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

// 🔥 GET BY ID
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

// 🔥 UPDATE
export const updateMonitorController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {       // Validate ObjectId in the controller
      return res.status(400).json({             //This is cleaner, avoids unnecessary database
        success: false,                        //calls, and scales well as more modules are added.
        message: 'Invalid monitor ID',         // It first check the id and then make the db calls.
      });
    }

    const updated = await updateMonitorById(id, req.user.userId, req.body);

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
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

// 🔥 DELETE
export const deleteMonitorController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {     //same with this controller, check the id first
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

    const monitor = await pauseMonitor(
      id,
      req.user.userId
    );

    if (!monitor) {
      return res.status(404).json({
        success: false,
        message: "Monitor not found",
      });
    }

    return res.json({
      success: true,
      message: "Monitor paused successfully",
      data: monitor,
    });

  } catch (err) {

    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid monitor ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const resumeMonitorController = async (req, res) => {
  try {
    const { id } = req.params;

    const monitor = await resumeMonitor(
      id,
      req.user.userId
    );

    if (!monitor) {
      return res.status(404).json({
        success: false,
        message: "Monitor not found",
      });
    }

    return res.json({
      success: true,
      message: "Monitor resumed successfully",
      data: monitor,
    });

  } catch (err) {

    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid monitor ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};