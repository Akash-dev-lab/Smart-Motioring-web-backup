import {
  Activity,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Gauge,
  Lightbulb,
  RefreshCcw,
  TrendingUp,
} from 'lucide-react';
import UplotLineChart from '../../../components/charts/UplotLineChart';
import { formatInterval } from '../dashboardUtils';

const getHealthStyle = (analytics) => {
  if (!analytics || analytics.totalChecks === 0) {
    return {
      badge: 'border-white/20 bg-white/5 text-[#B0B3B8]',
      dot: 'bg-white/20',
      label: 'NO LOGS',
    };
  }

  if (analytics.status === 'DOWN' || analytics.failures > 0) {
    return {
      badge: 'border-[#ffb4ab]/40 bg-[#93000a]/20 text-[#ffb4ab]',
      dot: 'bg-[#ffb4ab] shadow-[0_0_6px_rgba(255,180,171,0.8)]',
      label: analytics.status,
    };
  }

  return {
    badge: 'border-[#00E676] bg-[#00E676]/10 text-[#75ff9e]',
    dot: 'bg-[#00E676] shadow-[0_0_6px_rgba(0,230,118,0.8)]',
    label: analytics.status,
  };
};

const MetricTile = ({ label, value, tone = 'bg-[#111416]' }) => (
  <div className={`rounded border border-white/10 px-4 py-3 ${tone}`}>
    <p className="font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">{label}</p>
    <p className="mt-1 font-mono text-lg font-bold text-[#F5F5F5]">{value}</p>
  </div>
);

const formatDateTime = (value) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString([], {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  });
};

