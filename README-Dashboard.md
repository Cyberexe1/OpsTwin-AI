# OpsTwin AI — Dashboard Design Document

## Overview

The dashboard is the authenticated application interface where engineering teams interact with OpsTwin AI. It contains multiple pages/views for incident investigation, knowledge management, agent monitoring, and operational analytics.

**Access:** After clicking "Launch Dashboard" from the landing page, users enter the app at `/dashboard`.

**Layout:** Persistent sidebar navigation + top header + main content area.

---

## Dashboard Shell Layout

```
┌──────────────────────────────────────────────────────────────┐
│  [≡]  OpsTwin AI          [Search...]       [🔔] [👤 User]  │  ← Top Header
├────────┬─────────────────────────────────────────────────────┤
│        │                                                     │
│  Nav   │              Main Content Area                      │
│        │                                                     │
│  📊    │                                                     │
│  Home  │                                                     │
│        │                                                     │
│  🔍    │                                                     │
│  Invest│                                                     │
│        │                                                     │
│  🧠    │                                                     │
│  Twins │                                                     │
│        │                                                     │
│  📈    │                                                     │
│  Analytics                                                   │
│        │                                                     │
│  ⚙️    │                                                     │
│  Settings                                                    │
│        │                                                     │
├────────┴─────────────────────────────────────────────────────┤
│  Status: All agents healthy  │  Splunk: Connected  │  v0.2   │  ← Status Bar
└──────────────────────────────────────────────────────────────┘
```

### Shell Specifications

| Element | Detail |
|---------|--------|
| Sidebar | 240px wide (collapsed: 64px), bg-gray-900, border-r border-gray-800 |
| Header | 56px height, fixed, bg-gray-950/90 backdrop-blur |
| Content | Scrollable, p-6, bg-gray-950 |
| Status Bar | 32px, fixed bottom, text-xs, border-t border-gray-800 |
| Theme | Same dark palette as landing page |

---

## Dashboard Page 1: Home / Overview

**Route:** `/dashboard` or `/dashboard/home`

**Purpose:** At-a-glance operational health, recent investigations, and system status.

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Operational Intelligence Overview                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│  │  MTTR   │ │Knowledge│ │  Expert │ │  Avg    │     │
│  │  -47%   │ │  500    │ │  Twins  │ │  Conf   │     │
│  │         │ │incidents│ │    4    │ │   87%   │     │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘     │
│                                                         │
│  ┌────────────────────────┐ ┌────────────────────────┐ │
│  │  MTTR Trend Chart      │ │  Agent Activity Chart  │ │
│  │  (Line: Before/After)  │ │  (Bar: executions)     │ │
│  │                        │ │                        │ │
│  └────────────────────────┘ └────────────────────────┘ │
│                                                         │
│  ┌────────────────────────┐ ┌────────────────────────┐ │
│  │  Recent Investigations │ │  System Health         │ │
│  │  (Table/List)          │ │  (Status indicators)   │ │
│  │                        │ │                        │ │
│  └────────────────────────┘ └────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Components

#### 1.1 KPI Cards Row

| Card | Value | Color | Icon | Subtitle |
|------|-------|-------|------|----------|
| MTTR Reduction | -47% | emerald-400 | TrendingDown | vs. pre-OpsTwin baseline |
| Knowledge Preserved | 500 | blue-400 | Database | incidents captured |
| Expert Twins | 4 | purple-400 | Brain | engineers modeled |
| Avg Confidence | 87% | amber-400 | Target | recommendation accuracy |

**Specs:** Cards are `bg-gray-900 border border-gray-800 rounded-xl p-6`. Numbers are `text-3xl font-bold`. Subtle hover elevation.

#### 1.2 MTTR Trend Chart

| Spec | Value |
|------|-------|
| Chart Type | Line chart (Recharts) |
| X-Axis | Monthly (Jan–Jun) |
| Lines | "Before OpsTwin" (red-400) and "After OpsTwin" (emerald-400) |
| Y-Axis | Minutes (0–150) |
| Height | 280px |
| Tooltip | Shows exact values on hover |
| Grid | Subtle dashed, stroke gray-700 |

**Data:**

```
Jan: Before=120, After=45
Feb: Before=95, After=38
Mar: Before=140, After=52
Apr: Before=110, After=35
May: Before=130, After=41
Jun: Before=125, After=39
```

#### 1.3 Agent Activity Chart

