import {
  createMonitoringRegion,
  getMonitoringRegions,
  getMonitoringRegionById,
  updateMonitoringRegion,
  deleteMonitoringRegion,
} from "./monitoring-region.service.js";

const handleError = (res, err) => {
  if (
    err.name === "ValidationError" ||
    err.message?.includes("already exists")
  ) {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err.message === "Monitoring region not found") {
    return res.status(404).json({ success: false, message: err.message });
  }

  if (err.message === "Invalid monitoring region ID") {
    return res.status(400).json({ success: false, message: err.message });
  }

  console.error("Monitoring region error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export const createMonitoringRegionController = async (req, res) => {
  try {
    const region = await createMonitoringRegion(req.body);
    return res.status(201).json({
      success: true,
      message: "Monitoring region created successfully",
      data: region,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getMonitoringRegionsController = async (req, res) => {
  try {
    let enabled;
    if (req.query.enabled !== undefined) {
      if (!["true", "false"].includes(req.query.enabled)) {
        return res.status(400).json({
          success: false,
          message: "enabled must be true or false",
        });
      }
      enabled = req.query.enabled === "true";
    }

    const regions = await getMonitoringRegions({ enabled });
    return res.json({ success: true, count: regions.length, data: regions });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getMonitoringRegionByIdController = async (req, res) => {
  try {
    const region = await getMonitoringRegionById(req.params.id);
    return res.json({ success: true, data: region });
  } catch (err) {
    return handleError(res, err);
  }
};

export const updateMonitoringRegionController = async (req, res) => {
  try {
    const region = await updateMonitoringRegion(req.params.id, req.body);
    return res.json({
      success: true,
      message: "Monitoring region updated successfully",
      data: region,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const deleteMonitoringRegionController = async (req, res) => {
  try {
    await deleteMonitoringRegion(req.params.id);
    return res.json({
      success: true,
      message: "Monitoring region deleted successfully",
    });
  } catch (err) {
    return handleError(res, err);
  }
};
