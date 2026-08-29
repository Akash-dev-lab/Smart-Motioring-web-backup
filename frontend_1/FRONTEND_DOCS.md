# 🖥️ Smart Monitoring — Frontend Documentation

> **Framework:** React 19 | **Build Tool:** Vite 8 | **Styling:** Tailwind CSS v4 | **State:** Redux Toolkit | **Routing:** React Router v7

---

## 📁 Project Structure

```
frontend/
├── index.html                        # SPA entry — mounts #root div
├── vite.config.js                    # Vite + React + Tailwind plugin config
├── tailwind.config.js                # Tailwind theme extensions
├── eslint.config.js                  # ESLint rules for React
├── vercel.json                       # Vercel SPA rewrite rule (/* → /index.html)
├── .env                              # Local environment variables
├── .env.example                      # Template for required env vars
└── src/
    ├── main.jsx                      # React root — Redux Provider + BrowserRouter
    ├── App.jsx                       # Route definitions + global loading skeleton
    ├── index.css                     # Global styles, custom animations, grain effect
    ├── assets/                       # Static assets (images, SVGs)
    ├── components/
    │   └── charts/
    │       └── UplotLineChart.jsx    # Reusable uPlot line chart component
    ├── pages/
    │   ├── auth/                     # Sign-in, sign-up, protected route
    │   ├── dashboard/                # Main app dashboard (views + components)
    │   └── home/                     # Marketing landing page (sections + content)
    ├── services/
    │   ├── apiConfig.js              # Base URL configuration from env
    │   ├── axiosInstance.js          # Axios instance with interceptors
    │   ├── authApi.js                # Auth HTTP calls + localStorage helpers
    │   ├── monitorApi.js             # Monitor CRUD + data mapper
    │   ├── dashboardApi.js           # Dashboard/incidents/AI HTTP calls
    │   └── logApi.js                 # Monitor analytics HTTP call
    └── store/
        ├── index.js                  # Redux store configuration
        ├── dashboardSlice.js         # All async thunks + reducers
        └── dashboardSelectors.js     # Memoized selectors (reselect)
```

---

## 🚀 Entry Point — `src/main.jsx`

The React app is bootstrapped with three essential providers:

```jsx
<StrictMode>
  <Provider store={store}>       // Redux global state
    <BrowserRouter>              // Client-side routing
      <App />
    </BrowserRouter>
  </Provider>
</StrictMode>
```

---

## 🗺️ Routing — `src/App.jsx`

All pages are **lazily loaded** using `React.lazy()` to enable code splitting. A custom `AppSkeleton` is shown while chunks load (Suspense fallback).

### Route Table

| Path                | Component         | Auth Required | Description                              |
|---------------------|-------------------|:-------------:|------------------------------------------|
| `/`                 | `HomePage`        | No            | Marketing landing page                   |
| `/signin`           | `SignInPage`      | No            | User login form                          |
| `/signup`           | `SignUpPage`      | No            | User registration form                   |
| `/dashboard`        | Redirect          | —             | Redirects to `/dashboard/overview`       |
| `/dashboard/:view`  | `DashboardPage`   | Yes           | Main app (view = overview, monitors, etc)|
| `*`                 | Redirect          | —             | Catch-all → redirects to `/`             |

### AppSkeleton

The `AppSkeleton` component mirrors the exact layout structure of the dashboard (sidebar + header + stat cards + charts) using animated pulse blocks. It provides a seamless perceived loading experience matching the final UI dimensions.

---

## 🎨 Design System

### Design Aesthetic

The UI follows a **brutalist / neobrutalist** design language:

- **Bold black borders** (`border-[3px] border-black`)
- **Hard box shadows** (`shadow-[4px_4px_0_#0F172A]` — no blur)
- **High-contrast color palette** with brand-specific accent colors
- **Heavy typography** (font-black, uppercase, italic labels)
- **Grid background pattern** on dashboard (`linear-gradient` overlay)

### Brand Color Palette

| Token          | Hex       | Usage                                     |
|----------------|-----------|-------------------------------------------|
| Brand Blue     | `#1E6BFF` | Dashboard background, links, accents      |
| Neon Green     | `#00E676` | Sidebar, CTA buttons, active states       |
| Yellow         | `#FFD600` | Hover states, chart points, logo          |
| Red            | `#FF4D4D` | Incident cards, error/alert indicators    |
| Dark           | `#0A0C10` | Home page background, shadows             |
| Near-black     | `#0F172A` | Box shadow color                          |
| Slate-950      | `#020617` | Primary text                              |

### Global CSS — `src/index.css`

