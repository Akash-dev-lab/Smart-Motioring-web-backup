import { gsap } from 'gsap';
import { Edit3, Power, Search, Trash2 } from 'lucide-react';
import { formatInterval, formatMonitorDate } from '../dashboardUtils';

const animatePress = (target) => {
  if (!target) return;

  gsap.killTweensOf(target);
  gsap.fromTo(
    target,
    { scale: 0.92, x: 2, y: 2 },
    { scale: 1, x: 0, y: 0, duration: 0.24, ease: 'back.out(3)' },
  );
};

const PressableIconButton = ({ children, className, disabled, onClick, ...props }) => (
  <button
    type="button"
    className={`${className} cursor-pointer active:translate-x-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50`}
    disabled={disabled}
    onPointerDown={(event) => {
      if (!disabled) {
        animatePress(event.currentTarget);
      }
    }}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

const EmptyMonitors = ({ onCreate }) => (
  <div className="rounded border border-dashed border-white/10 bg-[#111416] p-8 text-center font-['Geist',sans-serif]">
    <p className="text-lg font-bold text-[#F5F5F5]">No monitors found</p>
    <p className="mt-2 text-sm text-[#B0B3B8]">
      No service matches this search or status filter. Try another filter or create a new monitor.
    </p>
    <button
      type="button"
      onClick={onCreate}
      className="mt-4 cursor-pointer rounded border border-[#00E676] bg-transparent px-4 py-2 font-mono text-xs text-[#00E676] transition-all duration-200 hover:bg-[#00E676]/10 hover:shadow-[0_0_8px_rgba(0,230,118,0.2)]"
    >
      New monitor
    </button>
  </div>
);

const LoadingMonitors = ({ colSpan }) => (
  <div className="mx-auto max-w-sm rounded border border-dashed border-white/10 bg-[#111416] p-8 text-center font-['Geist',sans-serif]">
    <p className="text-lg font-bold text-[#F5F5F5]">Loading monitors</p>
    <p className="mt-2 text-sm text-[#B0B3B8]">
      Fetching live monitor data from the backend.
    </p>
    {colSpan ? null : null}
  </div>
);

const MonitorActions = ({ deletingMonitorId, isSavingMonitor, monitor, onDelete, onEdit, onToggle, size = 'desktop' }) => {
  const buttonClass = size === 'mobile' ? 'grid h-9 place-items-center' : 'grid h-8 w-8 place-items-center';

  return (
    <>
      <PressableIconButton
        className={`${buttonClass} rounded border border-white/10 bg-[#111416] text-[#B0B3B8] transition-all duration-150 hover:border-[#00E676] hover:text-[#00E676]`}
        onClick={() => onEdit(monitor)}
        disabled={isSavingMonitor}
        aria-label={`Edit ${monitor.name}`}
      >
        <Edit3 size={15} />
      </PressableIconButton>
      <PressableIconButton
        className={`${buttonClass} rounded border transition-all duration-150 ${
          monitor.active
            ? 'border-[#00E676] bg-[#00E676]/10 text-[#00E676] hover:bg-[#00E676]/20'
            : 'border-white/10 bg-[#111416] text-[#B0B3B8] hover:border-white/30'
        }`}
        onClick={() => onToggle(monitor.id)}
        disabled={isSavingMonitor}
        aria-label={`${monitor.active ? 'Pause' : 'Resume'} ${monitor.name}`}
      >
        <Power size={15} />
      </PressableIconButton>
      <PressableIconButton
        className={`${buttonClass} rounded border border-white/10 bg-[#111416] text-[#B0B3B8] transition-all duration-150 hover:border-red-500 hover:bg-red-500/10 hover:text-red-400`}
        onClick={() => onDelete(monitor.id)}
        disabled={deletingMonitorId === monitor.id}
        aria-label={`Delete ${monitor.name}`}
      >
        <Trash2 size={15} />
      </PressableIconButton>
    </>
  );
};

const MobileMonitorCards = (props) => {
  const { deletingMonitorId, filteredMonitors, isLoadingMonitors, isSavingMonitor, onCreate, onDelete, onEdit, onToggle } = props;

  return (
    <div className="grid gap-3 p-4 lg:hidden">
      {isLoadingMonitors ? (
        <LoadingMonitors />
      ) : filteredMonitors.length > 0 ? (
        filteredMonitors.map((monitor) => (
          <article key={monitor.id} className="min-w-0 rounded border border-white/10 bg-[#111416] p-4 transition-colors hover:border-[#00E676]/50">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${monitor.active ? 'bg-[#00E676] shadow-[0_0_6px_rgba(0,230,118,0.8)]' : 'bg-white/20'}`} />
                  <p className="truncate font-bold text-[#F5F5F5]">{monitor.name}</p>
                </div>
                <p className="mt-1.5 break-all font-mono text-xs leading-5 text-[#B0B3B8]">{monitor.method} {monitor.url}</p>
              </div>
              <span
                className={`shrink-0 rounded border px-2 py-0.5 font-mono text-[10px] uppercase ${
                  monitor.status === 'active'
                    ? 'border-[#00E676] bg-[#00E676]/5 text-[#75ff9e]'
                    : monitor.status === 'paused'
                    ? 'border-[#ffba79] bg-[#ffba79]/5 text-[#ffba79]'
                    : 'border-white/20 bg-white/5 text-[#B0B3B8]'
                }`}
              >
                {monitor.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded border border-white/10 bg-[#080B0D] px-3 py-2">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#B0B3B8]">Method</p>
                <p className="mt-1 font-mono text-sm font-bold text-[#F5F5F5]">{monitor.method}</p>
              </div>
              <div className="rounded border border-white/10 bg-[#080B0D] px-3 py-2">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#B0B3B8]">Every</p>
                <p className="mt-1 font-mono text-sm font-bold text-[#F5F5F5]">{formatInterval(monitor.interval)}</p>
              </div>
              <div className="rounded border border-white/10 bg-[#080B0D] px-3 py-2">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#B0B3B8]">Updated</p>
                <p className="mt-1 truncate font-mono text-xs font-bold text-[#F5F5F5]">{formatMonitorDate(monitor.updatedAt)}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <MonitorActions
                deletingMonitorId={deletingMonitorId}
                isSavingMonitor={isSavingMonitor}
                monitor={monitor}
                onDelete={onDelete}
                onEdit={onEdit}
                onToggle={onToggle}
                size="mobile"
              />
            </div>
          </article>
        ))
      ) : (
        <EmptyMonitors onCreate={onCreate} />
      )}
    </div>
  );
};

const DesktopMonitorTable = (props) => {
  const { deletingMonitorId, filteredMonitors, isLoadingMonitors, isSavingMonitor, onCreate, onDelete, onEdit, onToggle } = props;

  return (
    <div className="hidden w-full max-w-full overflow-x-auto lg:block 2xl:overflow-x-visible">
      <table className="w-full min-w-[760px] text-left 2xl:min-w-0">
        <thead className="bg-[#111416] font-mono text-xs uppercase tracking-wider text-[#B0B3B8]">
          <tr>
            <th className="border-b border-white/10 px-6 py-3.5 font-bold">Monitor</th>
            <th className="border-b border-white/10 px-6 py-3.5 font-bold">Status</th>
            <th className="border-b border-white/10 px-6 py-3.5 font-bold">Method</th>
            <th className="border-b border-white/10 px-6 py-3.5 font-bold">Interval</th>
            <th className="hidden border-b border-white/10 px-6 py-3.5 font-bold xl:table-cell">Updated</th>
            <th className="border-b border-white/10 px-6 py-3.5 font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoadingMonitors ? (
            <tr>
              <td colSpan={6} className="px-6 py-14 text-center">
                <LoadingMonitors colSpan={6} />
              </td>
            </tr>
          ) : filteredMonitors.length > 0 ? (
            filteredMonitors.map((monitor) => (
              <tr key={monitor.id} className="align-middle transition-colors hover:bg-white/[0.03]">
                <td className="border-b border-white/5 px-6 py-4">
                  <div className="flex items-start gap-3">
                    <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${monitor.active ? 'bg-[#00E676] shadow-[0_0_6px_rgba(0,230,118,0.8)]' : 'bg-white/20'}`} />
                    <div>
                      <p className="font-bold text-[#F5F5F5]">{monitor.name}</p>
                      <p className="mt-0.5 max-w-[220px] truncate font-mono text-xs text-[#B0B3B8] xl:max-w-[280px]">{monitor.method} {monitor.url}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase text-[#B0B3B8]/60">Created {formatMonitorDate(monitor.createdAt)}</p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-white/5 px-6 py-4">
                  <span
                    className={`inline-flex rounded border px-2 py-0.5 font-mono text-[10px] uppercase ${
                      monitor.status === 'active'
                        ? 'border-[#00E676] bg-[#00E676]/5 text-[#75ff9e]'
                        : monitor.status === 'paused'
                        ? 'border-[#ffba79] bg-[#ffba79]/5 text-[#ffba79]'
                        : 'border-white/20 bg-white/5 text-[#B0B3B8]'
                    }`}
                  >
                    {monitor.status}
                  </span>
                </td>
                <td className="border-b border-white/5 px-6 py-4 font-mono text-sm font-bold text-[#F5F5F5]">{monitor.method}</td>
                <td className="border-b border-white/5 px-6 py-4 font-mono text-sm text-[#B0B3B8]">{formatInterval(monitor.interval)}</td>
                <td className="hidden border-b border-white/5 px-6 py-4 font-mono text-xs text-[#B0B3B8] xl:table-cell">{formatMonitorDate(monitor.updatedAt)}</td>
                <td className="border-b border-white/5 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <MonitorActions
                      deletingMonitorId={deletingMonitorId}
                      isSavingMonitor={isSavingMonitor}
                      monitor={monitor}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      onToggle={onToggle}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-14 text-center">
                <div className="mx-auto max-w-sm">
                  <EmptyMonitors onCreate={onCreate} />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const MonitorsSection = ({
  deletingMonitorId,
  filteredMonitors,
  isLoadingMonitors,
  isSavingMonitor,
  onCreate,
  onDelete,
  onEdit,
  onQueryChange,
  onStatusFilterChange,
  onToggle,
  query,
  statusFilter,
}) => (
  <section className="grid min-w-0 gap-5 pb-8 font-['Geist',sans-serif]">
    <div className="min-w-0 rounded border border-white/10 bg-[#080B0D] shadow-[6px_6px_0_#0F172A] transition-all duration-200 hover:border-[#00E676] hover:shadow-[0_0_12px_rgba(0,230,118,0.2),6px_6px_0_#0F172A]">
      <div className="grid gap-4 border-b border-white/10 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5]">Monitors</h2>
          <p className="mt-1 text-sm text-[#B0B3B8]">Create, update, pause and delete backend monitor records.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'paused'].map((status) => (
            <button
              key={status}
              onClick={() => onStatusFilterChange(status)}
              className={`cursor-pointer rounded px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all duration-150 ${
                statusFilter === status
                  ? 'border border-[#00E676] bg-[#00E676] text-[#00210b] shadow-[0_0_8px_rgba(0,230,118,0.3)]'
                  : 'border border-white/10 bg-transparent text-[#B0B3B8] hover:border-[#00E676] hover:text-[#00E676]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-white/10 p-4 sm:p-6 bg-[#080B0D]">
        <label className="relative block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B3B8]" size={18} />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search monitors, URLs or methods"
            className="h-11 w-full rounded border border-white/10 bg-[#111416] pl-10 pr-4 font-mono text-sm text-[#F5F5F5] outline-none placeholder:text-[#B0B3B8]/60 transition-all duration-150 focus:border-[#00E676] focus:shadow-[0_0_8px_rgba(0,230,118,0.2)]"
          />
        </label>
      </div>

      <MobileMonitorCards
        deletingMonitorId={deletingMonitorId}
        filteredMonitors={filteredMonitors}
        isLoadingMonitors={isLoadingMonitors}
        isSavingMonitor={isSavingMonitor}
        onCreate={onCreate}
        onDelete={onDelete}
        onEdit={onEdit}
        onToggle={onToggle}
      />
      <DesktopMonitorTable
        deletingMonitorId={deletingMonitorId}
        filteredMonitors={filteredMonitors}
        isLoadingMonitors={isLoadingMonitors}
        isSavingMonitor={isSavingMonitor}
        onCreate={onCreate}
        onDelete={onDelete}
        onEdit={onEdit}
        onToggle={onToggle}
      />
    </div>
  </section>
);

export default MonitorsSection;
