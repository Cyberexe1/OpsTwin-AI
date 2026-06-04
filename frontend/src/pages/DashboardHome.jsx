export default function DashboardHome() {
  return (
    <div className="p-[24px] space-y-[24px] max-w-[1600px] mx-auto w-full">
      <PageTitle />
      <KPICards />
      <ChartsRow />
      <BottomRow />
      <DashboardFooter />
    </div>
  )
}

function PageTitle() {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h1 className="font-inter text-[40px] font-bold text-on-surface leading-[1.2]">Dashboard Overview</h1>
        <p className="text-on-surface-variant mt-1">Real-time performance metrics and agentic health status.</p>
      </div>
      <div className="flex gap-3">
        <button className="px-4 py-2 border border-outline-variant/30 text-on-surface hover:bg-surface-variant/50 flex items-center gap-2 transition-all">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span className="font-jetbrains text-[14px] font-medium tracking-[0.15em] uppercase">Last 24 Hours</span>
        </button>
        <button className="px-6 py-2 bg-primary text-background font-bold hover:bg-secondary flex items-center gap-2 transition-all glow-cyan">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
          <span className="font-jetbrains text-[14px] font-medium tracking-[0.15em] uppercase">New Investigation</span>
        </button>
      </div>
    </div>
  )
}

function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
      <KPICard label="MTTR Reduction" value="-47%" sub="↓ Improvement" icon="speed" color="primary" barWidth="47%" />
      <KPICard label="Knowledge Preserved" value="500" sub="Artifacts" icon="memory" color="secondary" segmented />
      <KPICard label="Expert Twins" value="4" sub="Active Agents" icon="hub" color="[#A855F7]" capacity />
      <KPICard label="Avg Confidence" value="87%" sub="Global Score" icon="verified" color="[#F59E0B]" barWidth="87%" />
    </div>
  )
}

function KPICard({ label, value, sub, icon, color, barWidth, segmented, capacity }) {
  return (
    <div className="bg-surface-container border border-outline-variant/30 p-6 rounded relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <span className="font-jetbrains text-[14px] font-medium tracking-[0.2em] text-outline uppercase">{label}</span>
        <span className={`material-symbols-outlined text-${color}`}>{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-4xl font-bold ${color === 'primary' ? `text-${color}` : 'text-on-surface'}`}>{value}</span>
        <span className={`text-xs text-${color} font-medium`}>{sub}</span>
      </div>
      {barWidth && (
        <div className="mt-4 h-1 w-full bg-outline-variant/20 rounded-full overflow-hidden">
          <div className={`h-full bg-${color}`} style={{ width: barWidth }}></div>
        </div>
      )}
      {segmented && (
        <div className="mt-4 flex gap-1">
          <div className="h-1 flex-1 bg-secondary"></div>
          <div className="h-1 flex-1 bg-secondary"></div>
          <div className="h-1 flex-1 bg-secondary"></div>
          <div className="h-1 flex-1 bg-outline-variant/20"></div>
        </div>
      )}
      {capacity && (
        <div className="mt-4 flex items-center justify-between text-[10px] text-outline font-jetbrains">
          <span>CAPACITY: 80%</span>
          <span className="text-[#A855F7]">OPTIMAL</span>
        </div>
      )}
      <div className={`absolute inset-0 bg-${color}/5 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
    </div>
  )
}

function ChartsRow() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
      {/* MTTR Trend */}
      <div className="bg-surface-container border border-outline-variant/30 p-6 rounded">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="font-inter text-[24px] font-semibold text-on-surface leading-[1.4]">MTTR Trend</h3>
            <p className="text-sm text-outline">Comparison: Manual vs. Agentic Workflow</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-error/50 border border-error"></span><span className="text-[12px] text-outline">Before</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary/50 border border-primary"></span><span className="text-[12px] text-outline">After</span></div>
          </div>
        </div>
        <div className="h-[240px] w-full relative">
          <div className="absolute inset-0 grid grid-cols-6 border-b border-l border-outline-variant/20">
            {[...Array(5)].map((_, i) => <div key={i} className="border-r border-outline-variant/5"></div>)}
          </div>
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 600 240" preserveAspectRatio="none">
            <path d="M 0 40 L 100 60 L 200 50 L 300 80 L 400 70 L 500 90 L 600 85" fill="none" stroke="#ffb4ab" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d="M 0 200 L 100 180 L 200 150 L 300 120 L 400 90 L 500 60 L 600 50" fill="none" stroke="#06B6D4" strokeWidth="3" vectorEffect="non-scaling-stroke" style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.4))' }} />
          </svg>
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-outline font-jetbrains">
            <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
          </div>
        </div>
      </div>
      {/* Agent Executions */}
      <div className="bg-surface-container border border-outline-variant/30 p-6 rounded">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="font-inter text-[24px] font-semibold text-on-surface leading-[1.4]">Agent Executions</h3>
            <p className="text-sm text-outline">Task distribution across agent clusters</p>
          </div>
          <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">more_horiz</span>
        </div>
        <div className="flex items-end justify-between h-[240px] px-4 gap-6">
          <AgentBar label="HISTORIAN" height="85%" color="#4cd7f6" requests="842" />
          <AgentBar label="EXPERT" height="60%" color="#A855F7" requests="512" />
          <AgentBar label="RISK" height="35%" color="#F59E0B" requests="219" />
          <AgentBar label="PLANNER" height="75%" color="#21b7c7" requests="690" />
        </div>
      </div>
    </div>
  )
}