| Class                | Effect                                                      |
|----------------------|-------------------------------------------------------------|
| `.bg-grain`          | Adds SVG fractal noise overlay (brutalist texture)          |
| `.animate-typing`    | Typewriter CSS animation for search bar placeholder text    |
| `.animate-dot`       | Staggered opacity/scale pulse for window decorations        |
| `.animate-scan-line` | Horizontal scanning light effect for status bars            |

---

## 📄 Pages

### 🏠 `pages/home` — Marketing Landing Page

**Entry:** `HomePage.jsx` — Composes all landing sections in order.

```
HomePage
  ├── HeroSection             // Above-the-fold hero with GSAP animations
  ├── MonitorGrid             // Sticky floating feature cards (scroll parallax)
  ├── HowItWorksSection       // 4-step process breakdown
  ├── IncidentResolutionSection // AI + incident demo feature section
  ├── TestimonialsSection     // Social proof cards
  ├── PricingSection          // Pricing tiers
  └── FooterCtaSection        // Final CTA + footer
```

#### Section Files

| File                          | Description                                                    |
|-------------------------------|----------------------------------------------------------------|
| `HeroSection.jsx`             | Full-screen hero, GSAP-animated headline, CTA button           |
| `MonitorGrid.jsx`             | Sticky scroll section with 8 floating feature cards            |
| `MonitorCard.jsx`             | Individual feature card (colored, with icon + detail text)     |
| `HowItWorksSection.jsx`       | 4-step "System Flow" section with step indicators              |
| `HowItWorksStep.jsx`          | Single step card component                                     |
| `IncidentResolutionSection.jsx`| AI incident resolution demo with animated elements            |
| `TestimonialsSection.jsx`     | User testimonial cards section                                 |
| `PricingSection.jsx`          | Pricing plan cards                                             |
| `FooterCtaSection.jsx`        | Final call-to-action + footer links                            |
| `TechnicalBackground.jsx`     | Decorative animated technical background element               |

#### Home Components

| File               | Description                                    |
|--------------------|------------------------------------------------|
| `IconTileLink.jsx` | Small icon + label tile for footer/nav links   |
| `WindowDots.jsx`   | Decorative window titlebar dots (macOS-style)  |

#### Content Data — `content.js`

Contains all static data exported for use in landing sections:

- `monitorItems` — 8 feature cards with title, color, position, and detail text for `MonitorGrid`
- `howItWorksContent` — 4-step process data: Connect → Probe → Detect → Resolve

---

### 🔐 `pages/auth` — Authentication Pages

| File                 | Description                                                         |
|----------------------|---------------------------------------------------------------------|
| `AuthLayout.jsx`     | Full-page two-column layout (brand panel + form panel)              |
| `AuthPanel.jsx`      | Form card container with footer link                                |
| `FormField.jsx`      | Reusable labelled input field with icon                             |
| `ProtectedRoute.jsx` | Route guard — redirects to `/signin` if no user in localStorage    |
| `SignInPage.jsx`     | Login form: email + password → `POST /auth/login`                  |
| `SignUpPage.jsx`     | Registration form: name + email + password → `POST /auth/register` |

#### Authentication Flow

```
SignInPage / SignUpPage
  └── handleSubmit()
        ├── call authApi.login() or authApi.register()
        ├── setCurrentUser(response.user)   → saves to localStorage
        └── navigate('/dashboard')

ProtectedRoute (wraps /dashboard/:view)
  └── getCurrentUser()   → reads from localStorage
        ├── user found   → render children
        └── no user      → <Navigate to="/signin" replace />
```

> Tokens are stored as **HTTP-only cookies** (set by the server). Only non-sensitive user info (name, email, role) is stored in `localStorage`.

---

### 📊 `pages/dashboard` — Main Application Dashboard

The dashboard is a **single-page shell** that renders different content sections based on the URL param `/:view`. Navigation changes the URL, not a local state flag.

**Entry:** `DashboardPage.jsx`

#### Views (`:view` URL param)

| View ID     | Component            | Loaded When                          |
|-------------|----------------------|--------------------------------------|
| `overview`  | `OverviewSection`    | Always on dashboard load             |
| `monitors`  | `MonitorsSection`    | On navigation to Monitors            |
| `incidents` | `IncidentsSection`   | Fetches analytics + incident details |
| `status`    | `StatusPagesSection` | Fetches summary + analytics          |
| `settings`  | `SettingsSection`    | Fetches summary                      |

#### Layout Structure