| Spec | Value |
|------|-------|
| Chart Type | Bar chart (vertical) |
| X-Axis | Agent names |
| Y-Axis | Execution count |
| Colors | Each bar different color matching agent identity |
| Height | 280px |

**Data:**

```
Historian: 142 (blue-400)
Expert Twin: 138 (purple-400)
Risk Agent: 135 (amber-400)
Resolution Planner: 130 (emerald-400)
```

#### 1.4 Recent Investigations Table

| Column | Content |
|--------|---------|
| ID | `INV-0042` (monospace) |
| Service | `redis-cluster` |
| Severity | Badge (P1=red, P2=amber, P3=gray) |
| Confidence | `92%` in emerald |
| Status | Badge (resolved=green, in_review=yellow, active=blue) |
| Time | Relative timestamp ("2 hours ago") |
| Action | "View" link |

**Specs:** 5 most recent rows. Clickable rows navigate to investigation detail.

#### 1.5 System Health Panel

| Service | Indicator |
|---------|-----------|
| Splunk Enterprise | 🟢 Connected |
| Splunk MCP Server | 🟢 Active |
| Qdrant Vector DB | 🟢 Healthy |
| Neo4j Knowledge Graph | 🟢 Healthy |
| PostgreSQL | 🟢 Healthy |
| Hosted Models | 🟢 Available |

**Specs:** Stacked list with dot indicators. Red dot + "Disconnected" if a service fails health check.

---

## Dashboard Page 2: Investigation

**Route:** `/dashboard/investigate`

**Purpose:** Trigger and monitor multi-agent incident investigations in real-time.

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Incident Investigation                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  TRIGGER INVESTIGATION                           │   │
│  │                                                  │   │
│  │  Service: [▼ redis-cluster]                      │   │
│  │  Symptoms: [memory_saturation, latency_spike]    │   │
│  │  Severity: [▼ P1 - Critical]                     │   │
│  │  Root Cause Hint: [optional...]                  │   │
│  │                                                  │   │
│  │  [🔍 Start Investigation]                        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  AGENT PIPELINE (live progress)                  │   │
│  │                                                  │   │
│  │  ①━━━━━②━━━━━③━━━━━④                            │   │
│  │                                                  │   │
│  │  [✓] Historian    → 3 incidents found (92%)      │   │
│  │  [✓] Expert Twin  → Simulating alex_chen (85%)   │   │
│  │  [⟳] Risk Agent   → Evaluating blast radius...   │   │
│  │  [ ] Planner      → Waiting...                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  RESOLUTION PLAN                                 │   │
│  │                                                  │   │
│  │  Confidence: ████████████░░ 87%                  │   │
│  │  Risk Level: MEDIUM                              │   │
│  │  ETA: 15-30 minutes                             │   │
│  │                                                  │   │
│  │  Steps:                                          │   │
│  │  1. Verify Redis memory usage                    │   │
│  │  2. Check cache hit ratio                        │   │
│  │  3. Restart cache pods if ratio < 60%            │   │
│  │  4. Monitor for 5 minutes                        │   │
│  │  5. Escalate if unresolved                       │   │
│  │                                                  │   │
│  │  [✓ Approve Plan]  [✏️ Modify]  [❌ Reject]      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │Historian │ │Expert    │ │Risk      │              │
│  │Details   │ │Twin      │ │Assessment│              │
│  │          │ │Details   │ │Details   │              │
│  └──────────┘ └──────────┘ └──────────┘              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Components

#### 2.1 Investigation Form

| Field | Type | Options |
|-------|------|---------|
| Service | Dropdown | redis-cluster, api-gateway, postgres-primary, auth-service, payment-service |
| Symptoms | Tag input | Free text, comma-separated, autocomplete from history |
| Severity | Dropdown | P1 - Critical, P2 - High, P3 - Medium |
| Root Cause Hint | Text input | Optional — seeds the historian search |
| Submit | Button | "Start Investigation" — emerald-600, disabled during loading |

#### 2.2 Agent Pipeline Progress

| State | Icon | Color | Text |
|-------|------|-------|------|
| Waiting | Circle (empty) | gray-600 | "Waiting..." |
| Running | Loader2 (spinning) | amber-400 | "Processing..." + detail |
| Complete | CheckCircle | emerald-400 | Result summary + confidence |
| Error | XCircle | red-400 | Error message |

**Specs:** 
- Horizontal stepper with connecting lines
- Lines animate from gray to emerald as agents complete
- Each step expands on click to show full agent output
- Real-time updates via polling (every 2s) or WebSocket

