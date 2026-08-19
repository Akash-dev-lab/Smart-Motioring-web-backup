import Incident from "./incident.model.js";
import type {
  CreateIncidentInput,
  IIncidentDocument,
} from "./types/index.js";

// monitorId from callers (worker/processor) is a string;
// Mongoose coerces it to ObjectId at query time.
type MonitorIdInput = string | { toString(): string };

export const createIncident = async ({
  monitorId,
  failCount,
}: CreateIncidentInput): Promise<IIncidentDocument> => {
  return Incident.create({
    monitorId,
    failCount,
    message: `Monitor failed ${failCount} times`,
  });
};

export const resolveIncident = async (
  monitorId: MonitorIdInput
): Promise<IIncidentDocument | null> => {
  return Incident.findOneAndUpdate(
    { monitorId, status: "OPEN" } as unknown as Parameters<typeof Incident.findOneAndUpdate>[0],
    {
      status: "RESOLVED",
      resolvedAt: new Date(),
    },
    { new: true }
  );
};

export const getOpenIncident = async (
  monitorId: MonitorIdInput
): Promise<IIncidentDocument | null> => {
  return Incident.findOne(
    { monitorId, status: "OPEN" } as unknown as Parameters<typeof Incident.findOne>[0]
  );
};