```
DashboardPage
  ├── Mobile Overlay (backdrop for slide-in sidebar)
  ├── Mobile Sidebar (slide-in, z-50, hidden on lg)
  ├── MobileNav (bottom nav bar for mobile)
  ├── Desktop Sidebar (collapsible: 280px → 92px compact mode)
  └── Main Section
        ├── Header (title, refresh button, "New Monitor" button)
        ├── Error Banner (shows Redux monitorError if set)
        └── Content Area (renders active view component)
              └── MonitorDialog (create/edit modal, rendered at root level)
```

#### Dashboard Data Loading Strategy

Data is fetched lazily based on which view is active:

| View         | Data Fetched                              |
|--------------|-------------------------------------------|
| Always       | `fetchMonitors` (on page mount)           |
| overview     | `fetchAnalytics`                          |
| incidents    | `fetchAnalytics` + `fetchIncidentDetails` |
| status       | `fetchAnalytics` + `fetchDashboardSummary`|
| settings     | `fetchDashboardSummary`                   |

#### Dashboard Components

| File                   | Description                                                              |
|------------------------|--------------------------------------------------------------------------|
| `Navigation.jsx`       | `SidebarContent` (desktop, collapsible) + `MobileNav` (bottom bar)       |
| `OverviewSection.jsx`  | Stat cards (total/active/paused), per-monitor latency sparklines          |
| `MonitorsSection.jsx`  | Searchable, filterable monitor table with CRUD actions                    |
| `MonitorDialog.jsx`    | Create/Edit monitor modal with URL, method, interval, status fields       |
| `IncidentsSection.jsx` | Incident list with AI insights panels and latency trend charts            |
| `StatusPagesSection.jsx`| Global uptime summary + per-monitor status badges                        |
| `SettingsSection.jsx`  | API connection info, monitor counts, quick-action buttons                 |

#### `dashboardData.js` — Static Config

| Export           | Contents                                                     |
|------------------|--------------------------------------------------------------|
| `navItems`       | 5 nav entries: `overview`, `monitors`, `incidents`, `status`, `settings` |
| `emptyMonitorForm` | Default form state: `{ url:'', method:'GET', interval:'60000', active:true }` |
| `methodOptions`  | `GET, POST, PUT, DELETE`                                    |
| `intervalOptions`| `30s (30000)`, `1m (60000)`, `2m (120000)`                  |

---

## 🗃️ Redux Store — `src/store`

### Store Configuration — `index.js`

```js
configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
});
```

Only one slice: `dashboard`. It manages all async state — monitors, analytics, incidents, AI insights, and dashboard summary.

---

### `dashboardSlice.js` — Async Thunks

| Thunk                    | Action                                    | Triggered By                       |
|--------------------------|-------------------------------------------|------------------------------------|
| `fetchMonitors`          | `GET /monitors`                           | On mount, on manual refresh        |
| `fetchDashboardSummary`  | `GET /dashboard/summary`                  | Status and Settings views          |
| `fetchAnalytics`         | `GET /logs/analytics/:id` (per monitor)   | Overview, Incidents, Status views  |
| `fetchIncidentDetails`   | `GET /dashboard/incidents/:id` + `/ai/insights/:id` per monitor | Incidents view |
| `createMonitorRecord`    | `POST /monitors`                          | Create dialog submit               |
| `updateMonitorRecord`    | `PUT /monitors/:id`                       | Edit dialog submit                 |
| `toggleMonitorRecord`    | `PUT /monitors/:id` (flips `active`)      | Toggle button in MonitorsSection   |
| `deleteMonitorRecord`    | `DELETE /monitors/:id`                    | Delete button in MonitorsSection   |

### Redux State Shape

```js
{
  dashboard: {
    monitors: [],                     // Array of mapped monitor objects
    analyticsByMonitorId: {},         // { [monitorId]: analyticsData }
    incidentsByMonitorId: {},         // { [monitorId]: incidents[] }
    aiInsightsByMonitorId: {},        // { [monitorId]: aiInsights[] }
    dashboardSummary: null,           // { totalMonitors, activeIncidents, uptime }

    isLoadingMonitors: true,
    isLoadingAnalytics: false,
    isLoadingIncidentDetails: false,
    isLoadingDashboardSummary: false,
    isSavingMonitor: false,
    deletingMonitorId: null,          // ID of monitor being deleted (for loading state)

    monitorError: '',
    analyticsError: '',
    incidentDetailsError: '',
    dashboardSummaryError: '',
  }
}
```

### Reducers

| Reducer           | Effect                       |
|-------------------|------------------------------|
| `clearMonitorError` | Resets `monitorError` to `''` |

---

### `dashboardSelectors.js` — Memoized Selectors

