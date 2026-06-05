About the challenge
The Splunk Agentic Ops Hackathon invites developers, security, IT and network engineers, and all AI-forward builders to create innovative solutions that combine AI with the power of Splunk. Participants will build intelligent applications that enhance observability, security/network operations and developer productivity using the latest Splunk AI capabilities.

During the hackathon, teams will develop projects across three core tracks: Observability, Security, and Platform, while leveraging cutting-edge capabilities such as AI agents for Splunk apps, Splunk MCP Server, Splunk hosted models, AI Assistant, and AI-powered app development tools.

Whether you're building AI-powered incident investigation tools, intelligent security workflows, or next-generation developer experiences for Splunk apps, this hackathon is an opportunity to experiment, innovate, and showcase what’s possible when AI meets operational data.

With $20,000 and .conf26 passes in prizes, participants will compete to build the most impactful solutions that help organizations monitor systems smarter, detect threats faster, and unlock new ways to build on the Splunk platform.

 

Get Started
Create a free Splunk account
Download Splunk Enterprise free trial (which will be valid for 60 days from the time of install).
Request for a Developer License through the developer program and apply the Developer License to your free trial, where the agreement changes to developer use cases (Developer License will be valid for 6 months)

Note: If you already have a Splunk Enterprise or Splunk Cloud License (either free trial or non-free trial version), you can just simply request for a Developer License through the Splunk Developer Program and apply the Developer License to your Splunk instance.
The submission period opens May 18th!
Requirements
What to Build
Build an innovative AI-powered solution that enhances how teams monitor systems, secure environments, or build on the Splunk platform. Your project should leverage one or more of Splunk’s latest AI capabilities to solve real-world challenges in observability, security operations, or developer productivity.

Submit your project under one of the following tracks:

Observability
Build solutions that help engineering teams - software, ITOps or NetOps - better understand system behavior, detect anomalies earlier, and automate operational responses using AI.
Security
Build solutions that help security teams detect threats faster, investigate incidents more efficiently, and automate security workflows using AI and Splunk data
Platform & Developer Experience
Build solutions that enhance the developer experience, automate workflows, or simplify how applications interact with Splunk data and AP
 


 # OpsTwin AI

## Preserving Institutional Knowledge Through Agentic Operations

### Splunk Agentic Ops Hackathon Submission

**Track:** Observability

**Additional Prize Targets:**

* Grand Prize
* Best of Observability
* Best Use of Splunk MCP Server
* Best Use of Splunk Hosted Models

---

# Executive Summary

Modern enterprises depend heavily on a handful of highly experienced engineers who possess years of operational expertise.

These experts know:

* How to investigate incidents
* Which alerts matter
* Which metrics are misleading
* Which remediation actions work
* Which teams should be involved

When these employees leave, organizations lose critical institutional knowledge.

OpsTwin AI solves this problem by creating Digital Operational Twins of expert engineers.

Using Splunk operational data, AI agents continuously learn investigation patterns, decision-making processes, remediation workflows, and incident resolution strategies.

When future incidents occur, autonomous agents reconstruct the expert's reasoning process and provide guided recommendations to engineering teams.

The result is faster incident response, reduced downtime, and preservation of organizational expertise.

---

# Problem Statement

Organizations invest years building operational knowledge.

Unfortunately:

* Knowledge is fragmented
* Knowledge is undocumented
* Knowledge often exists only in people's heads

When senior engineers leave:

* MTTR increases
* Incident quality decreases
* Teams repeat past mistakes
* Recovery becomes slower

Current observability platforms provide visibility but do not preserve expertise.

The industry lacks a mechanism for preserving operational intelligence.

---

# Proposed Solution

OpsTwin AI creates Digital Twins of operational experts.

The platform continuously learns from:

* Splunk logs
* Metrics
* Traces
* Incident tickets
* Postmortems
* Runbooks
* Team communications
* Deployment histories

The system captures:

* Investigation sequences
* Decision paths
* Root-cause analysis methods
* Successful remediation actions

When a future incident occurs, AI agents recreate the expert's reasoning process and guide responders through the investigation.

---

# Core Innovation

Traditional Observability

Alert
↓
Dashboard
↓
Human Investigation

OpsTwin AI

Alert
↓
Multi-Agent Investigation
↓
Expert Simulation
↓
Risk Evaluation
↓
Resolution Planning
↓
Human Approval

Instead of monitoring systems, OpsTwin preserves expertise.

---

# Splunk MCP Server Integration

(Targeting Best Use of Splunk MCP Server)

The Splunk MCP Server serves as the central intelligence layer for all agents.

Every agent interacts with Splunk through MCP.

## Historian Agent

Queries:

* Historical incidents
* Similar outages
* Past resolutions

Example:

Find incidents with:

* Redis memory growth
* API latency spike
* Database timeout

Return matching incidents.

---

## Expert Twin Agent

Queries:

* Historical investigations
* Engineer actions
* Incident timelines

Example:

How did Alex investigate similar incidents?

