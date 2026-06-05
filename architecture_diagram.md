# OpsTwin AI — Architecture Diagram

```mermaid
flowchart TB
    %% User Layer
    User([👤 Engineer / Operator])

    %% Frontend
    subgraph Frontend["React Dashboard"]
        Landing[Landing Page]
        Login[Login / Signup]
        Dashboard[Dashboard Home]
        Investigate[Investigate Page]
        History[Investigation History]
        Knowledge[Knowledge Graph]
        Analytics[Analytics]
    end

    %% Backend API
    subgraph Backend["FastAPI Backend"]
        Auth[JWT Auth Service]
        API[REST API Endpoints]
        Orchestrator[LangGraph Orchestrator]
    end

    %% Agent Layer
    subgraph Agents["Multi-Agent Pipeline"]
        direction LR
        Historian[🔍 Historian Agent]
        ExpertTwin[🧠 Expert Twin Agent]
        RiskAgent[⚠️ Risk Assessment Agent]
        Planner[📋 Resolution Planner]
    end

    %% Splunk Layer
    subgraph Splunk["Splunk Platform"]
        MCP[MCP Service Layer]
        SplunkML[Splunk ML Models]
        SplunkData[(Splunk Enterprise 10.4\n500+ Incidents)]
    end

    %% External Services
    subgraph External["External Services"]
        Groq[Groq LLM\nLlama 3.3 70B]
        Neon[(Neon PostgreSQL\nUsers + History)]
    end

    %% Connections - User to Frontend
    User --> Frontend

    %% Frontend to Backend
    Login --> Auth
    Investigate --> API
    Dashboard --> API
    History --> API
    Analytics --> API

    %% Backend to Agents
    API --> Orchestrator
    Orchestrator --> Historian
    Historian --> ExpertTwin
    ExpertTwin --> RiskAgent
    RiskAgent --> Planner

    %% Agents to Splunk MCP
    Historian --> MCP
    ExpertTwin --> MCP
    RiskAgent --> MCP
    Planner --> Groq

    %% Splunk Internal
    MCP --> SplunkData
    MCP --> SplunkML
    SplunkML --> SplunkData

    %% Agents to LLM
    Historian --> Groq
    ExpertTwin --> Groq
    RiskAgent --> Groq

    %% Backend to Database
    Auth --> Neon
    API --> Neon

    %% Styling
    classDef splunk fill:#06b6d4,stroke:#004e5c,color:#fff
    classDef agent fill:#1f1b17,stroke:#4cd7f6,color:#eae1da
    classDef frontend fill:#231f1b,stroke:#3d494c,color:#eae1da
    classDef external fill:#2e2925,stroke:#5de6ff,color:#eae1da

    class MCP,SplunkML,SplunkData splunk
    class Historian,ExpertTwin,RiskAgent,Planner agent
    class Landing,Login,Dashboard,Investigate,History,Knowledge,Analytics frontend
    class Groq,Neon external
```

---

## Data Flow Summary

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React Frontend
    participant BE as FastAPI Backend
    participant LG as LangGraph
    participant H as Historian Agent
    participant ET as Expert Twin
    participant RA as Risk Agent
    participant RP as Resolution Planner
    participant MCP as Splunk MCP
    participant S as Splunk Enterprise
    participant LLM as Groq LLM
    participant DB as Neon PostgreSQL

    U->>FE: Trigger Investigation (service, symptoms)
    FE->>BE: POST /api/v1/investigation/start
    BE->>LG: Start agent pipeline
    
    LG->>H: Stage 1: Find similar incidents
    H->>MCP: get_incidents(service, root_cause)
    MCP->>S: SPL Query
    S-->>MCP: Incident results
    MCP-->>H: Similar incidents
    H->>MCP: predict_root_cause() [Splunk ML]
    MCP->>S: Statistical analysis
    S-->>H: Prediction
    H->>LLM: Summarize findings
    LLM-->>H: Summary
    
    LG->>ET: Stage 2: Simulate expert
    ET->>MCP: find_best_expert(service)
    MCP->>S: SPL stats query
    S-->>ET: Best engineer
    ET->>MCP: get_engineer_history(engineer)
    MCP->>S: SPL query
    S-->>ET: Investigation patterns
    ET->>LLM: Simulate reasoning
    LLM-->>ET: Expert-style plan
    
    LG->>RA: Stage 3: Assess risk
    RA->>MCP: get_service_dependencies()
    MCP->>S: SPL query
    S-->>RA: Blast radius data
    RA->>LLM: Evaluate risk
    LLM-->>RA: Risk assessment
    
    LG->>RP: Stage 4: Generate plan
    RP->>LLM: Synthesize all findings
    LLM-->>RP: Resolution plan
    
    LG-->>BE: Complete result
    BE->>DB: Save investigation
    BE-->>FE: Response (plan + confidence)
    FE-->>U: Display resolution plan
```

---

## Component Responsibilities

| Component | Technology | Responsibility |
|-----------|-----------|----------------|
| Frontend | React + Tailwind | User interface, investigation trigger, results display |
| Backend API | FastAPI | Auth, routing, orchestration entry point |
| LangGraph | Python | Sequential agent pipeline management |
| Historian | Agent | Search operational memory, detect anomalies |
| Expert Twin | Agent | Simulate expert engineer reasoning |
| Risk Agent | Agent | Evaluate blast radius, rank actions |
| Planner | Agent | Merge findings into executable plan |
| MCP Layer | Python service | Sole Splunk access interface for all agents |
| Splunk ML | SPL commands | Anomaly detection, prediction, MTTR estimation |
| Splunk Enterprise | Data platform | 500+ incidents, operational data storage |
| Groq LLM | Llama 3.3 70B | Reasoning, summarization, plan generation |
| Neon PostgreSQL | Database | User accounts, investigation persistence |