| Selector                    | Returns                                                   |
|-----------------------------|-----------------------------------------------------------|
| `selectDashboard`           | Full `dashboard` slice state                              |
| `selectMonitors`            | `monitors[]` array                                        |
| `selectAnalyticsByMonitorId`| `{ [id]: analytics }` map                                |
| `selectIncidentsByMonitorId`| `{ [id]: incidents[] }` map                              |
| `selectAIInsightsByMonitorId`| `{ [id]: insights[] }` map                              |
| `selectDashboardSummary`    | Dashboard summary object                                  |
| `selectDashboardCounts`     | Memoized: `{ activeCount, pausedCount, totalCount, averageInterval }` |
| `selectFilteredMonitors`    | Memoized: monitors filtered by search `query` + `statusFilter` |

> `selectDashboardCounts` and `selectFilteredMonitors` use `createSelector` for memoization — they only recompute when their inputs change.

---

## 🌐 Services — `src/services`

### `apiConfig.js`

Reads `VITE_API_BASE_URL` from environment. Strips trailing slash. Throws at module load time if missing.

```js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
```

### `axiosInstance.js` — Shared HTTP Client

| Feature               | Details                                                       |
|-----------------------|---------------------------------------------------------------|
| `baseURL`             | `API_BASE_URL` from apiConfig                                 |
| `withCredentials`     | `true` — sends HTTP-only cookies on every request             |
| `Content-Type`        | `application/json`                                            |
| **401 Interceptor**   | On 401 → auto-retries `POST /auth/refresh` once. If refresh fails → clears `localStorage` + redirects to `/signin` |

### `authApi.js`

| Function          | Description                                         |
|-------------------|-----------------------------------------------------|
| `register()`      | `POST /auth/register` — name, email, password       |
| `login()`         | `POST /auth/login` — email, password                |
| `logout()`        | `POST /auth/logout`                                 |
| `refreshToken()`  | `POST /auth/refresh`                                |
| `getCurrentUser()`| Reads user object from `localStorage`               |
| `setCurrentUser()`| Saves/removes user object from `localStorage`       |

### `monitorApi.js`

| Function         | HTTP Call              | Description                               |
|------------------|------------------------|-------------------------------------------|
| `mapMonitor()`   | (transformer)          | Converts MongoDB `_id` → `id`; derives `name` from URL hostname; sets `status` |
| `getMonitors()`  | `GET /monitors`        | Returns all mapped monitors for user      |
| `createMonitor()`| `POST /monitors`       | Creates + optional immediate pause update |
| `updateMonitor()`| `PUT /monitors/:id`    | Updates monitor fields                    |
| `deleteMonitor()`| `DELETE /monitors/:id` | Deletes monitor by ID                     |

**Monitor data mapping:**

```js
mapMonitor(backendMonitor) → {
  id,           // from _id
  name,         // hostname extracted from URL
  url,
  method,       // default: 'GET'
  interval,     // default: 60000
  active,       // default: true
  status,       // 'active' | 'paused'
  createdAt,
  updatedAt,
}
```

### `dashboardApi.js`

| Function               | HTTP Call                          | Description                               |
|------------------------|------------------------------------|-------------------------------------------|
| `getDashboardSummary()`| `GET /dashboard/summary`           | Returns null on failure (Redux fallback)  |
| `getIncidentTimeline()`| `GET /dashboard/incidents/:id`     | Incident list for a monitor               |
| `getAIInsights()`      | `GET /ai/insights/:id`             | AI insights, cleaned + formatted         |
| `getIncidentDetails()` | Parallel: incidents + AI insights  | Combined fetch for incidents view         |
| `formatAIInsight()`    | (internal formatter)               | Normalizes suggestion to array; strips markdown symbols; adds `isCritical` flag |

### `logApi.js`

| Function                 | HTTP Call                              | Description                           |
|--------------------------|----------------------------------------|---------------------------------------|
| `getMonitorAnalytics()`  | `GET /logs/analytics/:id?range=24h`    | Returns chart-safe structure; all arrays default to `[]` on failure |

**Response shape:**
```js
{
  timestamps: [],
  responseTimes: [],
  statusCodes: [],
  uptime: 0,
}
```

---

## 📦 Components — `src/components`

### `UplotLineChart.jsx`