#### 2.3 Resolution Plan Card

| Element | Detail |
|---------|--------|
| Confidence Bar | Progress bar, color changes: <50% red, 50-75% amber, >75% emerald |
| Risk Badge | "LOW" (green) / "MEDIUM" (amber) / "HIGH" (red) / "CRITICAL" (red, pulsing) |
| Steps List | Numbered, each with checkbox for tracking |
| Approval Required | If risk=high/critical, shows warning banner requiring explicit approval |
| Action Buttons | Approve (emerald), Modify (blue), Reject (red) |

#### 2.4 Agent Detail Cards (Expandable)

Each card shows the full output of one agent:

**Historian Card:**
- Similar incidents list (ID, service, root cause, MTTR, engineer)
- Similarity percentage for each match
- Summary from Hosted Models

**Expert Twin Card:**
- Selected expert name and why they were chosen
- Expert's typical investigation pattern
- Simulated reasoning chain
- Suggested first 3 actions

**Risk Assessment Card:**
- Service dependency graph (text representation)
- Blast radius (# of affected services)
- Risk-ranked action list
- Side effects for each action

---

## Dashboard Page 3: Expert Twins / Knowledge

**Route:** `/dashboard/knowledge`

**Purpose:** View and manage digital twins of expert engineers. Explore the knowledge graph.

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Knowledge Graph — Expert Twins                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  EXPERT TWIN CARDS                               │   │
│  │                                                  │   │
│  │  ┌───────────┐ ┌───────────┐                    │   │
│  │  │ Alex Chen │ │ Maria     │                    │   │
│  │  │ 187 inc   │ │ Garcia    │                    │   │
│  │  │ 94% model │ │ 142 inc   │                    │   │
│  │  │           │ │ 91% model │                    │   │
│  │  │ redis     │ │           │                    │   │
│  │  │ memory    │ │ postgres  │                    │   │
│  │  │ api-gw    │ │ conn_pool │                    │   │
│  │  └───────────┘ └───────────┘                    │   │
│  │                                                  │   │
│  │  ┌───────────┐ ┌───────────┐                    │   │
│  │  │ James     │ │ Priya     │                    │   │
│  │  │ Wilson    │ │ Patel     │                    │   │
│  │  │ 98 inc    │ │ 73 inc    │                    │   │
│  │  │ 88% model │ │ 85% model │                    │   │
│  │  │           │ │           │                    │   │
│  │  │ network   │ │ disk_full │                    │   │
│  │  │ dns       │ │ cpu_spike │                    │   │
│  │  └───────────┘ └───────────┘                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  KNOWLEDGE GRAPH EXPLORER                        │   │
│  │                                                  │   │
│  │  [Interactive Graph Visualization]               │   │
│  │                                                  │   │
│  │  Nodes: Engineers, Incidents, Services,          │   │
│  │         Root Causes, Resolutions                 │   │
│  │                                                  │   │
│  │  Edges: INVESTIGATED, AFFECTED, CAUSED_BY,      │   │
│  │         RESOLVED_BY, HAS_EXPERTISE              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  EXPERT DETAIL (selected twin)                   │   │
│  │                                                  │   │
│  │  Investigation Patterns:                         │   │
│  │  • Checks Redis memory first (87% of cases)     │   │
│  │  • Prefers kubectl over manual SSH               │   │
│  │  • Escalates after 15 min if no progress        │   │
│  │                                                  │   │
│  │  Top Expertise:                                  │   │
│  │  memory_leak (45 incidents)                      │   │
│  │  connection_pool (32 incidents)                  │   │
│  │  api-gateway (28 incidents)                      │   │
│  │                                                  │   │
│  │  Resolution History (chart)                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Components

#### 3.1 Expert Twin Cards

| Field | Content |
|-------|---------|
| Name | Engineer full name |
| Avatar | Generated initials circle (colored by engineer) |
| Incidents Resolved | Number with small bar chart |
| Model Confidence | Percentage — how well the twin represents the expert |
| Expertise Tags | Badges showing top 3 domains |
| Status | "Active Twin" (green) or "Learning" (amber) |
| Click Action | Opens Expert Detail panel |

**Engineer Data:**

| Name | Incidents | Confidence | Expertise | Color |
|------|-----------|------------|-----------|-------|
| Alex Chen | 187 | 94% | redis, memory_leak, api-gateway | blue |
| Maria Garcia | 142 | 91% | postgres, connection_pool, auth-service | purple |
| James Wilson | 98 | 88% | network_partition, dns, load_balancer | amber |
| Priya Patel | 73 | 85% | disk_full, cpu_spike, payment-service | emerald |

#### 3.2 Knowledge Graph Explorer

| Spec | Value |
|------|-------|
| Library | react-force-graph-2d or vis-network |
| Node Types | Engineer (blue), Incident (red), Service (emerald), RootCause (amber), Resolution (purple) |
| Edge Types | INVESTIGATED, AFFECTED, CAUSED_BY, RESOLVED_BY |
| Interaction | Click node to highlight connections, zoom, pan, drag |
| Size | Fill available width, 400px height |
| Default View | Centered on selected engineer |

#### 3.3 Expert Detail Panel

Appears when clicking an expert twin card:

| Section | Content |
|---------|---------|
| Investigation Patterns | Bullet list of behavioral patterns extracted by Hosted Models |
| Top Expertise | Ranked list: root_cause type + count of resolved incidents |
| Preferred Tools | What commands/dashboards the expert used most |
| Avg MTTR | The expert's average resolution time |
| Resolution History | Small line chart showing MTTR over time |
| Similar Experts | Other engineers with overlapping expertise |

---

## Dashboard Page 4: Analytics

**Route:** `/dashboard/analytics`

**Purpose:** Deep operational analytics — trends, patterns, agent performance, and knowledge growth.

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Operational Analytics                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Time Range: ▼ Last 30 days]  [Service: ▼ All]        │
│                                                         │
│  ┌──────────────────────┐ ┌──────────────────────┐     │
│  │  Incidents Over Time │ │  MTTR Distribution   │     │
│  │  (Area chart)        │ │  (Histogram)         │     │
│  └──────────────────────┘ └──────────────────────┘     │
│                                                         │
│  ┌──────────────────────┐ ┌──────────────────────┐     │
│  │  Agent Confidence    │ │  Root Cause          │     │
│  │  Trend               │ │  Breakdown           │     │
│  │  (Line chart)        │ │  (Pie/Donut chart)   │     │
│  └──────────────────────┘ └──────────────────────┘     │
│                                                         │
│  ┌──────────────────────┐ ┌──────────────────────┐     │
│  │  Knowledge Growth    │ │  Service Heatmap     │     │
│  │  (Cumulative line)   │ │  (Grid/Heatmap)      │     │
│  └──────────────────────┘ └──────────────────────┘     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Agent Performance Table                         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Components