const DonutChart = ({ failures, success, total }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const failureRate = total ? failures / total : 0;
  const successRate = total ? success / total : 0;
  const failureDash = failureRate * circumference;
  const successDash = successRate * circumference;

  return (
    <div className="relative mx-auto h-36 w-36">
      <svg viewBox="0 0 120 120" role="img" aria-label="Success and failure donut chart" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#00E676"
          strokeDasharray={`${successDash} ${circumference - successDash}`}
          strokeLinecap="round"
          strokeWidth="16"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#ffb4ab"
          strokeDasharray={`${failureDash} ${circumference - failureDash}`}
          strokeDashoffset={-successDash}
          strokeLinecap="round"
          strokeWidth="16"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-mono text-2xl font-bold text-[#F5F5F5]">{total ? Math.round(failureRate * 100) : 0}%</p>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#B0B3B8]">FAIL</p>
        </div>
      </div>
    </div>
  );
};

const LatencyBarChart = ({ trend }) => {
  const points = trend?.slice(-10) || [];
  const maxLatency = Math.max(...points.map((point) => point.latency), 1);

  if (points.length === 0) {
    return (
      <div className="grid h-44 place-items-center rounded border border-dashed border-white/10 bg-[#111416] font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">
        No latency bars
      </div>
    );
  }

  return (
    <div className="rounded border border-white/10 bg-[#111416] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">Latency bars</p>
        <p className="font-mono text-xs uppercase tracking-wider text-[#75ff9e]">{maxLatency}ms max</p>
      </div>
      <div className="grid h-40 grid-flow-col items-end gap-2">
        {points.map((point, index) => {
          const height = Math.max(8, Math.round((point.latency / maxLatency) * 100));
          const isSlow = point.latency >= maxLatency * 0.7;

          return (
            <div key={`${point.time}-${index}`} className="grid h-full min-w-0 grid-rows-[minmax(0,1fr)_18px] gap-2">
              <div className="flex min-h-0 items-end rounded border border-white/5 bg-[#080B0D] p-1">
                <div
                  className={`w-full rounded-sm transition-all ${isSlow
                      ? 'bg-[#ffb4ab] shadow-[0_0_6px_rgba(255,180,171,0.5)]'
                      : 'bg-[#00E676] shadow-[0_0_6px_rgba(0,230,118,0.4)]'
                    }`}
                  title={`${point.time}: ${point.latency}ms`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="truncate text-center font-mono text-[9px] text-[#B0B3B8]">{point.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TrendChart = ({ trend }) => {
  const points = trend?.slice(-12) || [];
  const maxLatency = Math.max(...points.map((point) => point.latency), 1);

  if (points.length === 0) {
    return (
      <div className="grid min-h-[180px] place-items-center rounded border border-dashed border-white/10 bg-[#111416] font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">
        No trend logs
      </div>
    );
  }

  const chartPoints = points.map((point) => ({
    label: point.time,
    value: point.latency,
  }));

  return (
    <div className="rounded border border-white/10 bg-[#111416] p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded border border-white/10 bg-[#080B0D] text-[#75ff9e]">
            <TrendingUp size={16} />
          </span>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">Latency trend</p>
            <p className="font-bold text-sm text-[#F5F5F5]">{points.length} check buckets tracked</p>
          </div>
        </div>
        <span className="rounded border border-white/10 bg-[#080B0D] px-2.5 py-1 font-mono text-[10px] uppercase text-[#75ff9e]">
          {maxLatency}ms peak
        </span>
      </div>
      <UplotLineChart ariaLabel="Latency trend chart" color="#00E676" height={164} points={chartPoints} valueSuffix="ms" />
      <div className="mt-3 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-[#B0B3B8]">
        <span>{points[0]?.time}</span>
        <span>latest checks</span>
        <span>{points.at(-1)?.time}</span>
      </div>
    </div>
  );
};

const ReliabilityPanel = ({ analytics }) => {
  const total = analytics?.totalChecks || 0;
  const success = analytics?.success || 0;
  const failures = analytics?.failures || 0;
  const failureRate = total ? Math.round((failures / total) * 100) : 0;
  const successRate = total ? 100 - failureRate : 0;

  return (
    <div className="grid gap-4 rounded border border-white/10 bg-[#111416] p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded border border-white/10 bg-[#080B0D] text-[#00E676]">
          <Gauge size={16} />
        </span>
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">Reliability ratio</p>
          <p className="font-mono text-sm font-bold text-[#F5F5F5]">{total ? `${failureRate}% failing` : 'No checks yet'}</p>
        </div>
      </div>

      <DonutChart failures={failures} success={success} total={total} />

      <div className="grid grid-cols-2 gap-2">
        <MetricTile label="Passed" value={success} tone="bg-[#080B0D]" />
        <MetricTile label="Failed" value={failures} tone="bg-[#080B0D]" />
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-[#080B0D]">
        <div className="flex h-full w-full">
          <div className="h-full bg-[#00E676]" style={{ width: `${successRate}%` }} />
          <div className="h-full bg-[#ffb4ab]" style={{ width: `${failureRate}%` }} />
          {!total && <div className="h-full w-full bg-white/10" />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#00E676]" />
          Success
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffb4ab]" />
          Failure
        </div>
      </div>
    </div>
  );
};

const StatusDistributionChart = ({ monitors, analyticsByMonitorId }) => {
  const buckets = monitors.reduce((counts, monitor) => {
    const analytics = analyticsByMonitorId[monitor.id];

    if (!analytics || analytics.totalChecks === 0) {
      counts.noLogs += 1;
    } else if (analytics.status === 'DOWN' || analytics.failures > 0) {
      counts.down += 1;
    } else {
      counts.up += 1;
    }

    return counts;
  }, { down: 0, noLogs: 0, up: 0 });
  const total = Math.max(monitors.length, 1);
  const rows = [
    { color: 'bg-[#00E676] shadow-[0_0_6px_rgba(0,230,118,0.5)]', label: 'UP', value: buckets.up },
    { color: 'bg-[#ffb4ab] shadow-[0_0_6px_rgba(255,180,171,0.5)]', label: 'DOWN', value: buckets.down },
    { color: 'bg-white/20', label: 'NO LOGS', value: buckets.noLogs },
  ];

  return (
    <div className="rounded border border-white/10 bg-[#080B0D] p-6 shadow-[6px_6px_0_#0F172A] transition-all duration-200 hover:border-[#00E676] hover:shadow-[0_0_12px_rgba(0,230,118,0.2),6px_6px_0_#0F172A]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded border border-white/10 bg-[#111416] text-[#75ff9e]">
            <BarChart3 size={18} />
          </span>
          <div>
            <h3 className="font-bold text-lg text-[#F5F5F5]">Monitor distribution</h3>
            <p className="text-sm text-[#B0B3B8]">Status split across active monitor records.</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[72px_minmax(0,1fr)_36px] items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">{row.label}</span>
            <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-[#111416]">
              <div className={`h-full rounded-full ${row.color}`} style={{ width: `${Math.max(row.value ? 6 : 0, (row.value / total) * 100)}%` }} />
            </div>
            <span className="text-right font-mono text-sm font-bold text-[#F5F5F5]">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AIInsightPanel = ({ insight, incident }) => {
  if (!insight && !incident) {
    return (
      <div className="rounded border border-dashed border-white/10 bg-[#080B0D] p-4">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">
          <BrainCircuit size={15} className="text-[#75ff9e]" />
          AI summary
        </div>
        <p className="mt-2 text-sm text-[#B0B3B8]">
          No backend AI incident has been generated for this monitor yet.
        </p>
      </div>
    );
  }

  const suggestions = insight?.suggestions || [];

  return (
    <div className="rounded border border-white/10 bg-[#080B0D] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded border border-[#00E676]/30 bg-[#00E676]/10 text-[#75ff9e]">
            <BrainCircuit size={16} />
          </span>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">AI incident summary</p>
            <p className="font-mono text-xs font-bold uppercase text-[#75ff9e]">{insight?.status || incident?.status || 'Pending'}</p>
          </div>
        </div>
        <span className="rounded border border-white/10 bg-[#111416] px-2.5 py-1 font-mono text-[10px] text-[#B0B3B8]">
          {formatDateTime(insight?.createdAt || incident?.createdAt || incident?.startedAt)}
        </span>
      </div>

      {incident && (
        <div className="mt-3 flex items-start gap-2 rounded border border-white/10 bg-[#111416] p-3">
          <Clock3 className="mt-0.5 shrink-0 text-[#75ff9e]" size={15} />
          <p className="font-mono text-xs leading-5 text-[#B0B3B8]">
            {incident.message || 'Incident opened by backend failure processor'} with {incident.failCount ?? 0} failed checks.
          </p>
        </div>
      )}

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#F5F5F5]/90">
        {insight?.reason || 'AI analysis is waiting for enough failure context.'}
      </p>

      {suggestions.length > 0 && (
        <div className="mt-3 grid gap-2">
          {suggestions.map((suggestion, index) => (
            <div key={`${suggestion}-${index}`} className="flex items-start gap-2 rounded border border-[#00E676]/30 bg-[#00E676]/5 p-3">
              <Lightbulb className="mt-0.5 shrink-0 text-[#75ff9e]" size={15} />
              <p className="font-mono text-xs font-bold leading-5 text-[#75ff9e]">{suggestion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const IncidentsSection = ({
  aiInsightsByMonitorId,
  analyticsByMonitorId,
  analyticsError,
  incidentDetailsError,
  incidentsByMonitorId,
  isLoadingAnalytics,
  monitors,
  onRefresh,
}) => {
  const openIssueCount = monitors.filter((monitor) => {
    const analytics = analyticsByMonitorId[monitor.id];
    return analytics?.status === 'DOWN' || analytics?.failures > 0;
  }).length;
  const checkedCount = monitors.filter((monitor) => analyticsByMonitorId[monitor.id]?.totalChecks > 0).length;
  const aiInsightCount = Object.values(aiInsightsByMonitorId).reduce((count, insights) => count + (insights?.length || 0), 0);

  return (
    <section className="grid min-w-0 gap-5 pb-8 font-['Geist',sans-serif]">
      <div className="rounded border border-white/10 bg-[#080B0D] p-6 shadow-[6px_6px_0_#0F172A] transition-all duration-200 hover:border-[#00E676] hover:shadow-[0_0_12px_rgba(0,230,118,0.2),6px_6px_0_#0F172A]">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <h2 className="text-xl font-bold text-[#F5F5F5]">Incident signal</h2>
            <p className="mt-1 max-w-2xl text-sm text-[#B0B3B8]">
              Live incident health from backend monitor checks, log analytics, incident records, and AI summaries.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoadingAnalytics || monitors.length === 0}
              className="cursor-pointer inline-flex h-10 items-center justify-center gap-2 rounded border border-[#00E676] bg-transparent px-4 font-mono text-xs text-[#00E676] transition-all duration-200 hover:bg-[#00E676]/10 hover:shadow-[0_0_8px_rgba(0,230,118,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCcw className={isLoadingAnalytics ? 'animate-spin' : ''} size={15} />
              Refresh logs
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile label="Monitors" value={monitors.length} />
          <MetricTile label="With logs" value={checkedCount} />
          <MetricTile label="Needs attention" value={openIssueCount} />
          <MetricTile label="AI summaries" value={aiInsightCount} />
        </div>

        {(analyticsError || incidentDetailsError) && (
          <div className="mt-4 rounded border border-red-500/30 bg-red-500/10 p-3 font-mono text-xs text-[#ffb4ab]">
            {analyticsError || incidentDetailsError}
          </div>
        )}
      </div>

      <StatusDistributionChart analyticsByMonitorId={analyticsByMonitorId} monitors={monitors} />

      {monitors.length === 0 ? (
        <div className="rounded border border-dashed border-white/10 bg-[#080B0D] p-8 text-center shadow-[6px_6px_0_#0F172A]">
          <p className="text-lg font-bold text-[#F5F5F5]">No monitors yet</p>
          <p className="mt-2 text-sm text-[#B0B3B8]">
            Create a monitor first, then log analytics can appear here after checks run.
          </p>
        </div>
      ) : (
        <div className="grid min-w-0 gap-5 2xl:grid-cols-2">
          {monitors.map((monitor) => {
            const analytics = analyticsByMonitorId[monitor.id];
            const latestIncident = incidentsByMonitorId[monitor.id]?.[0];
            const latestInsight = aiInsightsByMonitorId[monitor.id]?.[0];
            const health = getHealthStyle(analytics);

            return (
              <article key={monitor.id} className="min-w-0 rounded border border-white/10 bg-[#080B0D] p-6 shadow-[6px_6px_0_#0F172A] transition-all duration-200 hover:border-[#00E676] hover:shadow-[0_0_12px_rgba(0,230,118,0.2),6px_6px_0_#0F172A]">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${health.dot}`} />
                      <h3 className="truncate text-lg font-bold text-[#F5F5F5]">{monitor.name}</h3>
                    </div>
                    <p className="mt-1 break-all font-mono text-xs text-[#B0B3B8]">{monitor.method} {monitor.url}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase text-[#B0B3B8]/60">Every {formatInterval(monitor.interval)}</p>
                  </div>
                  <span className={`shrink-0 rounded border px-2.5 py-1 font-mono text-[10px] uppercase ${health.badge}`}>
                    {isLoadingAnalytics && !analytics ? 'LOADING' : health.label}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricTile label="Checks" value={analytics?.totalChecks ?? '-'} />
                  <MetricTile label="Success" value={analytics?.success ?? '-'} />
                  <MetricTile label="Failures" value={analytics?.failures ?? '-'} />
                  <MetricTile label="Avg latency" value={analytics ? `${analytics.avgLatency}ms` : '-'} />
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <div className="mb-3 flex items-center gap-2">
                    <BarChart3 size={16} className="text-[#75ff9e]" />
                    <h4 className="font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">Log analytics</h4>
                  </div>
                </div>

                <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_300px] 2xl:items-stretch">
                  <TrendChart trend={analytics?.trend} />
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 rounded border border-white/10 bg-[#111416] px-3 py-2.5">
                      <CheckCircle2 size={16} className="text-[#00E676]" />
                      <span className="font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">Uptime</span>
                      <span className="ml-auto font-mono text-sm font-bold text-[#F5F5F5]">{analytics ? `${analytics.uptime}%` : '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded border border-white/10 bg-[#111416] px-3 py-2.5">
                      <AlertTriangle size={16} className="text-[#ffba79]" />
                      <span className="font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">Latest</span>
                      <span className="ml-auto font-mono text-sm font-bold text-[#F5F5F5]">{analytics?.status || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded border border-white/10 bg-[#111416] px-3 py-2.5">
                      <BarChart3 size={16} className="text-[#75ff9e]" />
                      <span className="font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">Trend</span>
                      <span className="ml-auto font-mono text-sm font-bold text-[#F5F5F5]">{analytics?.trend?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded border border-white/10 bg-[#111416] px-3 py-2.5">
                      <Activity size={16} className="text-[#ffb4ab]" />
                      <span className="font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">Signal</span>
                      <span className="ml-auto font-mono text-sm font-bold text-[#F5F5F5]">
                        {analytics?.failures ? 'Noisy' : 'Calm'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
                  <ReliabilityPanel analytics={analytics} />
                  <LatencyBarChart trend={analytics?.trend} />
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <div className="mb-3 flex items-center gap-2">
                    <BrainCircuit size={16} className="text-[#75ff9e]" />
                    <h4 className="font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">AI incident context</h4>
                  </div>
                  <AIInsightPanel insight={latestInsight} incident={latestIncident} />
                </div>
              </article>
            );
          })}
        </div>
      )}

      {isLoadingAnalytics && (
        <div className="fixed bottom-24 right-4 z-30 inline-flex items-center gap-2 rounded border border-white/10 bg-[#080B0D] px-4 py-3 font-mono text-xs text-[#F5F5F5] shadow-[0_0_12px_rgba(0,0,0,0.8)] lg:bottom-4">
          <Activity size={16} className="animate-pulse text-[#75ff9e]" />
          Loading log analytics
        </div>
      )}
    </section>
  );
};

export default IncidentsSection;