A performant, **memoized** line chart built on [uPlot](https://github.com/leeoniya/uPlot) — a tiny, fast canvas-based charting library.

| Prop          | Type     | Default     | Description                      |
|---------------|----------|-------------|----------------------------------|
| `points`      | Array    | required    | `[{ label, value }]` data points |
| `color`       | String   | `#1E6BFF`   | Line stroke color                |
| `height`      | Number   | `120`       | Chart height in px               |
| `valueSuffix` | String   | `''`        | Suffix for Y-axis values (e.g. `ms`) |
| `ariaLabel`   | String   | —           | Accessible label for screen readers |

**Key features:**
- Uses `ResizeObserver` to redraw chart on container resize (fully responsive)
- Destroys and recreates uPlot instance on data change
- Yellow data points (`#FFD600`) with dark outline for visibility
- No drag/zoom cursor interaction
- Hidden X-axis, visible Y-axis with grid lines

---

## ⚙️ Configuration Files

### `vite.config.js`

```js
defineConfig({
  plugins: [react(), tailwindcss()]
})
```
- `@vitejs/plugin-react` — Fast Refresh + JSX transform
- `@tailwindcss/vite` — Tailwind v4 integrated as Vite plugin (no PostCSS config needed)

### `tailwind.config.js`

| Extension       | Value                        | Purpose                          |
|-----------------|------------------------------|----------------------------------|
| `brandBlue`     | `#1E6BFF`                    | Brand color token                |
| `scan` keyframe | `translateX(-100% → 400%)`   | Scanning light animation         |
| `scan-line` anim| `scan 2s infinite linear`    | Status bar scan effect           |

### `vercel.json`

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
Ensures all routes (e.g., `/dashboard/overview`) are served from `index.html` — required for client-side routing on Vercel.

---

## 🔑 Environment Variables

| Variable           | Required | Description                                    |
|--------------------|----------|------------------------------------------------|
| `VITE_API_BASE_URL`| Yes      | Backend API base URL (e.g. `https://api.example.com`) |

> In development, defaults to `http://localhost:3000` if not set.

---

## 📦 Dependencies

### Runtime Dependencies

| Package              | Version    | Purpose                                         |
|----------------------|------------|-------------------------------------------------|
| `react`              | ^19.2.5    | UI library                                      |
| `react-dom`          | ^19.2.5    | React DOM renderer                              |
| `react-router-dom`   | ^7.14.2    | Client-side routing                             |
| `@reduxjs/toolkit`   | ^2.11.2    | Redux state management + async thunks           |
| `react-redux`        | ^9.2.0     | React bindings for Redux                        |
| `axios`              | ^1.16.0    | HTTP client for API calls                       |
| `lucide-react`       | ^1.14.0    | Icon library (Activity, AlertTriangle, etc.)    |
| `gsap`               | ^3.15.0    | Animation library (used in Hero/landing sections)|
| `uplot`              | ^1.6.32    | Lightweight canvas chart library                |
| `@tailwindcss/vite`  | ^4.2.4     | Tailwind CSS v4 Vite integration                |

### Dev Dependencies

| Package                        | Purpose                               |
|--------------------------------|---------------------------------------|
| `vite`                         | Build tool + dev server               |
| `@vitejs/plugin-react`         | React Fast Refresh for Vite           |
| `tailwindcss`                  | Utility-first CSS framework           |
| `eslint`                       | JavaScript linter                     |
| `eslint-plugin-react-hooks`    | React hooks linting rules             |
| `eslint-plugin-react-refresh`  | Fast Refresh compatibility linting    |
| `autoprefixer` / `postcss`     | CSS vendor prefixing                  |

---

## 🛠️ Running the Frontend

```bash
# Install dependencies
npm install

# Start development server (Hot Module Replacement enabled)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

> Dev server runs on `http://localhost:5173` by default.

---

## 🏗️ Architecture Notes

- **Code splitting**: All top-level pages are lazily imported, keeping the initial JS bundle small. The `AppSkeleton` prevents layout shift during chunk loading.
- **URL-driven navigation**: Dashboard views are controlled by `/:view` URL params, making each view bookmarkable and browser-history compatible.
- **Lazy data fetching**: Redux thunks are only dispatched when the relevant view is active. This avoids loading all data on initial mount.
- **Resilient API layer**: Every service function catches errors and returns safe defaults (empty arrays, null) — the UI never crashes due to a failed API call.
- **Auto token refresh**: The Axios interceptor silently retries with a new access token on 401 errors. Only on refresh failure does it redirect to login.
- **Data mapping layer**: `mapMonitor()` in `monitorApi.js` decouples the frontend from MongoDB's `_id` / backend field naming, making the UI resilient to backend changes.
- **Memoized selectors**: `createSelector` prevents unnecessary re-renders by caching derived state like filtered monitors and dashboard counts.
- **Design language**: The brutalist UI (hard shadows, bold borders, high contrast) is enforced purely via Tailwind utility classes — no additional CSS-in-JS or styled-component layers.