#### 4.1 Filters Bar

| Filter | Type | Options |
|--------|------|---------|
| Time Range | Dropdown | Last 7 days, Last 30 days, Last 90 days, Last year, Custom |
| Service | Multi-select | All services |
| Severity | Multi-select | P1, P2, P3 |
| Engineer | Dropdown | All engineers |

#### 4.2 Incidents Over Time

| Spec | Value |
|------|-------|
| Chart Type | Stacked area chart |
| X-Axis | Date |
| Y-Axis | Incident count |
| Series | By severity (P1=red, P2=amber, P3=gray) |
| Height | 280px |
| Interaction | Hover for daily breakdown |

#### 4.3 MTTR Distribution

| Spec | Value |
|------|-------|
| Chart Type | Histogram |
| X-Axis | MTTR buckets (0-15min, 15-30min, 30-60min, 60-120min, 120+min) |
| Y-Axis | Count of incidents |
| Color | Gradient from emerald (fast) to red (slow) |
| Annotation | Vertical line showing average MTTR |

#### 4.4 Agent Confidence Trend

| Spec | Value |
|------|-------|
| Chart Type | Multi-line chart |
| X-Axis | Weekly |
| Y-Axis | Confidence % (0-100) |
| Lines | One per agent (Historian=blue, Expert=purple, Risk=amber, Planner=emerald) |
| Insight | Shows confidence improving over time as knowledge grows |

#### 4.5 Root Cause Breakdown

| Spec | Value |
|------|-------|
| Chart Type | Donut chart |
| Segments | memory_leak, connection_pool_exhaustion, disk_full, cpu_spike, network_partition |
| Center Text | Total incident count |
| Legend | Right side, clickable to filter |
| Colors | Distinct per root cause |

#### 4.6 Knowledge Growth

| Spec | Value |
|------|-------|
| Chart Type | Cumulative line chart |
| X-Axis | Monthly |
| Y-Axis | Total knowledge items |
| Lines | Incidents (blue), Runbooks (emerald), Postmortems (purple), Expert Patterns (amber) |
| Insight | Shows knowledge base growing over time |

