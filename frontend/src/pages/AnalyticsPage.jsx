import { useState, useEffect } from 'react'
import { getAnalyticsSummary, getRootCauses, getServiceHeatmap } from '../lib/api'

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null)
  const [rootCauses, setRootCauses] = useState(null)
  const [heatmap, setHeatmap] = useState(null)

  useEffect(() => {
    getAnalyticsSummary().then(setAnalytics).catch(() => {})
    getRootCauses().then(setRootCauses).catch(() => {})
    getServiceHeatmap().then(setHeatmap).catch(() => {})
  }, [])

  return (
    <div className="max-w-[1400px] mx-auto p-[24px] space-y-[32px] w-full">
      <FiltersBar />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
        <IncidentsOverTime />
        <MTTRDistribution />
        <AgentConfidenceTrend />
        <RootCauseBreakdown data={rootCauses} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        <KnowledgeGrowth analytics={analytics} />
        <ServiceHeatmap data={heatmap} />
      </div>

      <AgentPerformanceTable analytics={analytics} />
      <AnalyticsFooter />
    </div>
  )
}

/* ===================== SIDEBAR ===================== */
function AnalyticsSidebar({ user }) {
  const navItems = [
    { id: 'home', icon: 'home', label: 'Home', href: '/dashboard' },
    { id: 'investigate', icon: 'query_stats', label: 'Investigate' },
    { id: 'knowledge', icon: 'auto_awesome_motion', label: 'Knowledge' },
    { id: 'analytics', icon: 'monitoring', label: 'Analytics', active: true },
    { id: 'history', icon: 'history', label: 'History' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ]

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col py-[16px] border-r border-outline-variant bg-surface h-screen sticky top-0 z-50">
      <div className="px-6 mb-10">
        <h1 className="font-inter text-[24px] font-bold text-primary leading-[1.4]">OpsTwin AI</h1>
        <p className="text-on-surface-variant font-jetbrains text-[10px] tracking-widest mt-1 uppercase">
          Precision Operations
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href || '#'}
            className={`flex items-center px-6 py-3 transition-colors ${
              item.active
                ? 'text-primary font-bold border-r-2 border-primary bg-surface-container-high'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined mr-3">{item.icon}</span>
            <span className="text-[16px]">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <button className="w-full bg-primary text-on-primary py-3 px-4 font-jetbrains text-[14px] font-medium tracking-[0.15em] uppercase text-center flex items-center justify-center photonic-glow active:scale-[0.98] transition-transform duration-200">
          <span className="material-symbols-outlined mr-2">add</span>
          New Investigation
        </button>
        <div className="flex items-center mt-8 p-2 bg-surface-container rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mr-3">
            <span className="text-primary font-bold text-[11px]">{user.avatar}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface">{user.name}</p>
            <p className="text-on-surface-variant text-[10px] font-jetbrains tracking-[0.15em] uppercase">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

/* ===================== HEADER ===================== */
function AnalyticsHeader() {
  return (
    <header className="h-16 bg-surface border-b border-outline-variant z-40 flex items-center justify-between px-[24px] sticky top-0 backdrop-blur-md bg-surface/80">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            search
          </span>
          <input
            className="w-full bg-background border border-outline-variant py-2 pl-10 pr-4 text-sm font-jetbrains focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface placeholder:text-outline/50"
            placeholder="Search analytics or agents..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center space-x-6 ml-auto">
        <button className="text-on-surface-variant hover:text-primary transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full border border-surface"></span>
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">help</span>
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  )
}

/* ===================== FILTERS ===================== */
function FiltersBar() {
  const filters = [
    { label: 'TIME RANGE', options: ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days'], defaultIdx: 1 },
    { label: 'SERVICE', options: ['All Services', 'Auth-Core', 'Payment-Gateway', 'Search-Indexing'] },
    { label: 'SEVERITY', options: ['All Severities', 'P1 - Critical', 'P2 - Warning', 'P3 - Info'] },
    { label: 'ENGINEER', options: ['All Engineers', 'Alex Chen', 'Maria Garcia'] },
  ]

  return (
    <section className="flex flex-wrap items-center gap-4 bg-surface-container p-4 border border-outline-variant">
      {filters.map((f) => (
        <div key={f.label} className="flex items-center space-x-2">
          <span className="text-on-surface-variant font-jetbrains text-[12px] tracking-[0.15em] uppercase">
            {f.label}:
          </span>
          <select className="bg-background border border-outline-variant text-xs py-1.5 px-3 focus:border-primary outline-none font-jetbrains text-on-surface">
            {f.options.map((opt, i) => (
              <option key={opt} selected={i === (f.defaultIdx || 0)}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button className="ml-auto flex items-center space-x-2 border border-outline-variant px-4 py-1.5 hover:bg-surface-container-high transition-colors text-on-surface-variant">
        <span className="material-symbols-outlined text-sm">refresh</span>
        <span className="font-jetbrains text-[12px] tracking-[0.15em] uppercase">REFRESH DATA</span>
      </button>
    </section>
  )
}

/* ===================== INCIDENTS OVER TIME ===================== */
function IncidentsOverTime() {
  return (
    <div className="bg-surface-container border border-outline-variant p-[24px] relative overflow-hidden hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="font-jetbrains text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            Incidents Over Time
          </h3>
          <p className="text-xs text-on-surface-variant opacity-60">Cumulative volume by severity</p>
        </div>
        <span className="material-symbols-outlined text-primary opacity-50">show_chart</span>
      </div>
      <div className="h-64 flex items-end justify-between space-x-1 relative">
        <div className="absolute inset-0 flex items-end">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
            <path d="M0 200 L50 160 L100 180 L150 140 L200 150 L250 100 L300 130 L350 90 L400 110 L400 200 Z" fill="rgba(239, 68, 68, 0.2)" />
            <path d="M0 200 L50 180 L100 190 L150 160 L200 170 L250 140 L300 150 L350 120 L400 130 L400 200 Z" fill="rgba(245, 158, 11, 0.2)" />
            <path d="M0 200 L50 195 L100 198 L150 190 L200 192 L250 180 L300 185 L350 175 L400 180 L400 200 Z" fill="rgba(120, 113, 108, 0.2)" />
            <polyline fill="none" points="0,200 50,160 100,180 150,140 200,150 250,100 300,130 350,90 400,110" stroke="#ef4444" strokeWidth="2" />
            <polyline fill="none" points="0,200 50,180 100,190 150,160 200,170 250,140 300,150 350,120 400,130" stroke="#f59e0b" strokeWidth="2" />
          </svg>
        </div>
        <div className="w-full h-full border-b border-l border-outline-variant"></div>
      </div>
      <div className="mt-4 flex space-x-4 text-[10px] font-jetbrains tracking-[0.15em] uppercase">
        <div className="flex items-center"><span className="w-2 h-2 bg-red-500 mr-2"></span> P1 CRITICAL</div>
        <div className="flex items-center"><span className="w-2 h-2 bg-amber-500 mr-2"></span> P2 WARNING</div>
        <div className="flex items-center"><span className="w-2 h-2 bg-stone-500 mr-2"></span> P3 INFO</div>
      </div>
    </div>
  )
}

/* ===================== MTTR DISTRIBUTION ===================== */
function MTTRDistribution() {
  const bars = [
    { height: '20%', color: 'from-primary/40 to-primary' },
    { height: '45%', color: 'from-primary/40 to-primary' },
    { height: '85%', color: 'from-primary/40 to-primary' },
    { height: '60%', color: 'from-amber-500/40 to-amber-500' },
    { height: '30%', color: 'from-amber-500/40 to-amber-500' },
    { height: '15%', color: 'from-red-500/40 to-red-500' },
    { height: '8%', color: 'from-red-500/40 to-red-500' },
  ]
  const labels = ['0-15M', '15-30M', '30-60M', '1-2H', '2-4H', '4-12H', '12H+']

  return (
    <div className="bg-surface-container border border-outline-variant p-[24px] relative hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="font-jetbrains text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            MTTR Distribution
          </h3>
          <p className="text-xs text-on-surface-variant opacity-60">Frequency across resolution buckets</p>
        </div>
        <span className="material-symbols-outlined text-primary opacity-50">bar_chart</span>
      </div>
      <div className="h-64 flex items-end justify-between space-x-3 border-b border-l border-outline-variant pt-4 px-2">
        {bars.map((bar, i) => (
          <div
            key={i}
            className={`flex-1 bg-gradient-to-t ${bar.color} relative group`}
            style={{ height: bar.height }}
          ></div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-[10px] font-jetbrains tracking-[0.15em] uppercase text-on-surface-variant opacity-60">
        {labels.map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  )
}

/* ===================== AGENT CONFIDENCE TREND ===================== */
function AgentConfidenceTrend() {
  return (
    <div className="bg-surface-container border border-outline-variant p-[24px] hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="font-jetbrains text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            Agent Confidence Trend
          </h3>
          <p className="text-xs text-on-surface-variant opacity-60">Mean average precision by agent type</p>
        </div>
        <div className="flex space-x-1">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span className="w-2 h-2 rounded-full bg-tertiary"></span>
        </div>
      </div>
      <div className="h-64 relative border-b border-l border-outline-variant">
        <svg className="w-full h-full px-2" preserveAspectRatio="none" viewBox="0 0 400 200">
          <polyline fill="none" points="0,50 80,45 160,35 240,40 320,25 400,20" stroke="#4cd7f6" strokeWidth="2" />
          <polyline fill="none" points="0,100 80,95 160,80 240,85 320,70 400,75" stroke="#5de6ff" strokeWidth="2" />
          <polyline fill="none" points="0,150 80,140 160,155 240,145 320,160 400,150" stroke="#54d8e8" strokeWidth="2" />
        </svg>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] font-jetbrains tracking-[0.15em] uppercase">
        <div className="flex items-center"><span className="w-2 h-1 bg-primary mr-2"></span> HISTORIAN</div>
        <div className="flex items-center"><span className="w-2 h-1 bg-secondary mr-2"></span> EXPERT</div>
        <div className="flex items-center"><span className="w-2 h-1 bg-tertiary mr-2"></span> RISK</div>
        <div className="flex items-center"><span className="w-2 h-1 bg-white/20 mr-2"></span> PLANNER</div>
      </div>
    </div>
  )
}

/* ===================== ROOT CAUSE BREAKDOWN ===================== */
function RootCauseBreakdown({ data }) {
  const total = data?.total || 0
  const causes = data?.causes || []
  return (
    <div className="bg-surface-container border border-outline-variant p-[24px] hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="font-jetbrains text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            Root Cause Breakdown
          </h3>
          <p className="text-xs text-on-surface-variant opacity-60">Identified failure patterns</p>
        </div>
      </div>
      <div className="h-64 flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#2e2a24" strokeWidth="4" />
            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#4cd7f6" strokeDasharray="45 100" strokeDashoffset="0" strokeWidth="4" />
            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#06b6d4" strokeDasharray="25 100" strokeDashoffset="-45" strokeWidth="4" />
            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#004e5c" strokeDasharray="20 100" strokeDashoffset="-70" strokeWidth="4" />
            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#3d494c" strokeDasharray="10 100" strokeDashoffset="-90" strokeWidth="4" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-inter text-lg font-bold text-on-surface">{total}</span>
            <span className="font-jetbrains text-[9px] opacity-60 tracking-[0.15em] uppercase">TOTAL INCIDENTS</span>
          </div>
        </div>
        <div className="ml-8 space-y-3 font-jetbrains text-[10px] tracking-[0.15em] uppercase">
          {causes.length > 0 ? causes.map((c, i) => {
            const colors = ['bg-[#4cd7f6]', 'bg-[#06b6d4]', 'bg-[#004e5c]', 'bg-[#3d494c]', 'bg-outline-variant']
            return (
              <div key={i} className="flex items-center"><span className={`w-3 h-3 rounded-full ${colors[i] || colors[4]} mr-3`}></span> {c.name} ({c.percentage}%)</div>
            )
          }) : (
            <>
              <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#4cd7f6] mr-3"></span> MEMORY LEAKS (45%)</div>
              <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#06b6d4] mr-3"></span> CONN POOLS (25%)</div>
              <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#004e5c] mr-3"></span> LATENCY (20%)</div>
              <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#3d494c] mr-3"></span> OTHER (10%)</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ===================== KNOWLEDGE GROWTH ===================== */
function KnowledgeGrowth({ analytics }) {
  const patternsCount = analytics?.knowledge_preserved ? `${(analytics.knowledge_preserved / 1000 * 24.8).toFixed(1)}k` : '12.4k'
  return (
    <div className="lg:col-span-1 bg-surface-container border border-outline-variant p-[24px] hover:border-primary/50 transition-colors">
      <h3 className="font-jetbrains text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">
        Knowledge Growth
      </h3>
      <div className="h-48 border-b border-l border-outline-variant relative">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 100">
          <path d="M0,100 Q50,90 100,60 T200,10" fill="none" stroke="#4cd7f6" strokeWidth="2" />
          <circle cx="200" cy="10" fill="#4cd7f6" r="3" />
        </svg>
        <div className="absolute top-2 right-2 text-right">
          <p className="font-inter text-2xl font-bold text-primary">{patternsCount}</p>
          <p className="font-jetbrains text-[10px] opacity-60 tracking-[0.15em] uppercase">PATTERNS CAPTURED</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-outline-variant flex justify-between items-center">
        <span className="font-jetbrains text-[10px] text-on-surface-variant tracking-[0.15em] uppercase">
          +12% vs last month
        </span>
        <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
      </div>
    </div>
  )
}

/* ===================== SERVICE HEATMAP ===================== */
function ServiceHeatmap({ data }) {
  const services = data?.services || []
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  const maxCount = Math.max(...services.map(s => parseInt(s.count || 0)), 1)

  return (
    <div className="lg:col-span-2 bg-surface-container border border-outline-variant p-[24px] hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-jetbrains text-sm font-bold uppercase tracking-widest text-on-surface-variant">
          Service Heatmap
        </h3>
        <div className="flex items-center space-x-2 text-[10px] font-jetbrains tracking-[0.15em] uppercase">
          <span>LOW</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-primary/10"></div>
            <div className="w-3 h-3 bg-primary/30"></div>
            <div className="w-3 h-3 bg-primary/60"></div>
            <div className="w-3 h-3 bg-primary"></div>
          </div>
          <span>HIGH</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="font-jetbrains text-[9px] text-on-surface-variant tracking-[0.15em] uppercase">
              <th className="py-2 px-1">SERVICE / DAY</th>
              {days.map((d) => <th key={d} className="py-2 px-1">{d}</th>)}
            </tr>
          </thead>
          <tbody className="font-jetbrains text-[10px]">
            {services.map((svc) => {
              const name = svc.service || svc.name || 'unknown'
              const count = parseInt(svc.count || 0)
              const intensity = count / maxCount
              return (
                <tr key={name}>
                  <td className="py-1.5 px-1 font-semibold uppercase text-on-surface">{name}</td>
                  {days.map((_, i) => (
                    <td key={i} className="p-1">
                      <div
                        className="h-6 w-full"
                        style={{ backgroundColor: `rgba(76, 215, 246, ${(intensity * (0.3 + Math.random() * 0.7)).toFixed(2)})` }}
                      ></div>
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ===================== AGENT PERFORMANCE TABLE ===================== */
function AgentPerformanceTable({ analytics }) {
  const agentData = analytics?.agents || {}
  const agents = [
    { name: 'OpsHistorian_v2', sub: 'PATTERN RECOGNITION', executions: agentData.historian?.executions || 1248, confidence: agentData.historian?.avg_confidence || 94.2, successRate: `${agentData.historian?.success_rate || 99.1}%`, successColor: 'primary', dotColor: 'bg-primary', sparkline: '0,15 20,12 40,18 60,8 80,5 100,2', sparkColor: '#4cd7f6' },
    { name: 'ExpertAnalysis_v4', sub: 'ROOT CAUSE ENGINE', executions: agentData.expert_twin?.executions || 856, confidence: agentData.expert_twin?.avg_confidence || 88.5, successRate: `${agentData.expert_twin?.success_rate || 96.4}%`, successColor: 'primary', dotColor: 'bg-primary', sparkline: '0,5 20,8 40,2 60,15 80,12 100,10', sparkColor: '#4cd7f6' },
    { name: 'RiskGuard_v1', sub: 'PREDICTIVE ANOMALY', executions: agentData.risk_agent?.executions || 412, confidence: agentData.risk_agent?.avg_confidence || 72.1, successRate: `${agentData.risk_agent?.success_rate || 88.9}%`, successColor: 'amber-500', dotColor: 'bg-amber-500', sparkline: '0,18 20,15 40,12 60,14 80,18 100,20', sparkColor: '#f59e0b' },
  ]

  return (
    <section className="bg-surface-container border border-outline-variant overflow-hidden hover:border-primary/50 transition-colors">
      <div className="px-[24px] py-4 border-b border-outline-variant bg-surface-container-high flex justify-between items-center">
        <h3 className="font-jetbrains text-sm font-bold uppercase tracking-widest text-on-surface-variant">
          Agent Performance Matrix
        </h3>
        <span className="text-xs text-on-surface-variant font-jetbrains">Showing 3/4 active nodes</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low font-jetbrains text-[11px] text-on-surface-variant tracking-[0.15em] uppercase">
            <tr>
              <th className="px-6 py-4">AGENT NODE</th>
              <th className="px-6 py-4 text-center">EXECUTIONS (24H)</th>
              <th className="px-6 py-4">AVG CONFIDENCE</th>
              <th className="px-6 py-4">SUCCESS RATE</th>
              <th className="px-6 py-4">TREND (7D)</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30 font-jetbrains text-[13px]">
            {agents.map((agent) => (
              <tr key={agent.name} className="hover:bg-surface-container-highest transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className={`status-pulse ${agent.dotColor}`}></span>
                    <div>
                      <p className="font-bold text-sm text-on-surface">{agent.name}</p>
                      <p className="text-[10px] opacity-50">{agent.sub}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-lg font-bold text-on-surface">{typeof agent.executions === 'number' ? agent.executions.toLocaleString() : agent.executions}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${agent.successColor}`}
                        style={{ width: `${agent.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-on-surface">{agent.confidence}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 bg-${agent.successColor}/10 text-${agent.successColor} border border-${agent.successColor}/20 text-[10px] font-bold`}>
                    {agent.successRate}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-24 h-6">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                      <polyline fill="none" points={agent.sparkline} stroke={agent.sparkColor} strokeWidth="1.5" />
                    </svg>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="material-symbols-outlined text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    open_in_new
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/* ===================== FOOTER ===================== */
function AnalyticsFooter() {
  return (
    <footer className="mt-auto flex justify-between items-center px-[24px] py-3 text-[14px] font-jetbrains tracking-[0.15em] uppercase bg-surface-container-lowest border-t border-outline-variant">
      <div className="flex items-center space-x-4">
        <span className="text-on-surface-variant text-[11px]">© 2025 OpsTwin AI • System Status: Operational</span>
        <span className="w-2 h-2 rounded-full bg-primary photonic-glow"></span>
      </div>
      <div className="flex items-center space-x-6">
        <a className="text-on-surface-variant hover:text-secondary transition-opacity duration-150 text-[11px]" href="#">Documentation</a>
        <a className="text-on-surface-variant hover:text-secondary transition-opacity duration-150 text-[11px]" href="#">API Support</a>
      </div>
    </footer>
  )
}
