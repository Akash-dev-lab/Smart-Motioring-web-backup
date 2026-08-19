# 📡 Smart Monitoring — Backend Documentation

> **Version:** 1.0.0 | **Runtime:** Node.js (ESM) | **Framework:** Express 5 | **Database:** MongoDB + Redis

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.ts                     # Entry point — bootstraps app, DB, Socket.IO, workers
│   ├── app.ts                        # Express app — middleware & route registration
│   ├── config/
│   │   └── db.ts                     # MongoDB connection
│   ├── middleware/
│   │   └── rateLimiter.ts            # API rate limiting
│   ├── modules/
│   │   ├── auth/                     # JWT authentication (TypeScript)
│   │   ├── monitor/                  # URL monitors CRUD + scheduler (TypeScript)
│   │   ├── alert/                    # Alert triggering & email delivery (TypeScript)
│   │   ├── incident/                 # Incident lifecycle management (TypeScript)
│   │   ├── logs/                     # Check logs & analytics (TypeScript)
│   │   ├── ai/                       # Gemini AI integration (TypeScript)
│   │   ├── dashboard/                # Aggregated dashboard data (TypeScript)
│   │   ├── admin/                    # Admin-only stats (TypeScript)
│   │   └── monitoring-region/        # Regional monitoring configuration (TypeScript)
│   ├── queues/
│   │   └── queue.connection.ts       # Shared Redis connection for BullMQ
│   ├── workers/
│   │   └── monitor.worker.ts         # BullMQ regional workers — performs HTTP checks
│   ├── sockets/
│   │   ├── socket.server.ts          # Socket.IO server initialization
│   │   ├── socket.auth.ts            # Socket authentication middleware
│   │   ├── socket.events.ts          # Socket event registration
│   │   ├── socket.rooms.ts           # Socket room management
│   │   └── socket.pubsub.ts          # Redis Pub/Sub for WebSocket events
│   ├── types/                        # Shared TypeScript type definitions
│   └── utils/
│       ├── cache.ts                  # Redis caching utilities
│       └── constants.ts              # Shared constants
├── dist/                             # Compiled JavaScript (production)
├── scripts/                          # Test/utility scripts
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── .env                              # Environment variables (not committed)
└── .env.example                      # Environment variable template
```

---

## 🚀 Entry Point — `src/server.ts`

The application bootstraps in the following order:

1. Load environment variables via `dotenv/config`
2. Configure DNS servers to Cloudflare (`1.1.1.1`) and Google (`8.8.8.8`)
3. Connect to **MongoDB** (`connectDB`)
4. Create HTTP server with Express app
5. Initialize **Socket.IO** server (`initializeSocketServer`)
6. Start **Regional BullMQ Workers** (`startBullWorker`) — processes queued HTTP checks
7. Start **Express** server on `process.env.PORT` (default: 3000)
8. Initialize **Socket Pub/Sub** (`initializeSocketPubSub`) — Redis subscriber for real-time WebSocket events

```typescript
dns.setServers(["1.1.1.1", "8.8.8.8"]);
await connectDB();
const httpServer = http.createServer(app);
initializeSocketServer(httpServer);
startBullWorker();
httpServer.listen(process.env.PORT);
await initializeSocketPubSub();
```

---

## ⚙️ Express App — `src/app.ts`

### Middleware Stack

| Middleware      | Purpose                                      |
|----------------|----------------------------------------------|
| `cors`          | Cross-origin support (allowlist from `FRONTEND_URL`) |
| `cookie-parser` | Parses HTTP-only cookies (JWT tokens)        |
| `express.json`  | Parses incoming JSON request bodies          |

### CORS Configuration

- Origins are loaded from `process.env.FRONTEND_URL` (comma-separated)
- Supports credentials (`httpOnly` cookies cross-origin)
- Methods allowed: `GET, POST, PUT, DELETE, OPTIONS`
- Headers allowed: `Content-Type, Authorization`

### Route Registration

| Prefix        | Module Router                  |
|---------------|--------------------------------|
| `/auth`       | `auth.routes.ts`               |
| `/logs`       | `log.routes.ts`                |
| `/ai`         | `ai.routes.ts`                 |
| `/monitors`   | `monitor.routes.ts`            |
| `/dashboard`  | `dashboard.routes.ts`          |
| `/incidents`  | `incident.routes.ts`           |
| `/admin`      | `admin.routes.ts`              |
| `/admin/monitoring-regions` | `monitoring-region.routes.ts` |

### Special Endpoints

- `GET /` — Health check; returns `{ status: "ok", message, timestamp }`
- 404 handler — Returns `{ error: "Route not found" }`
- Global error handler — Returns `{ error: err.message }` with status 500

---

## 🔧 Config

### `src/config/db.js` — MongoDB

```js
mongoose.connect(process.env.MONGO_URI);
```
- Exits process on failure (`process.exit(1)`)

### `src/config/redis.js` — Redis (IORedis)

```js
new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
```
- Used as BullMQ backend
- Silent error handler (avoids unhandled rejection noise)

---

## 🔐 Module: `auth`

Handles user registration, login, token refresh, and logout using **JWT** (access + refresh token pattern).

### Files

| File                  | Role                                   |
|-----------------------|----------------------------------------|
| `auth.model.js`       | Mongoose `User` schema                 |
| `auth.service.js`     | Business logic (register, login, etc.) |
| `auth.controller.js`  | HTTP handlers                          |
| `auth.middleware.js`  | JWT validation middleware              |
| `auth.routes.js`      | Express router                         |

### User Schema

| Field          | Type     | Notes                                |
|----------------|----------|--------------------------------------|
| `name`         | String   | Required                             |
| `email`        | String   | Unique, lowercase, trimmed           |
| `password`     | String   | Bcrypt hashed, min 6 chars           |
| `role`         | String   | `"user"` (default) or `"admin"`      |
| `refreshToken` | String   | Stored server-side for rotation      |

### Token Strategy

- **Access Token**: JWT signed with `JWT_SECRET`, expires in **1 hour**
- **Refresh Token**: JWT signed with `JWT_REFRESH_SECRET`, expires in **7 days**
- Both stored as **HTTP-only cookies** with `sameSite: "none"` (supports cross-origin, e.g., Vercel to Render)

### API Routes

| Method | Route             | Auth Required | Description                     |
|--------|-------------------|---------------|---------------------------------|
| `POST` | `/auth/register`  | No            | Register new user               |
| `POST` | `/auth/login`     | No            | Login and receive tokens        |
| `POST` | `/auth/refresh`   | No            | Issue new access token from cookie |
| `POST` | `/auth/logout`    | protect       | Clear tokens and nullify stored refresh token |

### Middleware

| Middleware   | Function                                         |
|--------------|--------------------------------------------------|
| `protect`    | Validates `accessToken` cookie, sets `req.user`  |
| `isAdmin`    | Checks `req.user.role === "admin"`               |

---

## 📡 Module: `monitor`

Manages the list of URLs to be monitored. Each monitor belongs to a user and has a configurable check interval.

### Files

| File                      | Role                                  |
|---------------------------|---------------------------------------|
| `monitor.model.js`        | Mongoose `Monitor` schema             |
| `monitor.service.js`      | DB operations                         |
| `monitor.controller.js`   | HTTP handlers                         |
| `monitor.routes.js`       | Express router                        |
| `monitor.scheduler.js`    | Interval-based job queuing engine     |
| `monitor.queue.js`        | BullMQ queue instance                 |

### Monitor Schema

| Field      | Type     | Default   | Notes                         |
|------------|----------|-----------|-------------------------------|
| `userId`   | ObjectId | —         | Ref to `User`, required       |
| `url`      | String   | —         | Required target URL           |
| `method`   | String   | `"GET"`   | HTTP method                   |
| `interval` | Number   | `60000`   | Check interval in ms (60s)    |
| `active`   | Boolean  | `true`    | Whether monitor is running    |

- **Index**: `{ active: 1 }` for fast active monitor lookups

### API Routes

| Method   | Route                   | Auth        | Description                          |
|----------|-------------------------|-------------|--------------------------------------|
| `POST`   | `/monitors/`            | protect     | Create a new monitor                 |
| `GET`    | `/monitors/`            | protect     | Get all monitors for current user    |
| `PUT`    | `/monitors/:id`         | protect     | Update a monitor (owner only)        |
| `DELETE` | `/monitors/:id`         | protect     | Delete a monitor (owner only)        |
| `GET`    | `/monitors/admin/all`   | isAdmin     | Get ALL monitors (admin global view) |

### Scheduler — `monitor.scheduler.js`

The scheduler runs on a **5-second polling loop** and decides which monitors are due for a check based on their configured `interval`.

**How it works:**

1. Every 5s, fetches all active monitors from DB
2. Maintains a `lastRunMap` (in-memory `Map`) tracking when each monitor was last dispatched
3. If `now - lastRun >= monitor.interval` → adds a `check-url` job to BullMQ
4. Job config: 3 retries, exponential backoff starting at 2000ms, completed jobs auto-removed

```
Scheduler ticks every 5s
  └── For each active monitor
        └── If interval elapsed → add job to monitor-queue (BullMQ)