#### 4.7 Service Heatmap

| Spec | Value |
|------|-------|
| Chart Type | Grid heatmap |
| X-Axis | Day of week |
| Y-Axis | Service name |
| Cell Color | Intensity = incident count (white → amber → red) |
| Insight | Shows which services fail on which days |

#### 4.8 Agent Performance Table

| Column | Content |
|--------|---------|
| Agent | Name with icon |
| Total Executions | Count |
| Avg Confidence | Percentage |
| Avg Execution Time | Seconds |
| Success Rate | Percentage (recommendations accepted) |
| Trend | Sparkline showing last 30 days |

---

## Dashboard Page 5: Investigation History

**Route:** `/dashboard/history`

**Purpose:** Browse and search all past investigations with full agent output details.

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Investigation History                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Search: ___________]  [Status: ▼]  [Service: ▼]     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ID       Service        Severity  Conf  Status │   │
│  │  INV-0042 redis-cluster  P1        92%   ✓      │   │
│  │  INV-0041 api-gateway    P2        87%   ✓      │   │
│  │  INV-0040 payment-svc    P1        78%   ⟳      │   │
│  │  INV-0039 auth-service   P3        91%   ✓      │   │
│  │  INV-0038 postgres       P1        83%   ✓      │   │
│  │  ...                                            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [← Prev]  Page 1 of 12  [Next →]                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Investigation Detail View (on row click)

```
┌─────────────────────────────────────────────────────────┐
│  ← Back    Investigation INV-0042                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Service: redis-cluster   Severity: P1   Status: ✓     │
│  Started: 2025-06-03 14:32   Duration: 45 seconds      │
│  Overall Confidence: 92%                                │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  TIMELINE                                        │   │
│  │  14:32:00 — Investigation started                │   │
│  │  14:32:03 — Historian: found INC-0142 (92%)      │   │
│  │  14:32:15 — Expert Twin: alex_chen selected      │   │
│  │  14:32:28 — Risk Agent: MEDIUM, 2 services       │   │
│  │  14:32:45 — Plan generated, 5 steps              │   │
│  │  14:33:10 — Plan approved by operator            │   │
│  │  14:48:00 — Incident resolved                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Historian Output]  [Expert Twin]  [Risk]  [Plan]     │
│  (tabbed detail panels for each agent)                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Dashboard Page 6: Settings

**Route:** `/dashboard/settings`

**Purpose:** Configure Splunk connection, agent parameters, and notification preferences.

### Sections

#### 6.1 Splunk Connection

| Field | Input | Default |
|-------|-------|---------|
| Splunk Host | Text | localhost |
| Splunk Port | Number | 8089 |
| HEC Token | Password field | •••••• |
| Connection Status | Read-only indicator | 🟢 Connected |
| [Test Connection] | Button | — |

#### 6.2 Agent Configuration

| Setting | Input | Default |
|---------|-------|---------|
| Historian — Max similar incidents | Slider (1-20) | 10 |
| Expert Twin — Default expert | Dropdown | Auto-select |
| Risk Agent — Risk threshold | Dropdown | Medium |
| Planner — Max plan steps | Slider (3-10) | 7 |
| Confidence threshold for auto-approval | Slider (0-100%) | 90% |

#### 6.3 Knowledge Sources

| Source | Status | Toggle |
|--------|--------|--------|
| Splunk Incidents | Active | ✓ |
| Splunk Metrics | Active | ✓ |
| Splunk Traces | Active | ✓ |
| Jira Tickets | Not configured | [Configure] |
| Slack Channels | Not configured | [Configure] |
| Runbook Repository | Not configured | [Configure] |

#### 6.4 Notifications

| Setting | Options |
|---------|---------|
| Investigation complete | Email / Slack / None |
| High-risk plan generated | Email / Slack / None |
| Agent confidence below threshold | Email / Slack / None |
| New knowledge ingested | None (log only) |

---

## Real-Time Features

### WebSocket Events

The dashboard receives real-time updates for:

| Event | Source | Dashboard Update |
|-------|--------|------------------|
| `agent.started` | Backend | Pipeline step → running state |
| `agent.completed` | Backend | Pipeline step → complete with results |
| `investigation.complete` | Backend | Full results render, notification |
| `knowledge.ingested` | Ingestion pipeline | Knowledge count increments |
| `system.health` | Health check (30s interval) | Status bar updates |

### Polling Fallback

If WebSocket unavailable, poll `/api/v1/investigation/{id}/status` every 2 seconds during active investigations.

---

## Component Library

All dashboard components built with:

| Component | Source | Usage |
|-----------|--------|-------|
| Card | shadcn/ui | All content containers |
| Badge | shadcn/ui | Status, severity, tags |
| Button | shadcn/ui | Actions |
| Tabs | shadcn/ui | Agent detail switching |
| Progress | shadcn/ui | Confidence bars |
| Table | shadcn/ui | Investigation history |
| Select | shadcn/ui | Dropdowns/filters |
| Input | shadcn/ui | Form fields |
| Separator | shadcn/ui | Visual dividers |
| Alert | shadcn/ui | Warnings, errors |
| Charts | Recharts | All data visualizations |
| Icons | lucide-react | All icons |
| Animations | Framer Motion | Transitions, loading states |

---

## File Structure

```
frontend/src/
├── pages/
│   ├── Landing.tsx
│   └── dashboard/
│       ├── DashboardLayout.tsx      # Shell with sidebar
│       ├── Home.tsx                  # Overview page
│       ├── Investigate.tsx           # Investigation trigger + results
│       ├── Knowledge.tsx             # Expert twins + graph
│       ├── Analytics.tsx             # Charts and trends
│       ├── History.tsx               # Past investigations
│       ├── InvestigationDetail.tsx   # Single investigation view
│       └── Settings.tsx              # Configuration
├── components/
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── StatusBar.tsx
│   │   ├── KPICard.tsx
│   │   ├── AgentPipeline.tsx
│   │   ├── ResolutionPlan.tsx
│   │   ├── ExpertTwinCard.tsx
│   │   ├── KnowledgeGraph.tsx
│   │   ├── InvestigationTable.tsx
│   │   └── charts/
│   │       ├── MTTRChart.tsx
│   │       ├── AgentActivityChart.tsx
│   │       ├── ConfidenceTrend.tsx
│   │       ├── RootCauseDonut.tsx
│   │       ├── KnowledgeGrowth.tsx
│   │       └── ServiceHeatmap.tsx
│   └── ui/
│       └── ... (shadcn components)
├── hooks/
│   ├── useInvestigation.ts          # Investigation API + polling
│   ├── useAgentStatus.ts            # Real-time agent updates
│   └── useAnalytics.ts              # Analytics data fetching
├── lib/
│   ├── api.ts                       # Axios client
│   └── websocket.ts                 # WebSocket connection
└── types/
    ├── investigation.ts
    ├── agent.ts
    └── analytics.ts
