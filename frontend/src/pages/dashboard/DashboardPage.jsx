import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { GripVertical, Plus, RefreshCcw } from 'lucide-react';
import IncidentsSection from './components/IncidentsSection';
import MonitorDialog from './components/MonitorDialog';
import MonitorsSection from './components/MonitorsSection';
import { MobileNav, SidebarContent } from './components/Navigation';
import OverviewSection from './components/OverviewSection';
import SettingsSection from './components/SettingsSection';
import StatusPagesSection from './components/StatusPagesSection';
import TechnicalBackground from '../home/sections/TechnicalBackground';
import { emptyMonitorForm, navItems } from './dashboardData';
import { getApiBaseUrl } from '../../services/dashboardApi';
import {
  createMonitorRecord,
  deleteMonitorRecord,
  fetchAnalytics,
  fetchDashboardSummary,
  fetchIncidentDetails,
  fetchMonitors,
  toggleMonitorRecord,
  updateMonitorRecord,
} from '../../store/dashboardSlice';
import {
  selectAnalyticsByMonitorId,
  selectAIInsightsByMonitorId,
  selectDashboard,
  selectDashboardCounts,
  selectFilteredMonitors,
  selectIncidentsByMonitorId,
  selectMonitors,
} from '../../store/dashboardSelectors';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { view } = useParams();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e) => {
      if (isResizing) {
        const newWidth = e.clientX;
        if (newWidth >= 80 && newWidth <= 600) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, resize, stopResizing]);
  const [editingId, setEditingId] = useState(null);
  const [createForm, setCreateForm] = useState(emptyMonitorForm);
  const [editForm, setEditForm] = useState(emptyMonitorForm);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const {
    analyticsError,
    dashboardSummary,
    dashboardSummaryError,
    deletingMonitorId,
    incidentDetailsError,
    isLoadingAnalytics,
    isLoadingDashboardSummary,
    isLoadingIncidentDetails,
    isLoadingMonitors,
    isSavingMonitor,
    monitorError,
  } = useSelector(selectDashboard);
  const monitors = useSelector(selectMonitors);
  const analyticsByMonitorId = useSelector(selectAnalyticsByMonitorId);
  const aiInsightsByMonitorId = useSelector(selectAIInsightsByMonitorId);
  const incidentsByMonitorId = useSelector(selectIncidentsByMonitorId);
  const filteredMonitors = useSelector((state) => selectFilteredMonitors(state, query, statusFilter));
  const {
    activeCount,
    averageInterval,
    pausedCount,
  } = useSelector(selectDashboardCounts);
  const validViewIds = navItems.map((item) => item.id);
  const activeView = validViewIds.includes(view) ? view : 'overview';

  const loadMonitors = useCallback(() => {
    dispatch(fetchMonitors());
  }, [dispatch]);

  useEffect(() => {
    const refreshTimer = window.setTimeout(() => dispatch(fetchMonitors()), 0);

    return () => window.clearTimeout(refreshTimer);
  }, [dispatch]);

  const loadAnalytics = useCallback(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const loadIncidentDetails = useCallback(() => {
    dispatch(fetchIncidentDetails());
  }, [dispatch]);

  useEffect(() => {
    if (activeView === 'overview' || activeView === 'incidents' || activeView === 'status') {
      const analyticsTimer = window.setTimeout(loadAnalytics, 0);

      return () => window.clearTimeout(analyticsTimer);
    }
  }, [activeView, loadAnalytics]);

  useEffect(() => {
    if (activeView === 'incidents') {
      const detailsTimer = window.setTimeout(loadIncidentDetails, 0);

      return () => window.clearTimeout(detailsTimer);
    }
  }, [activeView, loadIncidentDetails]);

  const loadDashboardSummary = useCallback(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  useEffect(() => {
    if (activeView === 'status' || activeView === 'settings') {
      const summaryTimer = window.setTimeout(loadDashboardSummary, 0);

      return () => window.clearTimeout(summaryTimer);
    }
  }, [activeView, loadDashboardSummary]);

  const activeNavItem = navItems.find((item) => item.id === activeView);

  const selectView = (view) => {
    navigate(`/dashboard/${view}`);
    setMobileSidebarOpen(false);
  };

  const openCreateDialog = () => {
    navigate('/dashboard/monitors');
    setCreateDialogOpen(true);
  };

  const refreshStatusPages = () => {
    loadDashboardSummary();
    loadAnalytics();
  };

  const refreshIncidents = () => {
    loadAnalytics();
    loadIncidentDetails();
  };

  const updateCreateForm = (field, value) => {
    setCreateForm((current) => ({ ...current, [field]: value }));
  };

  const updateEditForm = (field, value) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const closeCreateDialog = () => {
    setCreateForm(emptyMonitorForm);
    setCreateDialogOpen(false);
  };

  const closeEditDialog = () => {
    setEditingId(null);
    setEditForm(emptyMonitorForm);
    setEditDialogOpen(false);
  };

  const handleCreateSubmit = (event) => {
    event.preventDefault();

    try {
      new URL(createForm.url);
    } catch {
      return;
    }

    dispatch(createMonitorRecord(createForm))
      .unwrap()
      .then(() => {
        closeCreateDialog();
      });
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();

    try {
      new URL(editForm.url);
    } catch {
      return;
    }

    dispatch(updateMonitorRecord({ id: editingId, data: editForm }))
      .unwrap()
      .then(() => {
        closeEditDialog();
      });
  };

  const editMonitor = (monitor) => {
    setEditingId(monitor.id);
    setEditForm({
      url: monitor.url,
      method: monitor.method,
      interval: String(monitor.interval),
      active: monitor.active,
    });
    setEditDialogOpen(true);
  };

  const deleteMonitor = (id) => {
    dispatch(deleteMonitorRecord(id))
      .unwrap()
      .then(() => {
        if (editingId === id) {
          closeEditDialog();
        }
      });
  };

  const toggleMonitor = (id) => {
    const monitor = monitors.find((item) => item.id === id);

    if (!monitor) return;

    dispatch(toggleMonitorRecord(monitor));
  };

  return (
    <main
      className="relative h-screen overflow-hidden bg-[#111317] font-sans text-slate-950"
    >
      {/* Background Layers */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Grid Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Whitish Glow Effect in Middle */}
        <div className="absolute inset-0">
          <div className="absolute h-full w-full bg-white/20 blur-[300px]" />
          <div className="absolute bottom-1/4 left-1/4 h-1/3 w-1/3 rounded-full bg-white/5 blur-[100px]" />
        </div>

        {/* Technical Background */}
        <div className="absolute inset-0">
          <TechnicalBackground />
        </div>
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/45 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-70 border-r-4 border-black bg-[#00E676] p-5 shadow-[10px_0_0_#0A0C10] transition-transform lg:hidden ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+16px)]'
          }`}
      >
        <SidebarContent
          activeView={activeView}
          onClose={() => setMobileSidebarOpen(false)}
          onViewChange={selectView}
        />
      </aside>

      <MobileNav activeView={activeView} onViewChange={selectView} />

      <div className="relative z-10 flex h-screen overflow-hidden">
        <aside
          style={{ width: `${sidebarWidth}px` }}
          className={`relative hidden h-screen shrink-0 overflow-hidden border-r-4 border-black bg-[#2a2b2b] p-5 shadow-[8px_0_0_#0A0C10] lg:block ${isResizing ? '' : 'transition-[width] duration-150'}`}
        >
          <SidebarContent
            activeView={activeView}
            compact={sidebarWidth < 180}
            onClose={() => setSidebarWidth(88)}
            onOpen={() => setSidebarWidth(280)}
            onViewChange={selectView}
          />

          {/* Draggable border resize handle - Always Visible */}
          <div
            onMouseDown={startResizing}
            onDoubleClick={() => setSidebarWidth(sidebarWidth < 180 ? 280 : 88)}
            className="group absolute -right-3 top-0 z-50 flex h-full w-6 cursor-col-resize items-center justify-center"
            title="Drag left or right to resize sidebar (double-click to toggle)"
          >
            {/* Center Permanently Visible Grip Pill */}
            <div
              className={`flex h-11 w-4.5 items-center justify-center rounded-full border-2 border-black transition-all ${isResizing
                ? 'bg-[#FFD600] scale-110 shadow-[2px_2px_0_#000]'
                : 'bg-[#00E676] shadow-[2px_2px_0_#000] hover:bg-[#FFD600] hover:scale-110'
                }`}
            >
              <GripVertical size={13} strokeWidth={3} className="text-black" />
            </div>
          </div>
        </aside>

        <section className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
          <header className="z-30 shrink-0 border-b-4 border-black bg-[#2a2b2b] px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  className="grid h-11 w-11 place-items-center rounded-2xl border-[3px] border-black bg-[#FFD600] font-black italic text-black shadow-[4px_4px_0_#0F172A] lg:hidden"
                  onClick={() => setMobileSidebarOpen(true)}
                  aria-label="Open sidebar"
                >
                  D
                </button>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00E676]">Command Center</p>
                  <h1 className="mt-1 text-xl font-black tracking-tight text-white/85 sm:text-2xl">{activeNavItem?.label || 'Overview'}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="grid h-10 w-10 place-items-center rounded-xl border-[3px] cursor-pointer border-black bg-white text-slate-950 shadow-[3px_3px_0_#0F172A] hover:bg-[#00E676] disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={loadMonitors}
                  disabled={isLoadingMonitors}
                  aria-label="Refresh dashboard"
                >
                  <RefreshCcw className={isLoadingMonitors ? 'animate-spin' : ''} size={18} strokeWidth={3} />
                </button>
                <button
                  type="button"
                  onClick={openCreateDialog}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border-[3px] border-black bg-[#00E676] px-4 text-sm font-black text-black shadow-[3px_3px_0_#0F172A] hover:bg-[#FFD600]"
                >
                  <Plus size={18} strokeWidth={3} />
                  <span className="hidden sm:inline">New monitor</span>
                </button>
              </div>
            </div>
          </header>

          <div className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden pb-24 lg:pb-0">
            <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:px-8">
              {monitorError && (
                <div className="rounded-2xl border-[3px] border-black bg-red-50 p-4 text-sm font-black text-red-700 shadow-[4px_4px_0_#0F172A]">
                  {monitorError}
                </div>
              )}

              {activeView === 'overview' && (
                <OverviewSection
                  activeCount={activeCount}
                  analyticsByMonitorId={analyticsByMonitorId}
                  averageInterval={averageInterval}
                  monitors={monitors}
                  onViewMonitors={() => selectView('monitors')}
                  pausedCount={pausedCount}
                  totalCount={monitors.length}
                />
              )}

              {activeView === 'monitors' && (
                <MonitorsSection
                  deletingMonitorId={deletingMonitorId}
                  filteredMonitors={filteredMonitors}
                  isLoadingMonitors={isLoadingMonitors}
                  isSavingMonitor={isSavingMonitor}
                  onCreate={openCreateDialog}
                  onDelete={deleteMonitor}
                  onEdit={editMonitor}
                  onQueryChange={setQuery}
                  onStatusFilterChange={setStatusFilter}
                  onToggle={toggleMonitor}
                  query={query}
                  statusFilter={statusFilter}
                />
              )}

              {activeView === 'incidents' && (
                <IncidentsSection
                  aiInsightsByMonitorId={aiInsightsByMonitorId}
                  analyticsByMonitorId={analyticsByMonitorId}
                  analyticsError={analyticsError}
                  incidentDetailsError={incidentDetailsError}
                  incidentsByMonitorId={incidentsByMonitorId}
                  isLoadingAnalytics={isLoadingAnalytics || isLoadingIncidentDetails}
                  monitors={monitors}
                  onRefresh={refreshIncidents}
                />
              )}

              {activeView === 'status' && (
                <StatusPagesSection
                  analyticsByMonitorId={analyticsByMonitorId}
                  isLoadingAnalytics={isLoadingAnalytics}
                  isLoadingSummary={isLoadingDashboardSummary}
                  monitors={monitors}
                  onRefresh={refreshStatusPages}
                  summary={dashboardSummary}
                  summaryError={dashboardSummaryError || analyticsError}
                />
              )}

              {activeView === 'settings' && (
                <SettingsSection
                  activeCount={activeCount}
                  apiBaseUrl={getApiBaseUrl()}
                  averageInterval={averageInterval}
                  isLoadingMonitors={isLoadingMonitors}
                  monitors={monitors}
                  onCreate={openCreateDialog}
                  onRefresh={loadMonitors}
                  pausedCount={pausedCount}
                />
              )}
            </div>
          </div>
        </section>
      </div>

      {createDialogOpen && (
        <MonitorDialog
          form={createForm}
          isSaving={isSavingMonitor}
          mode="create"
          onClose={closeCreateDialog}
          onSubmit={handleCreateSubmit}
          onUpdate={updateCreateForm}
        />
      )}

      {editDialogOpen && (
        <MonitorDialog
          form={editForm}
          isSaving={isSavingMonitor}
          mode="edit"
          onClose={closeEditDialog}
          onSubmit={handleEditSubmit}
          onUpdate={updateEditForm}
        />
      )}
    </main>
  );
};

export default DashboardPage;
