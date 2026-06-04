import { useState } from 'react'

const investigations = [
  { id: '#INC-8812-X', service: 'auth-gateway', impact: 'Critical', impactStyle: 'bg-error-container/20 text-error border-error/30', dotColor: 'bg-error', confidence: '98.2%', status: 'Resolved', statusIcon: 'check_circle', statusColor: 'text-tertiary', duration: '12m 45s', pulse: true },
  { id: '#INC-9004-A', service: 'db-sharding-01', impact: 'Medium', impactStyle: 'bg-tertiary-container/10 text-tertiary border-tertiary/30', dotColor: 'bg-tertiary', confidence: '74.5%', status: 'Active', statusIcon: 'sync', statusColor: 'text-on-surface-variant italic', duration: '03h 12m', spin: true },
  { id: '#INC-7721-P', service: 'payment-svc', impact: 'High', impactStyle: 'bg-secondary-container/10 text-secondary border-secondary/30', dotColor: 'bg-secondary', confidence: '91.0%', status: 'Resolved', statusIcon: 'check_circle', statusColor: 'text-tertiary', duration: '24m 10s' },
  { id: '#INC-6650-L', service: 'search-indexer', impact: 'Low', impactStyle: 'bg-tertiary-container/10 text-tertiary border-tertiary/30', dotColor: 'bg-tertiary', confidence: '99.9%', status: 'Resolved', statusIcon: 'check_circle', statusColor: 'text-tertiary', duration: '05m 12s' },
  { id: '#INC-5512-B', service: 'api-ingress', impact: 'High', impactStyle: 'bg-secondary-container/10 text-secondary border-secondary/30', dotColor: 'bg-secondary', confidence: '82.3%', status: 'Resolved', statusIcon: 'check_circle', statusColor: 'text-tertiary', duration: '45m 22s' },
]

const logLines = [
  { time: '[14:02:11]', label: 'SYS_EVENT:', labelColor: 'text-on-surface', text: '5xx Spike detected on auth-gateway. Threshold exceeded (22.5%).' },
  { time: '[14:02:13]', label: 'AGENT_INIT:', labelColor: 'text-secondary', text: 'OpsTwin-Historian initialized for deep-trace analysis.' },
  { time: '[14:02:45]', label: 'SCANNING:', labelColor: 'text-secondary', text: 'Scraping log metrics from Prometheus Node Exporter...' },
  { time: '[14:03:12]', label: 'CORRELATION:', labelColor: 'text-secondary', text: 'Deployment #D-9982 (13:58:00) identified as likely cause.' },
  { time: '[14:04:01]', label: 'ERROR:', labelColor: 'text-error', text: 'Auto-rollback failed. Manual intervention requested... Overridden by Expert-Agent-Alpha.' },
  { time: '[14:04:22]', label: 'RESOLUTION:', labelColor: 'text-on-surface', text: 'Rollback successful. Service health returning to nominal.' },
]

