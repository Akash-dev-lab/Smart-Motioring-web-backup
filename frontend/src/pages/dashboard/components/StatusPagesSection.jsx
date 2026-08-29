import { Activity, AlertTriangle, CheckCircle2, RefreshCcw, Signal } from 'lucide-react';
import { formatInterval } from '../dashboardUtils';

const getMonitorState = (monitor, analytics) => {
  if (!monitor.active) {
    return {
      badge: 'border-white/20 bg-white/5 text-[#B0B3B8]',
      dot: 'bg-white/20',
      label: 'Paused',
    };
  }

  if (analytics?.status === 'DOWN' || analytics?.failures > 0) {
    return {
      badge: 'border-[#ffb4ab]/40 bg-[#93000a]/20 text-[#ffb4ab]',
      dot: 'bg-[#ffb4ab] shadow-[0_0_6px_rgba(255,180,171,0.8)]',
      label: 'Investigating',
    };
  }

  if (analytics?.totalChecks > 0) {
    return {
      badge: 'border-[#00E676] bg-[#00E676]/10 text-[#75ff9e]',
      dot: 'bg-[#00E676] shadow-[0_0_6px_rgba(0,230,118,0.8)]',
      label: 'Operational',
    };
  }

  return {
    badge: 'border-[#ffba79]/40 bg-[#ffba79]/10 text-[#ffba79]',
    dot: 'bg-[#ffba79] shadow-[0_0_6px_rgba(255,186,121,0.8)]',
    label: 'Waiting for logs',
  };
};

const SummaryCard = ({ icon: Icon, iconColor = 'text-[#75ff9e]', label, value }) => (
  <article className="rounded border border-white/10 bg-[#111416] p-4 transition-all duration-200 hover:border-white/20">
    <div className="flex items-center gap-3">
      <span className={`grid h-10 w-10 place-items-center rounded border border-white/10 bg-[#080B0D] ${iconColor}`}>
        <Icon size={18} />
      </span>
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">{label}</p>
        <p className="mt-1 font-mono text-2xl font-bold text-[#F5F5F5]">{value}</p>
      </div>
    </div>
  </article>
);

const StatusPagesSection = ({
  analyticsByMonitorId,
  isLoadingAnalytics,
  isLoadingSummary,
  monitors,
  onRefresh,
  summary,
  summaryError,
}) => (
  <section className="grid min-w-0 gap-5 pb-8 font-['Geist',sans-serif]">
    <div className="rounded border border-white/10 bg-[#080B0D] p-6 shadow-[6px_6px_0_#0F172A] transition-all duration-200 hover:border-[#00E676] hover:shadow-[0_0_12px_rgba(0,230,118,0.2),6px_6px_0_#0F172A]">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5]">Status pages</h2>
          <p className="mt-1 text-sm text-[#B0B3B8]">
            Backend summary plus monitor health calculated from saved monitor records and check logs.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="cursor-pointer inline-flex h-10 items-center justify-center gap-2 rounded border border-[#00E676] bg-transparent px-4 font-mono text-xs text-[#00E676] transition-all duration-200 hover:bg-[#00E676]/10 hover:shadow-[0_0_8px_rgba(0,230,118,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCcw className={isLoadingSummary || isLoadingAnalytics ? 'animate-spin' : ''} size={15} />
          Refresh status
        </button>
      </div>

      {summaryError && (
        <div className="mt-4 rounded border border-red-500/30 bg-red-500/10 p-3 font-mono text-xs text-[#ffb4ab]">
          {summaryError}
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <SummaryCard icon={Signal} iconColor="text-[#75ff9e]" label="Backend monitors" value={summary?.totalMonitors ?? monitors.length} />
        <SummaryCard icon={AlertTriangle} iconColor="text-[#ffba79]" label="Open incidents" value={summary?.activeIncidents ?? '-'} />
        <SummaryCard icon={CheckCircle2} iconColor="text-[#00E676]" label="Global uptime" value={summary?.uptime != null ? `${summary.uptime}%` : '-'} />
      </div>
    </div>

    <div className="grid min-w-0 gap-4 xl:grid-cols-2">
      {monitors.length === 0 ? (
        <div className="col-span-full rounded border border-dashed border-white/10 bg-[#080B0D] p-8 text-center shadow-[6px_6px_0_#0F172A]">
          <p className="text-lg font-bold text-[#F5F5F5]">No monitors to publish</p>
          <p className="mt-2 text-sm text-[#B0B3B8]">
            Create monitors first, then this tab can show service status from backend data.
          </p>
        </div>
      ) : (
        monitors.map((monitor) => {
          const analytics = analyticsByMonitorId[monitor.id];
          const state = getMonitorState(monitor, analytics);

          return (
            <article key={monitor.id} className="min-w-0 rounded border border-white/10 bg-[#080B0D] p-6 shadow-[6px_6px_0_#0F172A] transition-all duration-200 hover:border-[#00E676] hover:shadow-[0_0_12px_rgba(0,230,118,0.2),6px_6px_0_#0F172A]">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${state.dot}`} />
                    <h3 className="truncate font-bold text-lg text-[#F5F5F5]">{monitor.name}</h3>
                  </div>
                  <p className="mt-1 break-all font-mono text-xs text-[#B0B3B8]">{monitor.method} {monitor.url}</p>
                </div>
                <span className={`shrink-0 rounded border px-2.5 py-1 font-mono text-[10px] uppercase ${state.badge}`}>
                  {state.label}
                </span>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                <div className="rounded border border-white/10 bg-[#111416] px-3 py-2">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#B0B3B8]">Interval</p>
                  <p className="mt-1 font-mono text-sm font-bold text-[#F5F5F5]">{formatInterval(monitor.interval)}</p>
                </div>
                <div className="rounded border border-white/10 bg-[#111416] px-3 py-2">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#B0B3B8]">Checks</p>
                  <p className="mt-1 font-mono text-sm font-bold text-[#F5F5F5]">{analytics?.totalChecks ?? '-'}</p>
                </div>
                <div className="rounded border border-white/10 bg-[#111416] px-3 py-2">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#B0B3B8]">Latency</p>
                  <p className="mt-1 font-mono text-sm font-bold text-[#F5F5F5]">{analytics ? `${analytics.avgLatency}ms` : '-'}</p>
                </div>
              </div>
            </article>
          );
        })
      )}
    </div>

    {isLoadingAnalytics && (
      <div className="fixed bottom-24 right-4 z-30 inline-flex items-center gap-2 rounded border border-white/10 bg-[#080B0D] px-4 py-3 font-mono text-xs text-[#F5F5F5] shadow-[0_0_12px_rgba(0,0,0,0.8)] lg:bottom-4">
        <Activity size={16} className="animate-pulse text-[#75ff9e]" />
        Loading status data
      </div>
    )}
  </section>
);

export default StatusPagesSection;