---

## Risk Agent

Queries:

* Service dependencies
* Infrastructure state
* Blast radius information

---

## Planner Agent

Queries:

* Current telemetry
* Existing alerts
* Active incidents

Produces actionable response plans.

MCP is not a secondary component.

MCP is the foundation of the entire architecture.

---

# Splunk Hosted Models Integration

(Targeting Best Use of Splunk Hosted Models)

Hosted Models power the intelligence layer.

## Knowledge Extraction

Historical incidents are analyzed to extract:

* Symptoms
* Root causes
* Actions taken
* Resolution outcomes

---

## Incident Summarization

Large incident histories become structured operational memories.

---

## Expert Behavior Modeling

Hosted Models identify:

* Investigation patterns
* Preferred troubleshooting sequences
* Common remediation actions

---

## Recommendation Generation

During incidents:

Hosted Models generate:

* Investigation plans
* Resolution recommendations
* Confidence scores

---

# Multi-Agent Architecture

## Agent 1: Incident Historian

Mission:

Retrieve relevant operational memory.

Responsibilities:

* Search incident archives
* Find similar failures
* Retrieve historical fixes

Output:

Relevant incident knowledge.

---

## Agent 2: Expert Twin Agent

Mission:

Simulate expert reasoning.

Responsibilities:

* Reconstruct investigation process
* Predict likely hypotheses
* Suggest next steps

Output:

Expert-style reasoning path.

---

## Agent 3: Risk Assessment Agent

Mission:

Prevent dangerous actions.

Responsibilities:

* Evaluate remediation risks
* Assess service impact
* Calculate blast radius

Output:

Risk-ranked recommendations.

---

## Agent 4: Resolution Planner

Mission:

Create executable response plans.

Responsibilities:

* Merge findings from all agents
* Generate action sequences
* Prioritize remediation

Output:

Operational response plan.

---

# Knowledge Preservation Engine

## Vector Memory

Stores:

* Incidents
* Postmortems
* Runbooks
* Communications

Supports:

Semantic search.

---

## Knowledge Graph

Links:

Engineer
↓
Incident
↓
Root Cause
↓
Service
↓
Resolution

Creates explainable operational memory.

---

# Incident Workflow

## Stage 1

Knowledge Ingestion

Splunk telemetry and organizational data are continuously processed.

Knowledge is extracted and stored.

---

## Stage 2

Anomaly Detection

Splunk identifies:

* Latency spike
* Service degradation
* Infrastructure failure

Incident generated.

---

## Stage 3

Agentic Investigation

Historian Agent searches memory.

Expert Twin Agent reconstructs reasoning.

Risk Agent evaluates actions.

Planner Agent generates response plan.

---

## Stage 4

Human Approval

Recommendations are reviewed.

Approval required before execution.

---

## Stage 5

Operational Resolution

Teams execute remediation.

Incident resolved.

Knowledge retained for future incidents.

---

# Example Scenario

Senior Engineer Alex leaves the company.

Alex previously solved:

* 500 incidents
* 80 major outages

Six months later:

Production API experiences severe latency.

Splunk detects:

* Redis memory saturation
* API response degradation
* Database timeout increase

Historian Agent:

Finds Incident #142 with 92% similarity.

Expert Twin Agent:

Determines Alex investigated Redis first in similar situations.

Risk Agent:

Ranks remediation options.

Resolution Planner:

Generates response plan.

Recommendations:

1. Verify Redis memory
2. Check cache hit ratio
3. Restart cache pods

Confidence Score: 92%

Result:

Incident resolved in minutes instead of hours.

---

# Competitive Advantages

## Unique Problem

Most observability tools monitor systems.

OpsTwin preserves expertise.

---

## Strong Business Impact

Every organization faces:

* Employee turnover
* Knowledge loss
* Operational risk

---

## Agentic Architecture

Multiple specialized AI agents collaborate.

Not a simple chatbot.

---

## Deep Splunk Integration

MCP drives every investigation.

Hosted Models power every recommendation.

---

# Judging Criteria Alignment

## Technological Implementation

✓ Multi-Agent Architecture

✓ Splunk MCP Integration

✓ Hosted Models

✓ Vector Memory

✓ Knowledge Graph

---

## Design

✓ Guided Incident Investigation

✓ Explainable Recommendations

✓ Confidence Scores

✓ Interactive Dashboard

---

## Potential Impact

✓ Reduced MTTR

✓ Knowledge Preservation

✓ Faster Onboarding

✓ Lower Operational Risk

---

## Quality & Creativity

✓ Novel Concept

✓ Digital Twin Technology

✓ Institutional Memory Preservation

✓ Agentic Operations

---

# Expected Outcomes

Reduce MTTR by 30–50%

Preserve critical organizational knowledge

Improve incident response consistency

Accelerate onboarding of new engineers

Reduce dependency on individual experts

Create a long-term operational memory layer for the enterprise

---

# Future Vision

