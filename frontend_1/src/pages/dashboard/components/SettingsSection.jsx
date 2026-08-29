import { Database, RefreshCcw, ServerCog, Settings2 } from 'lucide-react';
import { formatInterval } from '../dashboardUtils';

const SettingCard = ({ icon: Icon, label, value, note }) => (
  <article className="rounded border border-white/10 bg-[#080B0D] p-5 shadow-[6px_6px_0_#0F172A] transition-all duration-200 hover:border-[#00E676] hover:shadow-[0_0_12px_rgba(0,230,118,0.2),6px_6px_0_#0F172A]">
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded border border-white/10 bg-[#111416] text-[#75ff9e]">
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[#B0B3B8]">{label}</p>
        <p className="mt-1 break-words font-mono text-sm font-bold text-[#F5F5F5]">{value}</p>
        <p className="mt-2 text-xs text-[#B0B3B8]">{note}</p>
      </div>
    </div>
  </article>
);

const SettingsSection = ({ activeCount, apiBaseUrl, averageInterval, isLoadingMonitors, monitors, onCreate, onRefresh, pausedCount }) => (
  <section className="grid min-w-0 gap-5 pb-8 font-['Geist',sans-serif]">
    <div className="rounded border border-white/10 bg-[#080B0D] p-6 shadow-[6px_6px_0_#0F172A] transition-all duration-200 hover:border-[#00E676] hover:shadow-[0_0_12px_rgba(0,230,118,0.2),6px_6px_0_#0F172A]">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5]">Backend settings</h2>
          <p className="mt-1 text-sm text-[#B0B3B8]">
            This backend currently exposes monitor records, logs, AI insights and dashboard summaries. Editable settings are the monitor records themselves.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoadingMonitors}
          className="cursor-pointer inline-flex h-10 items-center justify-center gap-2 rounded border border-[#00E676] bg-transparent px-4 font-mono text-xs text-[#00E676] transition-all duration-200 hover:bg-[#00E676]/10 hover:shadow-[0_0_8px_rgba(0,230,118,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCcw className={isLoadingMonitors ? 'animate-spin' : ''} size={15} />
          Refresh backend
        </button>
      </div>
    </div>

    <div className="grid gap-4 xl:grid-cols-2">
      <SettingCard
        icon={Database}
        label="API base"
        value={apiBaseUrl}
        note="Frontend requests use this base URL for monitor, log and dashboard endpoints."
      />
      <SettingCard
        icon={ServerCog}
        label="Scheduler eligible"
        value={`${activeCount} active / ${pausedCount} paused`}
        note="The backend scheduler queues checks only for monitors whose active flag is true."
      />
      <SettingCard
        icon={Settings2}
        label="Default interval"
        value={averageInterval ? `${averageInterval}s average` : 'No active monitors'}
        note="Intervals are stored per monitor in milliseconds and submitted through the monitor create/edit dialog."
      />
      <SettingCard
        icon={Database}
        label="Backend routes in use"
        value="/monitors, /logs/analytics/:id, /dashboard/summary, /dashboard/incidents/:id, /dashboard/ai/:id"
        note="The empty auth/admin/settings backend modules do not expose routes yet, so this tab avoids fake controls."
      />
    </div>

    <div className="rounded border border-white/10 bg-[#080B0D] p-6 shadow-[6px_6px_0_#0F172A] transition-all duration-200 hover:border-[#00E676] hover:shadow-[0_0_12px_rgba(0,230,118,0.2),6px_6px_0_#0F172A]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-[#F5F5F5]">Monitor configuration</h3>
          <p className="mt-1 text-sm text-[#B0B3B8]">
            Add or edit backend monitor records to change URL, method, interval and active state.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="cursor-pointer rounded border border-[#00E676] bg-transparent px-4 py-2 font-mono text-xs text-[#00E676] transition-all duration-200 hover:bg-[#00E676]/10 hover:shadow-[0_0_8px_rgba(0,230,118,0.2)]"
        >
          New monitor
        </button>
      </div>

      <div className="mt-5 grid gap-3">
        {monitors.length === 0 ? (
          <div className="rounded border border-dashed border-white/10 bg-[#111416] p-4 font-mono text-xs text-[#B0B3B8]">
            No backend monitor records yet.
          </div>
        ) : (
          monitors.slice(0, 5).map((monitor) => (
            <div key={monitor.id} className="grid gap-2 rounded border border-white/10 bg-[#111416] p-4 transition-colors duration-200 hover:border-white/20 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <p className="truncate font-bold text-[#F5F5F5]">{monitor.name}</p>
                <p className="mt-1 break-all font-mono text-xs text-[#B0B3B8]">{monitor.method} {monitor.url}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`rounded border px-2.5 py-1 font-mono text-[10px] uppercase ${monitor.active ? 'border-[#00E676] bg-[#00E676]/10 text-[#75ff9e]' : 'border-white/20 bg-white/5 text-[#B0B3B8]'}`}>
                  {monitor.active ? 'Active' : 'Paused'}
                </span>
                <span className="rounded border border-white/10 bg-[#080B0D] px-2.5 py-1 font-mono text-[10px] text-[#B0B3B8]">
                  {formatInterval(monitor.interval)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </section>
);

export default SettingsSection;
