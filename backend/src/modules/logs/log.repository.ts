import Log from "./log.model.js";
import type {
  CreateLogInput,
  ILogDocument,
  LogQueryOptions,
} from "./types/index.js";

// Mongoose v9 does not export a public FilterQuery alias. Using `unknown` double-cast
// is the documented approach when the public filter type isn't exposed.
// The public function signatures remain fully typed — only the boundary to
// Mongoose's internal type uses a minimal cast.
type MonitorIdInput = string;

export const createLog = async (data: CreateLogInput): Promise<ILogDocument> => {
  return Log.create(data);
};

export const getLogsByMonitorId = async (
  monitorId: MonitorIdInput,
  { limit = 50, lean = true }: LogQueryOptions = {}
): Promise<ILogDocument[]> => {
  const filter = { monitorId } as unknown as Parameters<(typeof Log)["find"]>[0];
  const query = Log.find(filter).sort({ createdAt: -1 }).limit(limit);

  return lean ? query.lean() : query;
};

export const getRecentLogs = async (
  monitorId: MonitorIdInput,
  count = 30
): Promise<ILogDocument[]> => {
  const filter = { monitorId } as unknown as Parameters<(typeof Log)["find"]>[0];
  return Log.find(filter).sort({ createdAt: -1 }).limit(count).lean();
};

export const countLogs = async (
  filter: Record<string, unknown> = {}
): Promise<number> => {
  return Log.countDocuments(
    filter as unknown as Parameters<(typeof Log)["countDocuments"]>[0]
  );
};

export const countSuccessLogs = async (
  filter: Record<string, unknown> = {}
): Promise<number> => {
  const merged = { ...filter, success: true };
  return Log.countDocuments(
    merged as unknown as Parameters<(typeof Log)["countDocuments"]>[0]
  );
};
