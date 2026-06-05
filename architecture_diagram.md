# OpsTwin AI — Architecture Diagram

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'fontSize': '16px'}}}%%
flowchart TB
    %% User
    User(["👤 Engineer / Operator"])

    %% Frontend Layer
    subgraph FRONTEND["🖥️ REACT DASHBOARD (Vite + Tailwind CSS)"]
        direction LR
        Landing["Landing Page"]
        Login["Login / Signup<br/>(JWT Auth)"]
        Dashboard["Dashboard Home<br/>(KPIs + Charts)"]
        Investigate["Investigate<br/>(Trigger Agents)"]
        History["Investigation<br/>History"]
        Knowledge["Knowledge Graph<br/>(Expert Twins)"]
        Analytics["Analytics<br/>(Splunk ML Data)"]
    end

    %% Backend Layer
    subgraph BACKEND["⚙️ FASTAPI BACKEND (Python)"]
        direction LR
        AuthService["Auth Service<br/>(JWT + Bcrypt)"]
        APIRoutes["REST API<br/>Endpoints"]
        LangGraphEngine["LangGraph<br/>Orchestrator"]
    end

    %% Agent Layer
    subgraph AGENTS["🤖 MULTI-AGENT PIPELINE (LangGraph)"]
        direction LR
        Historian["🔍 HISTORIAN<br/>Find Similar<br/>Incidents"]
        ExpertTwin["🧠 EXPERT TWIN<br/>Simulate Engineer<br/>Reasoning"]
        RiskAgent["⚠️ RISK AGENT<br/>Calculate Blast<br/>Radius"]
        Planner["📋 PLANNER<br/>Generate Resolution<br/>Plan"]
    end

    %% Splunk Layer
    subgraph SPLUNK["🟢 SPLUNK PLATFORM (Enterprise 10.4)"]
        direction LR
        MCPLayer["MCP SERVICE LAYER<br/>(Sole Data Access)"]
        SplunkML["SPLUNK ML MODELS<br/>• Anomaly Detection<br/>• Root Cause Prediction<br/>• MTTR Estimation"]
        SplunkDB[("SPLUNK INDEX<br/>opstwin_incidents<br/>500+ Incidents<br/>4 Engineers")]
    end

    %% External
    subgraph EXTERNAL["☁️ EXTERNAL SERVICES"]
        direction LR
        GroqLLM["GROQ LLM<br/>Llama 3.3 70B<br/>(Reasoning Engine)"]
        NeonDB[("NEON POSTGRESQL<br/>• Users<br/>• Investigations<br/>• JWT Tokens")]
    end

    %% === CONNECTIONS ===

    %% User to Frontend
    User --> FRONTEND

    %% Frontend to Backend
    Login --> AuthService
    Dashboard --> APIRoutes
    Investigate --> APIRoutes
    History --> APIRoutes
    Knowledge --> APIRoutes
    Analytics --> APIRoutes

    %% Backend to Agents
    APIRoutes --> LangGraphEngine
    LangGraphEngine --> Historian
    Historian --> ExpertTwin
    ExpertTwin --> RiskAgent
    RiskAgent --> Planner

    %% ALL Agents to Splunk MCP (sole data access)
    Historian -->|"SPL Query"| MCPLayer
    ExpertTwin -->|"SPL Query"| MCPLayer
    RiskAgent -->|"SPL Query"| MCPLayer

    %% Splunk Internal
    MCPLayer --> SplunkDB
    MCPLayer --> SplunkML
    SplunkML --> SplunkDB

    %% Agents to LLM (bidirectional — send context, receive reasoning)
    Historian <-->|"Summarize"| GroqLLM
    ExpertTwin <-->|"Simulate"| GroqLLM
    RiskAgent <-->|"Assess"| GroqLLM
    Planner <-->|"Plan"| GroqLLM

    %% Backend to Database
    AuthService --> NeonDB
    APIRoutes -->|"Persist Results"| NeonDB

    %% Knowledge page to Splunk
    Knowledge -->|"Expert Stats"| APIRoutes

    %% Styling
    classDef splunkStyle fill:#064e3b,stroke:#06b6d4,stroke-width:2px,color:#fff
    classDef agentStyle fill:#1e1b4b,stroke:#8b5cf6,stroke-width:2px,color:#fff
    classDef frontendStyle fill:#1c1917,stroke:#4cd7f6,stroke-width:2px,color:#eae1da
    classDef externalStyle fill:#172554,stroke:#5de6ff,stroke-width:2px,color:#fff
    classDef backendStyle fill:#292524,stroke:#f59e0b,stroke-width:2px,color:#fff

    class MCPLayer,SplunkML,SplunkDB splunkStyle
    class Historian,ExpertTwin,RiskAgent,Planner agentStyle
    class Landing,Login,Dashboard,Investigate,History,Knowledge,Analytics frontendStyle
    class GroqLLM,NeonDB externalStyle
    class AuthService,APIRoutes,LangGraphEngine backendStyle
