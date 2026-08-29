import { AlertTriangle, BarChart3, CheckCircle2, Timer } from 'lucide-react';
import { formatInterval, statusStyles } from '../dashboardUtils';

const DonutChart = ({ activeCount, pausedCount, totalCount }) => {
  const activePercent = totalCount ? (activeCount / totalCount) * 100 : 0;
  const circumference = 251.2;

  return (
    <div className="col-span-1 lg:col-span-5 flex flex-col justify-center rounded border border-white/10 border-t-2 border-t-[#00E676] bg-[#080B0D] p-6 shadow-[6px_6px_0_#0F172A] transition-all duration-200 hover:border-[#00E676] hover:shadow-[0_0_12px_rgba(0,230,118,0.2),6px_6px_0_#0F172A]">
      <div className="flex items-center gap-6 sm:gap-8">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 100 100" role="img" aria-label="Monitor active versus paused chart" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#00E676"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (activePercent / 100) * circumference}
              strokeWidth="8"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold text-[#F5F5F5]">{Math.round(activePercent)}%</span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#75ff9e]">ACTIVE</span>
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-bold text-[#F5F5F5]">Monitor state</h3>
          <p className="mb-4 text-sm text-[#B0B3B8]">Active records are eligible for backend scheduler checks.</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 font-mono text-xs text-[#F5F5F5]">
              <span className="h-3 w-3 rounded-full border border-[#00E676] bg-[#00E676]" />
              <span>Active {activeCount}</span>
            </li>
            <li className="flex items-center gap-2 font-mono text-xs text-[#B0B3B8]">
              <span className="h-3 w-3 rounded-full border border-[#B0B3B8]" />
              <span>Paused {pausedCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const IntervalBars = ({ monitors }) => {
  const maxInterval = Math.max(...monitors.map((monitor) => Number(monitor.interval || 0)), 1);
  const visibleMonitors = monitors.slice(0, 6);

  return (
    <article className="col-span-1 lg:col-span-5 flex flex-col justify-center rounded border border-white/10 bg-[#080B0D] p-6 shadow-[6px_6px_0_#0F172A] transition-all duration-200 hover:border-[#00E676] hover:shadow-[0_0_12px_rgba(0,230,118,0.2),6px_6px_0_#0F172A]">
      <h3 className="mb-2 text-lg font-bold text-[#F5F5F5]">Check intervals</h3>
      <p className="mb-6 text-sm text-[#B0B3B8]">Per-monitor interval values stored by the backend.</p>
      <div className="w-full space-y-4">
        {visibleMonitors.length === 0 ? (
          <div className="rounded border border-dashed border-white/10 p-4 font-mono text-xs text-[#B0B3B8]">
            No interval data yet
          </div>
        ) : (
          visibleMonitors.map((monitor) => (
            <div key={monitor.id} className="w-full">
              <div className="mb-2 flex items-end justify-between">
                <span className="max-w-[70%] truncate font-mono text-xs uppercase tracking-wider text-[#F5F5F5]">{monitor.name}</span>
                <span className="font-mono text-[10px] uppercase text-[#F5F5F5]">{formatInterval(monitor.interval)}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-[#080B0D]">
                <div
                  className="h-full rounded-full bg-green-500 opacity-80"
                  style={{ width: `${Math.max(6, (Number(monitor.interval || 0) / maxInterval) * 100)}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
};

const LogCoverageChart = ({ analyticsByMonitorId, monitors }) => {
  const rows = monitors.slice(0, 6).map((monitor) => ({
    monitor,
    checks: analyticsByMonitorId[monitor.id]?.totalChecks || 0,
  }));
  const maxChecks = Math.max(...rows.map((row) => row.checks), 1);

  return (
    <div className="col-span-1 lg:col-span-7 flex flex-col justify-center rounded border border-white/10 border-t-2 border-t-[#00E676] bg-[#080B0D] p-6 shadow-[6px_6px_0_#0F172A] transition-all duration-200 hover:border-[#00E676] hover:shadow-[0_0_12px_rgba(0,230,118,0.2),6px_6px_0_#0F172A]">
      <h3 className="mb-2 text-lg font-bold text-[#F5F5F5]">Log coverage</h3>
      <p className="mb-6 text-sm text-[#B0B3B8]">Recent check counts from backend log analytics.</p>
      <div className="w-full space-y-4">
        {rows.length === 0 ? (
          <div className="rounded border border-dashed border-white/10 p-4 font-mono text-xs text-[#B0B3B8]">
            No log data yet
          </div>
        ) : (
          rows.map(({ monitor, checks }) => (
            <div key={monitor.id} className="w-full">
              <div className="mb-2 flex items-end justify-between">
                <span className="max-w-[70%] truncate font-mono text-xs uppercase tracking-wider text-[#F5F5F5]">{monitor.name}</span>
                <span className="font-mono text-[10px] uppercase text-[#F5F5F5]">{checks} CHECKS</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-[#080B0D]">
                <div
                  className="h-full rounded-full bg-[#00E676] shadow-[0_0_8px_rgba(0,230,118,0.5)]"
                  style={{ width: `${Math.max(6, (checks / maxChecks) * 100)}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const OverviewSection = ({ activeCount, analyticsByMonitorId = {}, averageInterval, monitors, onViewMonitors, pausedCount, totalCount }) => (
  <>
    {/* Metrics Grid */}
    <section className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 font-['Geist',sans-serif]">
      {[
        {
          label: 'Total monitors',
          value: totalCount,
          note: 'Stored in backend',
          Icon: BarChart3,
          iconColor: 'text-[#75ff9e]',
        },
        {
          label: 'Active monitors',
          value: activeCount,
          note: 'Scheduler eligible',
          Icon: CheckCircle2,
          iconColor: 'text-[#93ffac]',
        },
        {
          label: 'Paused monitors',
          value: pausedCount,
          note: 'Currently disabled',
          Icon: AlertTriangle,
          iconColor: 'text-[#ffba79]',
        },
        {
          label: 'Avg interval',
          value: activeCount ? `${averageInterval}s` : '-',
          note: 'From monitor records',
          Icon: Timer,
          iconColor: 'text-[#62ff96]',
        },
      ].map(({ label, value, note, Icon, iconColor }) => (
        <div
          key={label}
          className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded border border-white/10 bg-[#080B0D] p-6 shadow-[6px_6px_0_#0F172A] transition-all duration-200 hover:border-[#00E676] hover:shadow-[0_0_12px_rgba(0,230,118,0.2),6px_6px_0_#0F172A]"
        >
          <div className="flex items-start justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B0B3B8]">
              {label}
            </span>
            <Icon size={22} className={iconColor} />
          </div>
          <div className="mt-4 font-mono text-3xl font-bold text-[#F5F5F5] md:text-4xl">
            {value}
          </div>
          <p className="mt-2 text-sm text-[#B0B3B8]">
            {note}
          </p>
        </div>
      ))}
    </section>

    <section className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-12 font-['Geist',sans-serif]">
      <DonutChart activeCount={activeCount} pausedCount={pausedCount} totalCount={totalCount} />
      <LogCoverageChart analyticsByMonitorId={analyticsByMonitorId} monitors={monitors} />
    </section>

    <section className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-12 pb-8 font-['Geist',sans-serif]">
      <article className="col-span-1 lg:col-span-7 flex flex-col rounded border border-white/10 bg-[#080B0D] p-6 shadow-[6px_6px_0_#0F172A] transition-all duration-200 hover:border-[#00E676] hover:shadow-[0_0_12px_rgba(0,230,118,0.2),6px_6px_0_#0F172A]">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#F5F5F5]">Monitor records</h3>
            <p className="mt-1 text-sm text-[#B0B3B8]">Backend-backed monitor configuration and active state.</p>
          </div>
          <button
            type="button"
            onClick={onViewMonitors}
            className="rounded border border-[#00E676] bg-transparent px-4 py-2 font-mono text-xs text-[#00E676] transition-all duration-200 hover:bg-[#00E676]/10 hover:shadow-[0_0_8px_rgba(0,230,118,0.2)]"
          >
            View monitors
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {monitors.length === 0 ? (
            <div className="col-span-full rounded border border-dashed border-white/10 p-4 font-mono text-xs text-[#B0B3B8]">
              No monitor records found
            </div>
          ) : (
            monitors.slice(0, 4).map((monitor) => (
              <div
                key={monitor.id}
                className="group rounded border border-white/10 bg-[#191c1e] p-4 transition-colors hover:border-[#75ff9e]/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="mb-1 truncate font-bold text-[#F5F5F5]">{monitor.name}</h4>
                    <p className="mb-2 truncate font-mono text-xs text-[#B0B3B8]">{monitor.method} {monitor.url}</p>
                    <span className="font-mono text-[10px] uppercase text-[#B0B3B8]">{formatInterval(monitor.interval)}</span>
                  </div>
                  <span
                    className={`shrink-0 rounded border px-2 py-1 font-mono text-[10px] uppercase ${monitor.status === 'active'
                        ? 'border-[#00E676] bg-[#00E676]/5 text-[#75ff9e]'
                        : monitor.status === 'paused'
                          ? 'border-[#ffba79] bg-[#ffba79]/5 text-[#ffba79]'
                          : 'border-white/20 bg-white/5 text-[#B0B3B8]'
                      }`}
                  >
                    {monitor.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </article>

      <IntervalBars monitors={monitors} />
    </section>
  </>
);

export default OverviewSection;