```

---

## ⚙️ Workers

### `monitor.worker.js` — BullMQ Monitor Worker

Processes `check-url` jobs from the `monitor-queue`. Concurrency: **5 parallel jobs**.

**Job processing flow:**

```
Job: { monitorId, url, method }
  ├── HTTP Request (axios, 5s timeout)
  ├── SUCCESS path:
  │     ├── Log.create({ success: true })
  │     └── handleSuccess(monitorId)  → resolves open incident if applicable
  └── FAILURE path:
        ├── Log.create({ success: false })
        └── handleFailure(monitorId)  → increments failure counter, may trigger incident
```

---

## 🚨 Module: `incident`

Tracks downtime incidents. An incident is opened after **3 consecutive failures** and auto-resolved on the next success.

### Files

| File                         | Role                                   |
|------------------------------|----------------------------------------|
| `incident.model.js`          | Mongoose `Incident` schema             |
| `incident.service.js`        | DB helpers (create, resolve, find)     |
| `incident.controller.js`     | HTTP handlers                          |
| `incident.routes.js`         | Express router                         |
| `incident.processor.js`      | Failure/success logic + threshold gate |
| `incident.processor.ai.js`   | AI analysis trigger on new incident    |

### Incident Schema

| Field        | Type     | Default     | Notes                              |
|--------------|----------|-------------|------------------------------------|
| `monitorId`  | ObjectId | —           | Ref to `Monitor`, required         |
| `status`     | String   | `"OPEN"`    | `"OPEN"` or `"RESOLVED"`           |
| `message`    | String   | —           | Incident description               |
| `failCount`  | Number   | `0`         | Number of failures counted         |
| `startedAt`  | Date     | `Date.now`  | When the incident started          |
| `resolvedAt` | Date     | —           | When the incident was resolved     |

### Failure & Resolution Logic — `incident.processor.js`

- **Threshold**: `FAILURE_THRESHOLD = 3`
- **In-memory** `failureMap: Map<monitorId, count>` tracks consecutive failures per monitor

```
handleFailure(monitorId):
  count = failureMap.get(id) + 1
  if count >= 3 && no open incident exists:
    → createIncident()
    → processIncident() [AI analysis]
    → triggerAlert()    [email notification]