```

---

## Investigation Flow (Sequence)

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'fontSize': '14px'}}}%%
sequenceDiagram
    participant U as 👤 User
    participant FE as 🖥️ Frontend
    participant BE as ⚙️ Backend
    participant H as 🔍 Historian
    participant ET as 🧠 Expert Twin
    participant RA as ⚠️ Risk Agent
    participant RP as 📋 Planner
    participant MCP as 🟢 Splunk MCP
    participant ML as 📊 Splunk ML
    participant LLM as 🤖 Groq LLM
    participant DB as 💾 Neon DB

    U->>FE: Select service + symptoms + severity
    FE->>BE: POST /api/v1/investigation/start
    BE->>H: Stage 1 — Search operational memory

    rect rgb(30, 27, 75)
        Note over H,MCP: HISTORIAN AGENT
        H->>MCP: get_incidents(redis-cluster, memory_leak)
        MCP-->>H: 5 similar incidents found
        H->>ML: predict_root_cause(redis-cluster, P1)
        ML-->>H: memory_leak (50% probability)
        H->>ML: detect_anomaly(redis-cluster)
        ML-->>H: Anomaly detected (z=2.4)
        H->>LLM: Summarize findings
        LLM-->>H: "Pattern matches INC-0142..."
    end

    H->>ET: Pass findings →

    rect rgb(88, 28, 135)
        Note over ET,MCP: EXPERT TWIN AGENT
        ET->>MCP: find_best_expert(redis-cluster)
        MCP-->>ET: alex_chen (175 incidents)
        ET->>MCP: get_engineer_history(alex_chen)
        MCP-->>ET: Investigation patterns
        ET->>LLM: Simulate alex_chen reasoning
        LLM-->>ET: "Check memory first, then fragmentation ratio..."
    end

    ET->>RA: Pass findings →

    rect rgb(120, 53, 15)
        Note over RA,MCP: RISK ASSESSMENT AGENT
        RA->>MCP: get_service_dependencies(redis-cluster)
        MCP-->>RA: 3 downstream services
        RA->>MCP: get_recent_errors(redis-cluster)
        MCP-->>RA: 2 P1 incidents this week
        RA->>LLM: Assess blast radius
        LLM-->>RA: "Medium risk, 3 services affected"
    end

    RA->>RP: Pass findings →

    rect rgb(6, 78, 59)
        Note over RP,LLM: RESOLUTION PLANNER
        RP->>LLM: Synthesize all agent findings
        LLM-->>RP: 5-step resolution plan (87% confidence)
    end

    RP-->>BE: Complete result
    BE->>DB: Save investigation to PostgreSQL
    BE-->>FE: JSON response
    FE-->>U: Display plan + confidence + agent details
```

---

## Component Matrix

| Layer | Component | Technology | Responsibility |
|-------|-----------|-----------|----------------|
| **Frontend** | Dashboard | React + Vite + Tailwind | Interactive UI for all pages |
| **Frontend** | Auth | JWT in localStorage | Login, signup, protected routes |
| **Backend** | API Server | FastAPI (Python) | REST endpoints, auth, orchestration |
| **Backend** | Orchestrator | LangGraph | Sequential 4-agent pipeline |
| **Agents** | Historian | Python + Splunk MCP + LLM | Find similar incidents, run ML predictions |
| **Agents** | Expert Twin | Python + Splunk MCP + LLM | Simulate expert investigation patterns |
| **Agents** | Risk Agent | Python + Splunk MCP + LLM | Calculate blast radius, rank actions |
| **Agents** | Planner | Python + LLM | Merge findings into executable plan |
| **Data** | Splunk MCP | Custom Python service | Sole interface between agents and Splunk |
| **Data** | Splunk ML | SPL (z-score, stats, perc) | Anomaly detection, prediction, MTTR |
| **Data** | Splunk Enterprise | v10.4, Developer License | 500+ incidents across 4 engineers |
| **Data** | Neon PostgreSQL | Cloud database | Users, JWT, investigation history |
| **AI** | Groq | Llama 3.3 70B | Summarization, reasoning, plan generation |