OpsTwin evolves into an Organizational Intelligence Layer where every incident, investigation, and resolution contributes to a continuously improving operational memory system.

The organization never loses expertise, regardless of employee turnover.

Knowledge becomes permanent.



For the **OpsTwin AI** hackathon project, I would present the tech stack in a professional architecture section like this:

# Technology Stack

## Frontend Layer

### User Interface & Visualization

* **React.js (Vite)**

  * Fast SPA development
  * Real-time dashboard rendering

* **Tailwind CSS**

  * Responsive UI
  * Modern design system

* **shadcn/ui**

  * Professional enterprise components

* **React Router**

  * Dashboard navigation

* **Recharts**

  * Incident analytics
  * Agent confidence visualizations
  * Operational metrics

---

# Backend Layer

### API & Agent Orchestration

* **FastAPI**

  * REST APIs
  * Agent orchestration
  * Incident processing

* **Python**

  * AI workflow development
  * Data ingestion
  * Splunk integrations

* **LangGraph**

  * Multi-agent workflow orchestration
  * Agent state management
  * Agent collaboration

---

# Splunk AI & Observability Layer

### Splunk Enterprise / Splunk Cloud

Primary operational data source:

* Logs
* Metrics
* Traces
* Alerts
* Historical incidents

---

### Splunk MCP Server

**Core Component**

Used by all AI agents to access operational data.

Capabilities:

* Query logs
* Query metrics
* Retrieve incidents
* Search operational history
* Fetch observability context

Agents communicate with Splunk exclusively through MCP.

This component is central to competing for:

🏆 Best Use of Splunk MCP Server

---

### Splunk Hosted Models

Used for:

* Incident summarization
* Knowledge extraction
* Root cause reasoning
* Expert behavior simulation
* Recommendation generation

This component is central to competing for:

🏆 Best Use of Splunk Hosted Models

---

### Splunk AI Assistant

Used for:

* Natural language incident exploration
* AI-powered operational insights
* Interactive investigations

---

# AI Agent Layer

### Historian Agent

Responsibilities:

* Find similar incidents
* Retrieve past resolutions
* Search operational memory

---

### Expert Twin Agent

Responsibilities:

* Simulate expert engineer reasoning
* Reconstruct investigation paths
* Recommend next actions

---

### Risk Assessment Agent

Responsibilities:

* Evaluate remediation risk
* Estimate blast radius
* Rank response actions

---

### Resolution Planner Agent

Responsibilities:

* Generate incident response plans
* Prioritize actions
* Coordinate investigation workflow

---

# Knowledge Layer

### Qdrant Vector Database

Stores:

* Incident summaries
* Runbooks
* Postmortems
* Slack discussions
* Jira tickets

Used for:

* Semantic search
* Similarity matching
* Retrieval-Augmented Generation (RAG)

---

### Neo4j Knowledge Graph

Stores relationships between:

```text
Engineer
   ↓
Incident
   ↓
Root Cause
   ↓
Resolution
   ↓
Affected Service
```

Used for:

* Expert reasoning reconstruction
* Explainable recommendations
* Knowledge preservation

---

# Operational Database

### PostgreSQL (Neon)

Stores:

* User data
* Engineer profiles
* Incident metadata
* Agent outputs
* Recommendation history

---

# External Integrations

### Slack API

Data Sources:

* Incident channels
* Troubleshooting discussions
* Expert decisions

---

### Jira API

Data Sources:

* Incident tickets
* Resolution notes
* Historical investigations

---

# Deployment Infrastructure

### Frontend

* Vercel

### Backend

* Railway

### Database

* Neon PostgreSQL

### Vector Database

* Qdrant Cloud

### Knowledge Graph

* Neo4j Aura

---

# Final Architecture

```text
                Splunk Enterprise
                       │
                Splunk MCP Server
                       │
      ┌────────────────┼────────────────┐
      │                │                │
      ▼                ▼                ▼

Historian Agent  Expert Twin Agent  Risk Agent
      │                │                │
      └────────────┬───┴───────────────┘
                   │
                   ▼
          Resolution Planner Agent
                   │
                   ▼
              FastAPI Backend
                   │
       ┌───────────┼───────────┐
       │           │           │
       ▼           ▼           ▼

   Qdrant      PostgreSQL    Neo4j
       │
       ▼
 React + Tailwind Dashboard
```

### Prize Alignment

| Prize                               | Supporting Technologies                                                                 |
| ----------------------------------- | --------------------------------------------------------------------------------------- |
| 🏆 Best of Observability            | Splunk Enterprise, MCP Server, Agentic Investigation                                    |
| 🏆 Best Use of Splunk MCP Server    | MCP-driven agent architecture                                                           |
| 🏆 Best Use of Splunk Hosted Models | Hosted Models for reasoning and expert simulation                                       |
| 🏆 Grand Prize                      | Multi-agent architecture + Knowledge Graph + Digital Twin concept + Splunk AI ecosystem |

This architecture looks enterprise-grade while still being realistic for a hackathon MVP.