handleSuccess(monitorId):
  if had >= 3 failures:
    → resolveIncident()
  → reset failureMap counter to 0
```

### AI Trigger — `incident.processor.ai.js`

Automatically called when a new incident is created:

1. Fetches `Monitor` and last 10 `Log` entries
2. Builds a structured prompt via `ai.promptBuilder.js`
3. Calls Gemini API via `ai.service.js`
4. Parses and normalizes the JSON response via `ai.formatter.js`
5. Persists an `AIInsight` document linked to the incident

---

## 🧠 Module: `ai`

Integrates with **Google Gemini 2.5 Flash** API to analyze incidents and provide root cause analysis and suggestions.

### Files

| File                  | Role                                            |
|-----------------------|-------------------------------------------------|
| `ai.model.js`         | Mongoose `AIInsight` schema                     |
| `ai.service.js`       | Raw Gemini API caller                           |
| `ai.promptBuilder.js` | Constructs context-rich prompt from monitor data|
| `ai.formatter.js`     | Parses and normalizes AI JSON response          |
| `ai.controller.js`    | HTTP handler for fetching stored insights       |
| `ai.routes.js`        | Express router                                  |

### AIInsight Schema

| Field        | Type       | Notes                              |
|--------------|------------|------------------------------------|
| `monitorId`  | ObjectId   | Ref to `Monitor`                   |
| `incidentId` | ObjectId   | Ref to `Incident`                  |
| `status`     | String     | e.g. `"stable"` / `"unstable"`    |
| `reason`     | String     | Root cause analysis                |
| `suggestion` | [String]   | List of fix suggestions            |

### Prompt Structure

The prompt sent to Gemini includes:
- Monitor URL + HTTP method
- Last 5 log entries (status code, latency, success)
- Incident message

**Expected Gemini JSON response:**
```json
{
  "status": "unstable",
  "reason": "Server returning 503 errors",
  "suggestion": "Check server health, review deployment logs"
}
```

The `ai.formatter.js` extracts the JSON block from the raw text response, normalizes `suggestion` to always be an array, and handles fallback for empty/malformed responses.

### API Routes

| Method | Route                          | Auth    | Description                           |
|--------|--------------------------------|---------|---------------------------------------|
| `GET`  | `/ai/insights/:monitorId`      | protect | Get stored AI insights for a monitor  |

---

## 📊 Module: `logs`

Stores one log entry per monitor check. Supports time-series analytics and automatic TTL cleanup.

### Files

| File                | Role                                     |
|---------------------|------------------------------------------|
| `log.model.js`      | Mongoose `Log` schema + indexes          |
| `log.service.js`    | Analytics aggregation pipeline           |
| `log.controller.js` | HTTP handlers                            |
| `log.routes.js`     | Express router                           |
| `log.repository.js` | Repository pattern wrapper (planned)     |

### Log Schema

| Field          | Type     | Notes                           |
|----------------|----------|---------------------------------|
| `monitorId`    | ObjectId | Ref to `Monitor`                |
| `status`       | Number   | HTTP response status code       |
| `responseTime` | Number   | Latency in ms                   |
| `success`      | Boolean  | Whether check passed            |

**Indexes:**
- `{ monitorId: 1, createdAt: -1 }` — compound index for fast aggregation
- `{ createdAt: 1 }` with **TTL: 7 days** — automatic log expiry

### Analytics Pipeline (`getMonitorAnalytics`)

Uses MongoDB `$facet` aggregation to return in a single query:

| Facet        | Output                                          |
|--------------|-------------------------------------------------|
| `summary`    | `totalChecks`, `avgLatency`, `success`, `failures` |
| `timeseries` | Grouped by `HH:MM` with `avgLatency` per bucket |
| `latest`     | Most recent log entry for current status         |

**Derived metrics:**
- `uptime` = `(success / totalChecks) * 100` (%)
- `status` = `"UP"` or `"DOWN"` based on latest log
- `trend` = array of `{ time, latency }` for charts

---

## 📈 Module: `dashboard`

Aggregates cross-module data for the frontend dashboard UI.

### API Routes

| Method | Route                              | Description                              |
|--------|------------------------------------|------------------------------------------|
| `GET`  | `/dashboard/summary`               | Total monitors, active incidents, uptime |
| `GET`  | `/dashboard/monitors`              | All monitors sorted by creation date     |
| `GET`  | `/dashboard/incidents/:monitorId`  | Incident timeline for a monitor          |
| `GET`  | `/dashboard/ai/:monitorId`         | AI insights for a monitor                |
| `GET`  | `/dashboard/analytics/:monitorId`  | Last 50 log entries with latency array   |

### `getDashboardSummary` Response

```json
{
  "totalMonitors": 12,
  "activeIncidents": 2,
  "uptime": "98.74"
}
```

---

## 📬 Module: `alert`

Sends email notifications when an incident is triggered. Optionally includes AI analysis in the email body.

### Files

| File               | Role                                        |
|--------------------|---------------------------------------------|
| `alert.model.js`   | Mongoose `Alert` schema                     |
| `alert.service.js` | Alert trigger logic (email + DB record)     |
| `email.service.js` | Nodemailer transport (Gmail)                |

### Alert Schema

| Field            | Type     | Notes                               |
|------------------|----------|-------------------------------------|
| `monitorId`      | ObjectId | Ref to `Monitor`                    |
| `incidentId`     | ObjectId | Ref to `Incident`                   |
| `type`           | String   | `"EMAIL"` (default) or `"WEBHOOK"`  |
| `status`         | String   | `"SENT"` or `"FAILED"`             |
| `message`        | String   | Email body                          |
| `ai.status`      | String   | AI-derived status (embedded)        |
| `ai.reason`      | String   | AI root cause (embedded)            |
| `ai.suggestion`  | [String] | AI suggestions (embedded)           |

### `triggerAlert` Flow

```
1. Fetch AIInsight for the incident (if available)
2. Build email subject + body (with AI section if present)
3. Send email via Gmail (Nodemailer)
4. Save Alert document with status SENT or FAILED
```

**Email subject:**
- With AI: `Uptime Alert — Website Down (UNSTABLE)`
- Without AI: `Uptime Alert — Website Down`

### Email Service (`email.service.js`)

- Uses **Nodemailer** with **Gmail** transport
- Transporter is lazily initialized (singleton pattern)
- Requires `ALERT_EMAIL` + `ALERT_PASS` env vars

---

## 🔄 BullMQ Queues

Located in `src/queues/`:

| Queue File             | Queue Name       | Purpose                     |
|------------------------|------------------|-----------------------------|
| `monitor.queue.js`     | `monitor-queue`  | HTTP check jobs             |
| `alert.queue.js`       | `alert-queue`    | Alert delivery jobs         |
| `queue.connection.js`  | (shared)         | Shared Redis connection ref |

### Monitor Queue Job Shape

```json
{
  "monitorId": "ObjectId string",
  "url": "https://example.com",
  "method": "GET"
}
```

**Job Options:**
- `attempts: 3` (auto-retry on failure)
- `backoff: { type: "exponential", delay: 2000 }`
- `removeOnComplete: true`
- `removeOnFail: false` (keep for inspection)

---

## 🌐 Data Flow — Full Check Lifecycle

```
Scheduler (every 5s)
  └── getActiveMonitors()
        └── for each monitor due:
              └── monitorQueue.add("check-url", job)