```

---

## Route Configuration

```typescript
// App.tsx routes
<Routes>
  {/* Landing Page */}
  <Route path="/" element={<Landing />} />
  
  {/* Dashboard */}
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<Home />} />
    <Route path="investigate" element={<Investigate />} />
    <Route path="investigate/:id" element={<InvestigationDetail />} />
    <Route path="knowledge" element={<Knowledge />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="history" element={<History />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>
```

---

## API Endpoints Required

| Method | Endpoint | Dashboard Page |
|--------|----------|----------------|
| GET | `/api/v1/health` | Status bar |
| POST | `/api/v1/investigation/start` | Investigate |
| GET | `/api/v1/investigation/:id` | Investigation detail |
| GET | `/api/v1/investigation/:id/status` | Polling during investigation |
| GET | `/api/v1/investigations` | History (paginated) |
| GET | `/api/v1/analytics/mttr` | Analytics |
| GET | `/api/v1/analytics/agents` | Analytics |
| GET | `/api/v1/analytics/incidents` | Analytics |
| GET | `/api/v1/analytics/knowledge` | Analytics |
| GET | `/api/v1/experts` | Knowledge page |
| GET | `/api/v1/experts/:id` | Expert detail |
| GET | `/api/v1/experts/:id/patterns` | Expert patterns |
| GET | `/api/v1/graph/nodes` | Knowledge graph |
| GET | `/api/v1/settings` | Settings |
| PUT | `/api/v1/settings` | Settings |

---

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Keyboard navigation | All interactive elements focusable, tab order logical |
| Screen reader | ARIA labels on charts, status announcements for live regions |
| Color contrast | All text meets WCAG AA (4.5:1 ratio minimum) |
| Reduced motion | `prefers-reduced-motion` disables animations |
| Focus indicators | Visible focus rings on all interactive elements |
| Alt text | Chart descriptions available as aria-label |