function AgentBar({ label, height, color, requests }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-3">
      <div className="w-full rounded-t-sm relative group" style={{ height, backgroundColor: `${color}33`, borderTop: `2px solid ${color}` }}>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-high border border-outline-variant px-2 py-1 text-[10px] whitespace-nowrap text-on-surface">
          {requests} reqs
        </div>
      </div>
      <span className="text-[10px] text-outline font-jetbrains">{label}</span>
    </div>
  )
}

function BottomRow() {
  const investigations = [
    { id: '#OT-9842', service: 'auth-gateway-v2', severity: 'P1', confidence: '94%', status: 'In Progress', statusDot: 'bg-primary', time: '2m ago' },
    { id: '#OT-9840', service: 'payment-processor', severity: 'P2', confidence: '81%', status: 'Analyzing', statusDot: 'bg-outline', time: '14m ago' },
    { id: '#OT-9838', service: 'redis-cache-main', severity: 'P3', confidence: '99%', status: 'Resolved', statusIcon: true, time: '1h ago' },
    { id: '#OT-9837', service: 'kubernetes-node-04', severity: 'P2', confidence: '74%', status: 'Resolved', statusIcon: true, time: '2h ago' },
  ]
  const severityStyles = { P1: 'bg-error-container/20 text-error border-error/30', P2: 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30', P3: 'bg-outline-variant/30 text-outline border-outline-variant/50' }
  const systemHealth = ['Splunk MCP', 'Hosted Models', 'Qdrant Vector DB', 'Neo4j Graph', 'LangGraph SDK', 'PostgreSQL']

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-[24px]">
      <div className="xl:col-span-2 bg-surface-container border border-outline-variant/30 rounded flex flex-col">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
          <h3 className="font-inter text-[24px] font-semibold text-on-surface leading-[1.4]">Recent Investigations</h3>
          <a className="text-primary text-sm font-medium hover:underline" href="/dashboard/history">View All History</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20">
                {['ID', 'Service', 'Severity', 'Confidence', 'Status', 'Time'].map(h => (
                  <th key={h} className="p-4 font-jetbrains text-[11px] font-medium tracking-[0.15em] text-outline uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {investigations.map((inv) => (
                <tr key={inv.id} className="border-b border-outline-variant/10 hover:bg-surface-variant/20 transition-colors">
                  <td className="p-4 font-jetbrains text-[13px] text-primary">{inv.id}</td>
                  <td className="p-4 text-[16px] text-on-surface">{inv.service}</td>
                  <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${severityStyles[inv.severity]}`}>{inv.severity}</span></td>
                  <td className="p-4 text-[16px] text-on-surface">{inv.confidence}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {inv.statusIcon ? <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span> : <span className={`w-2 h-2 rounded-full ${inv.statusDot}`}></span>}
                      <span className="text-sm text-on-surface">{inv.status}</span>
                    </div>
                  </td>
                  <td className="p-4 text-outline text-sm">{inv.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-surface-container border border-outline-variant/30 rounded flex flex-col">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
          <h3 className="font-inter text-[24px] font-semibold text-on-surface leading-[1.4]">System Health</h3>
          <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
        </div>
        <div className="p-6 space-y-4 flex-1">
          {systemHealth.map((service) => (
            <div key={service} className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant/20 rounded">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot"></span>
                <span className="text-[16px] text-on-surface">{service}</span>
              </div>
              <span className="font-jetbrains text-[11px] text-primary">ONLINE</span>
            </div>
          ))}
        </div>
        <div className="p-4 bg-primary/5 border-t border-primary/20 text-center">
          <span className="text-[11px] font-medium text-primary uppercase tracking-widest">Global Status: Operational</span>
        </div>
      </div>
    </div>
  )
}

function DashboardFooter() {
  return (
    <footer className="mt-8 px-0 py-8 border-t border-outline-variant/20 bg-surface-container-lowest -mx-[24px] px-[24px]">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-outline">© 2025 OpsTwin AI. All rights reserved. Built for Agentic Intelligence.</p>
        <div className="flex gap-6">
          {['Hackathon Credits', 'Documentation', 'Privacy Policy', 'Contact Support'].map(link => (
            <a key={link} className="text-sm text-outline hover:text-primary transition-all underline decoration-outline-variant/50 underline-offset-4" href="#">{link}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