BullMQ Worker (concurrency: 5)
  └── HTTP Request (axios, 5s timeout)
        ├── SUCCESS:
        │     ├── Log.create({ success: true })
        │     └── handleSuccess()
        │           └── If had 3+ failures → resolveIncident()
        └── FAILURE:
              ├── Log.create({ success: false })
              └── handleFailure()
                    └── If count >= 3 and no open incident:
                          ├── createIncident()
                          ├── processIncident()  [Gemini AI]
                          │     └── AIInsight.create()
                          └── triggerAlert()     [Email]
                                └── Alert.create()
```

---

## 🗃️ MongoDB Collections Summary

| Collection   | Model        | TTL         | Key Indexes                          |
|--------------|--------------|-------------|--------------------------------------|
| `users`      | `User`       | —           | `email` (unique)                     |
| `monitors`   | `Monitor`    | —           | `{ active: 1 }`                      |
| `logs`       | `Log`        | 7 days      | `{ monitorId, createdAt }` compound  |
| `incidents`  | `Incident`   | —           | —                                    |
| `alerts`     | `Alert`      | —           | —                                    |
| `aiinsights` | `AIInsight`  | —           | —                                    |

---

## 🔑 Environment Variables

| Variable             | Required | Description                                       |
|----------------------|----------|---------------------------------------------------|
| `PORT`               | Yes      | Express server port                               |
| `MONGO_URI`          | Yes      | MongoDB connection string                         |
| `REDIS_URL`          | Yes      | Redis connection URL (for BullMQ)                 |
| `JWT_SECRET`         | Yes      | Secret for signing access tokens                  |
| `JWT_REFRESH_SECRET` | Yes      | Secret for signing refresh tokens                 |
| `FRONTEND_URL`       | Yes      | Comma-separated list of allowed CORS origins      |
| `ALERT_EMAIL`        | Yes      | Gmail address used to send alert emails           |
| `ALERT_PASS`         | Yes      | Gmail app password for Nodemailer auth            |
| `ALERT_TO_EMAIL`     | Yes      | Recipient email address for alerts                |
| `GEMINI_API_KEY`     | Yes      | Google Gemini API key for AI analysis             |

---

## 📦 Dependencies

| Package         | Version   | Purpose                               |
|-----------------|-----------|---------------------------------------|
| `express`       | ^5.2.1    | Web framework                         |
| `mongoose`      | ^9.6.1    | MongoDB ODM                           |
| `bullmq`        | ^5.76.4   | Redis-backed job queue                |
| `ioredis`       | ^5.10.1   | Redis client (BullMQ backend)         |
| `axios`         | ^1.15.2   | HTTP client for monitor checks + AI   |
| `bcryptjs`      | ^3.0.3    | Password hashing                      |
| `jsonwebtoken`  | ^9.0.3    | JWT token generation & verification   |
| `cookie-parser` | ^1.4.7    | HTTP cookie parsing                   |
| `cors`          | ^2.8.6    | Cross-origin resource sharing         |
| `dotenv`        | ^17.4.2   | Environment variable loading          |
| `nodemailer`    | ^8.0.7    | Email sending (Gmail SMTP)            |
| `nodemon`       | ^3.1.14   | Dev server auto-restart               |

---

## 🛠️ Running the Backend

```bash
# Install dependencies
npm install

# Start development server (with nodemon auto-reload)
npm start
```

> **Note:** Ensure MongoDB and Redis are running and all required environment variables are set in `.env` before starting.

---

## 🏗️ Architecture Notes

- **Module-based structure**: Each feature domain has its own folder with `model`, `service`, `controller`, and `routes` files — keeping concerns cleanly separated.
- **Queue-driven checks**: Monitor checks are decoupled from the scheduler using BullMQ, enabling built-in retry logic, concurrency control, and horizontal scaling.
- **AI-augmented incidents**: Every new incident automatically triggers Gemini AI analysis, providing actionable insights before the alert email is even dispatched.
- **Token rotation**: Refresh tokens are stored server-side and invalidated on logout, preventing token replay attacks.
- **Automatic log cleanup**: MongoDB TTL index on the `Log` collection ensures only the last 7 days of check logs are retained, keeping the DB lean.
- **DNS override**: Custom DNS servers (`1.1.1.1`, `8.8.8.8`) ensure reliable URL resolution from the server environment.