export default function HistoryPage() {
  const [selectedRow, setSelectedRow] = useState(0)
  const [activeTab, setActiveTab] = useState('logs')

  return (
    <>
      <div className="flex-1 p-[24px] grid grid-cols-12 gap-[24px] max-w-[1600px] mx-auto w-full mb-12">
          {/* Filter Bar */}
          <FilterBar />

          {/* Table */}
          <div className="col-span-12 lg:col-span-7 flex flex-col bg-surface border border-outline-variant rounded-xl overflow-hidden">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center">
              <h2 className="font-inter text-[24px] font-semibold text-on-surface leading-[1.4]">Archive Explorer</h2>
              <span className="font-jetbrains text-[12px] tracking-[0.15em] text-on-surface-variant uppercase">2,482 total records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant text-left">
                    <th className="p-4 font-jetbrains text-[12px] tracking-[0.15em] text-on-surface-variant uppercase">Investigation ID</th>
                    <th className="p-4 font-jetbrains text-[12px] tracking-[0.15em] text-on-surface-variant uppercase">Service</th>
                    <th className="p-4 font-jetbrains text-[12px] tracking-[0.15em] text-on-surface-variant uppercase">Impact</th>
                    <th className="p-4 font-jetbrains text-[12px] tracking-[0.15em] text-on-surface-variant uppercase">Conf %</th>
                    <th className="p-4 font-jetbrains text-[12px] tracking-[0.15em] text-on-surface-variant uppercase">Status</th>
                    <th className="p-4 font-jetbrains text-[12px] tracking-[0.15em] text-on-surface-variant uppercase">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {investigations.map((inv, i) => (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedRow(i)}
                      className={`hover:bg-surface-container-high transition-colors cursor-pointer ${selectedRow === i ? 'bg-primary/5' : ''}`}
                    >
                      <td className="p-4 font-jetbrains text-[13px] text-primary">{inv.id}</td>
                      <td className="p-4 text-[16px] text-on-surface">{inv.service}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold uppercase flex items-center w-fit ${inv.impactStyle}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${inv.dotColor} mr-2 ${inv.pulse ? 'animate-pulse' : ''}`}></span>
                          {inv.impact}
                        </span>
                      </td>
                      <td className="p-4 font-jetbrains text-[13px] text-on-surface">{inv.confidence}</td>
                      <td className="p-4">
                        <span className={`flex items-center text-sm ${inv.statusColor}`}>
                          <span className={`material-symbols-outlined mr-1 text-base ${inv.spin ? 'animate-spin' : ''}`}>{inv.statusIcon}</span>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4 text-on-surface-variant text-sm">{inv.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="p-4 bg-surface-container-low border-t border-outline-variant flex justify-between items-center mt-auto">
              <button className="px-3 py-1 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container-highest transition-colors font-jetbrains text-[12px] tracking-[0.15em] uppercase">Previous</button>
              <div className="flex gap-2">
                <span className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary rounded font-jetbrains text-[13px]">1</span>
                <span className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-highest rounded font-jetbrains text-[13px] cursor-pointer text-on-surface-variant">2</span>
                <span className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-highest rounded font-jetbrains text-[13px] cursor-pointer text-on-surface-variant">3</span>
              </div>
              <button className="px-3 py-1 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container-highest transition-colors font-jetbrains text-[12px] tracking-[0.15em] uppercase">Next</button>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-[24px]">
            {/* Inspector Header */}
            <div className="bg-surface border border-outline-variant rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-8xl text-on-surface">terminal</span>
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-jetbrains text-[12px] tracking-[0.15em] text-secondary uppercase mb-1">SELECTED INVESTIGATION</p>
                  <h3 className="font-inter text-[24px] font-semibold text-on-surface leading-[1.4]">
                    {investigations[selectedRow].id}
                  </h3>
                </div>
                <span className="text-tertiary px-3 py-1 border border-tertiary/20 bg-tertiary/10 rounded-full font-jetbrains text-[10px] tracking-[0.15em] uppercase">
                  VERIFIED SOLUTION
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-background border border-outline-variant rounded">
                  <p className="font-jetbrains text-[10px] tracking-[0.15em] text-on-surface-variant uppercase">TIMELINE</p>
                  <p className="text-on-surface font-jetbrains text-[13px] mt-1">12 Oct 14:02:11</p>
                </div>
                <div className="p-3 bg-background border border-outline-variant rounded">
                  <p className="font-jetbrains text-[10px] tracking-[0.15em] text-on-surface-variant uppercase">PRIMARY AGENT</p>
                  <p className="text-on-surface font-jetbrains text-[13px] mt-1">OpsTwin-Historian-9</p>
                </div>
              </div>
            </div>

            {/* Tabs + Log Viewer */}
            <div className="bg-surface border border-outline-variant rounded-xl flex-1 flex flex-col overflow-hidden">
              <div className="flex bg-surface-container border-b border-outline-variant">
                {['logs', 'findings', 'expert', 'resolution'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 font-jetbrains text-[12px] tracking-[0.15em] uppercase ${
                      activeTab === tab
                        ? 'border-b-2 border-primary text-primary bg-background'
                        : 'text-on-surface-variant hover:text-on-surface transition-colors'
                    }`}
                  >
                    {tab === 'expert' ? 'Expert Reasoning' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="p-4 bg-background flex-1 font-jetbrains text-[13px] text-on-surface-variant custom-scrollbar overflow-y-auto leading-relaxed">
                <div className="space-y-3">
                  {logLines.map((line, i) => (
                    <div key={i}>
                      <span className="text-primary">{line.time}</span>{' '}
                      <span className={line.labelColor}>{line.label}</span>{' '}
                      {line.text}
                    </div>
                  ))}
                  {/* Analysis block */}
                  <div className="pl-4 border-l border-outline-variant py-2 bg-surface-container-low/30 my-2">
                    <span className="text-tertiary">ANALYSIS:</span> Memory pressure identified in pod 'auth-v2-7f9b8'. Swapping detected. Latency increased to 450ms.
                  </div>
                  {/* Cursor */}
                  <div className="flex items-center gap-2">
                    <span className="text-primary">[14:04:30]</span>
                    <span className="terminal-cursor"></span>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3">
                <button className="px-4 py-2 bg-surface-container-highest border border-outline-variant text-on-surface font-jetbrains text-[11px] tracking-[0.15em] uppercase rounded hover:bg-outline-variant transition-colors">
                  Download Artifacts
                </button>
                <button className="px-4 py-2 bg-primary text-on-primary font-jetbrains text-[11px] tracking-[0.15em] uppercase rounded photonic-glow hover:bg-secondary transition-colors">
                  Open Full Report
                </button>
              </div>
            </div>
          </div>
        </div>

        <HistoryFooter />
    </>
  )
}

/* ===================== FILTER BAR ===================== */
function FilterBar() {
  const filters = [
    { label: 'Service Node', options: ['All Services', 'auth-api-v2', 'payment-gateway', 'cdn-edge-nodes'] },
    { label: 'Status', options: ['All States', 'Resolved', 'Active', 'Failed'] },
    { label: 'Severity', options: ['All Levels', 'Critical', 'High', 'Medium'] },
  ]

  return (
    <div className="col-span-12 flex flex-col md:flex-row items-end gap-[16px] bg-surface-container p-4 border border-outline-variant rounded-xl">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        {filters.map((f) => (
          <div key={f.label} className="flex flex-col gap-2">
            <label className="font-jetbrains text-[12px] tracking-[0.15em] text-on-surface-variant uppercase">{f.label}</label>
            <select className="bg-background border border-outline-variant text-on-surface text-[16px] rounded py-2 px-3 focus:border-primary outline-none">
              {f.options.map((opt) => <option key={opt}>{opt}</option>)}
            </select>
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <label className="font-jetbrains text-[12px] tracking-[0.15em] text-on-surface-variant uppercase">Date Range</label>
          <button className="bg-background border border-outline-variant text-on-surface text-[16px] rounded py-2 px-3 flex justify-between items-center hover:border-outline transition-colors">
            Last 30 Days
            <span className="material-symbols-outlined text-sm">calendar_today</span>
          </button>
        </div>
      </div>
      <button className="bg-surface-container-highest border border-outline-variant text-on-surface font-jetbrains text-[14px] tracking-[0.15em] uppercase px-6 py-2.5 rounded hover:bg-outline-variant transition-colors flex items-center">
        <span className="material-symbols-outlined mr-2">filter_list</span>
        Apply Filters
      </button>
    </div>
  )
}

/* ===================== SIDEBAR ===================== */
function HistorySidebar({ user }) {
  const navItems = [
    { id: 'home', icon: 'home', label: 'Home', href: '/dashboard' },
    { id: 'investigate', icon: 'query_stats', label: 'Investigate' },
    { id: 'knowledge', icon: 'auto_awesome_motion', label: 'Knowledge', href: '/dashboard/knowledge' },
    { id: 'analytics', icon: 'monitoring', label: 'Analytics', href: '/dashboard/analytics' },
    { id: 'history', icon: 'history', label: 'History', active: true },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ]

  return (
    <aside className="w-64 flex-shrink-0 bg-surface border-r border-outline-variant flex flex-col py-[16px] h-screen sticky top-0 z-50">
      <div className="px-6 mb-[32px]">
        <div className="font-inter text-[24px] font-bold text-primary leading-[1.4] tracking-tight">OpsTwin AI</div>
        <div className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant mt-1 uppercase">Precision Operations</div>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href || '#'}
            className={`flex items-center px-6 py-3 transition-colors ${
              item.active
                ? 'text-primary font-bold border-r-2 border-primary'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined mr-3">{item.icon}</span>
            <span className="text-[16px]">{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="px-4 mt-auto">
        <button className="w-full bg-primary-container text-on-primary-container font-jetbrains text-[14px] tracking-[0.15em] uppercase py-3 rounded-lg flex items-center justify-center photonic-glow hover:bg-secondary-container transition-all active:scale-95">
          <span className="material-symbols-outlined mr-2">add_circle</span>
          New Investigation
        </button>
        <div className="mt-[32px] p-3 bg-surface-container rounded flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-outline-variant bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-[12px]">{user.avatar}</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-on-surface truncate">{user.name}</p>
            <p className="font-jetbrains text-[10px] text-on-surface-variant uppercase tracking-wider">Senior Operator</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

/* ===================== HEADER ===================== */
function HistoryHeader() {
  return (
    <header className="flex justify-between items-center w-full px-[24px] h-16 bg-surface border-b border-outline-variant sticky top-0 z-40">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            className="w-full bg-background border border-outline-variant rounded py-1.5 pl-10 pr-4 font-jetbrains text-[13px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
            placeholder="Search investigation archives..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 ml-[24px] text-on-surface-variant">
        <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">notifications</span></button>
        <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">help</span></button>
        <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">account_circle</span></button>
      </div>
    </header>
  )
}

/* ===================== FOOTER ===================== */
function HistoryFooter() {
  return (
    <footer className="mt-auto flex justify-between items-center px-[24px] py-3 font-jetbrains text-[14px] tracking-[0.15em] uppercase bg-surface-container-lowest border-t border-outline-variant">
      <div className="text-on-surface-variant text-[11px]">© 2025 OpsTwin AI • System Status: Operational</div>
      <div className="flex gap-6">
        <a className="text-on-surface-variant hover:text-secondary transition-opacity text-[11px]" href="#">Documentation</a>
        <a className="text-on-surface-variant hover:text-secondary transition-opacity text-[11px]" href="#">API Support</a>
      </div>
    </footer>
  )
}
