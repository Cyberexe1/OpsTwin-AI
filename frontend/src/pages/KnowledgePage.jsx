import { useState, useEffect } from 'react'
import { getUser } from '../lib/auth'
import { getExperts } from '../lib/api'

const fallbackExperts = []

export default function KnowledgePage() {
  const user = getUser()
  const [selectedExpert, setSelectedExpert] = useState(null)
  const [experts, setExperts] = useState(fallbackExperts)

  useEffect(() => {
    getExperts()
      .then((data) => {
        if (data.experts && data.experts.length > 0) {
          setExperts(data.experts)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="relative">
      {/* Content */}
      <div className="px-[24px] py-6 max-w-[1400px] mx-auto w-full min-h-screen">
          {/* Page Header */}
          <header className="mb-[32px]">
            <div className="flex items-center gap-[8px] mb-2">
              <span className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-primary uppercase">
                System Overmind / Knowledge Management
              </span>
            </div>
            <h1 className="font-inter text-[40px] font-semibold text-on-surface leading-[1.2]">
              Operational Twin Repository
            </h1>
            <p className="text-on-surface-variant mt-2 max-w-2xl text-[16px] leading-[1.6]">
              Digital Operational Twins represent encoded institutional knowledge from your most
              experienced engineers, ready to orchestrate automated incident resolution.
            </p>
          </header>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px]">
            {/* Left: Expert Twin Cards */}
            <section className="lg:col-span-4 flex flex-col gap-[16px]">
              <h2 className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase">
                Active Expert Twins
              </h2>
              {experts.map((expert) => (
                <ExpertCard
                  key={expert.id}
                  expert={expert}
                  onClick={() => setSelectedExpert(expert)}
                />
              ))}
            </section>

            {/* Right: Knowledge Graph */}
            <section className="lg:col-span-8 flex flex-col gap-[16px] min-h-[600px]">
              <div className="flex justify-between items-center">
                <h2 className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase">
                  Neural Knowledge Graph
                </h2>
                <div className="flex gap-[8px]">
                  <span className="flex items-center gap-2 font-jetbrains text-[13px] text-on-surface-variant">
                    <span className="w-2 h-2 rounded-full bg-primary"></span> Expert
                  </span>
                  <span className="flex items-center gap-2 font-jetbrains text-[13px] text-on-surface-variant">
                    <span className="w-2 h-2 rounded-full bg-error"></span> Root Cause
                  </span>
                  <span className="flex items-center gap-2 font-jetbrains text-[13px] text-on-surface-variant">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span> Service
                  </span>
                </div>
              </div>

              <div className="flex-grow bg-surface-container-lowest border border-outline-variant relative overflow-hidden canvas-bg flex items-center justify-center">
                <KnowledgeGraph experts={experts} selectedExpert={selectedExpert} onSelectExpert={setSelectedExpert} />

                {/* Graph Controls */}
                <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-10">
                  <button className="bg-surface-container-high border border-outline-variant p-2 hover:bg-surface-variant transition-colors">
                    <span className="material-symbols-outlined text-on-surface">add</span>
                  </button>
                  <button className="bg-surface-container-high border border-outline-variant p-2 hover:bg-surface-variant transition-colors">
                    <span className="material-symbols-outlined text-on-surface">remove</span>
                  </button>
                  <button className="bg-surface-container-high border border-outline-variant p-2 hover:bg-surface-variant transition-colors">
                    <span className="material-symbols-outlined text-on-surface">center_focus_strong</span>
                  </button>
                </div>

                {/* Info Panel */}
                <div className="absolute top-6 right-6 z-10">
                  <div className="bg-surface-container/90 backdrop-blur-md border border-outline-variant px-4 py-3 text-[12px] font-jetbrains text-on-surface-variant space-y-1">
                    <div>Nodes: <span className="text-on-surface">{experts.length + 8 + 5}</span></div>
                    <div>Edges: <span className="text-on-surface">{experts.length * 4}</span></div>
                    <div>Status: <span className="text-primary">Live</span></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <KnowledgeFooter />

      <DetailPanel expert={selectedExpert} onClose={() => setSelectedExpert(null)} />
    </div>
  )
}

/* ===================== KNOWLEDGE GRAPH ===================== */
function KnowledgeGraph({ experts, selectedExpert, onSelectExpert }) {
  // Services derived from expert data
  const services = [...new Set(experts.flatMap(e => e.expertise || []).slice(0, 8))]
  const rootCauses = ['memory_leak', 'connection_pool', 'cpu_spike', 'disk_full', 'cert_expiry']

  // Expert positions (arranged in a circle around center)
  const centerX = 400, centerY = 300
  const expertPositions = experts.map((_, i) => {
    const angle = (i / experts.length) * 2 * Math.PI - Math.PI / 2
    const radius = 160
    return { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius }
  })

  // Service positions (outer ring)
  const servicePositions = services.slice(0, 6).map((_, i) => {
    const angle = (i / 6) * 2 * Math.PI - Math.PI / 4
    const radius = 260
    return { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius }
  })

  // Root cause positions (small outer nodes)
  const causePositions = rootCauses.map((_, i) => {
    const angle = (i / rootCauses.length) * 2 * Math.PI + Math.PI / 6
    const radius = 220
    return { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius }
  })

  return (
    <svg className="w-full h-full max-h-[700px] absolute inset-0 z-0" viewBox="0 0 800 600">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur result="blur" stdDeviation="3" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Connection lines: center → experts */}
      {expertPositions.map((pos, i) => (
        <line key={`ce-${i}`} x1={centerX} y1={centerY} x2={pos.x} y2={pos.y}
          stroke={selectedExpert?.id === experts[i]?.id ? '#4cd7f6' : '#3d494c'}
          strokeWidth={selectedExpert?.id === experts[i]?.id ? 2 : 0.5}
          opacity={0.6}
        />
      ))}

      {/* Connection lines: experts → services */}
      {expertPositions.map((ePos, ei) => (
        servicePositions.slice(0, 2).map((sPos, si) => (
          <line key={`es-${ei}-${si}`} x1={ePos.x} y1={ePos.y} x2={sPos.x} y2={sPos.y}
            stroke="#3d494c" strokeWidth="0.3" opacity="0.4"
          />
        ))
      ))}

      {/* Connection lines: experts → root causes */}
      {expertPositions.map((ePos, ei) => (
        causePositions.slice(ei, ei + 2).map((cPos, ci) => (
          <line key={`ec-${ei}-${ci}`} x1={ePos.x} y1={ePos.y} x2={cPos.x} y2={cPos.y}
            stroke="#3d494c" strokeWidth="0.3" opacity="0.3"
          />
        ))
      ))}

      {/* Central node */}
      <g className="cursor-pointer">
        <circle cx={centerX} cy={centerY} r={18} className="fill-primary node-pulse" filter="url(#glow)" opacity="0.3" />
        <circle cx={centerX} cy={centerY} r={10} fill="#4cd7f6" />
        <text x={centerX} y={centerY + 30} textAnchor="middle" fill="#4cd7f6" fontSize="11" fontFamily="JetBrains Mono">
          OPSTWIN_CORE
        </text>
      </g>

      {/* Expert nodes (dynamic from data) */}
      {experts.map((expert, i) => {
        const pos = expertPositions[i]
        if (!pos) return null
        const isSelected = selectedExpert?.id === expert.id
        const radius = 8 + (expert.incidents || 100) / 80
        return (
          <g key={expert.id} className="cursor-pointer" onClick={() => onSelectExpert(expert)}>
            <circle cx={pos.x} cy={pos.y} r={radius + 4} fill={isSelected ? '#4cd7f6' : 'transparent'} opacity="0.2" />
            <circle cx={pos.x} cy={pos.y} r={radius} fill={isSelected ? '#4cd7f6' : '#06b6d4'} opacity={isSelected ? 1 : 0.8} />
            <text x={pos.x} y={pos.y + radius + 14} textAnchor="middle" fill="#eae1da" fontSize="10" fontFamily="JetBrains Mono">
              {expert.name?.split(' ')[0] || expert.id}
            </text>
            <text x={pos.x} y={pos.y + radius + 26} textAnchor="middle" fill="#bcc9cd" fontSize="8" fontFamily="JetBrains Mono">
              {expert.incidents || '?'} incidents
            </text>
          </g>
        )
      })}

      {/* Service nodes */}
      {services.slice(0, 6).map((svc, i) => {
        const pos = servicePositions[i]
        if (!pos) return null
        return (
          <g key={`svc-${i}`}>
            <circle cx={pos.x} cy={pos.y} r={6} fill="#54d8e8" opacity="0.7" />
            <text x={pos.x} y={pos.y + 16} textAnchor="middle" fill="#bcc9cd" fontSize="8" fontFamily="JetBrains Mono">
              {svc.length > 12 ? svc.slice(0, 12) + '..' : svc}
            </text>
          </g>
        )
      })}

      {/* Root cause nodes */}
      {rootCauses.map((cause, i) => {
        const pos = causePositions[i]
        if (!pos) return null
        return (
          <g key={`rc-${i}`}>
            <circle cx={pos.x} cy={pos.y} r={5} fill="#ffb4ab" opacity="0.6" />
            <text x={pos.x} y={pos.y + 14} textAnchor="middle" fill="#bcc9cd" fontSize="7" fontFamily="JetBrains Mono">
              {cause.replace('_', ' ')}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ===================== EXPERT CARD ===================== */
function ExpertCard({ expert, onClick }) {
  const borderColor = `hover:border-${expert.color}`
  const textColor = `text-${expert.color}`
  const bgColor = `bg-${expert.color}`

  return (
    <div
      onClick={onClick}
      className="group p-[16px] bg-surface-container border border-outline-variant hover:border-primary transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex items-center gap-[16px] mb-[8px] relative z-10">
        <div className={`w-12 h-12 rounded-full border-2 border-${expert.color} flex items-center justify-center bg-surface-container-high`}>
          <span className={`${textColor} font-bold text-[14px]`}>{expert.avatar}</span>
        </div>
        <div>
          <h3 className="font-inter text-[18px] font-semibold text-on-surface">{expert.name}</h3>
          <p className={`font-jetbrains text-[13px] ${textColor}`}>{expert.role}</p>
        </div>
      </div>
      <div className="space-y-1 relative z-10">
        <div className="flex justify-between font-jetbrains text-[13px] text-on-surface-variant">
          <span>Model Confidence</span>
          <span className={textColor}>{expert.confidence}%</span>
        </div>
        <div className="w-full bg-surface-container-highest h-1">
          <div
            className={`${bgColor} h-full`}
            style={{ width: `${expert.confidence}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center mt-[8px]">
          <span className="text-[16px] text-on-surface">
            {expert.incidents}{' '}
            <span className="text-on-surface-variant text-[14px]">Incidents Solved</span>
          </span>
          <span className="material-symbols-outlined text-primary">chevron_right</span>
        </div>
      </div>
    </div>
  )
}

/* ===================== DETAIL PANEL ===================== */
function DetailPanel({ expert, onClose }) {
  if (!expert) return null

  const textColor = `text-${expert.color}`

  return (
    <aside
      className={`fixed right-0 top-0 h-full w-full md:w-[480px] bg-surface-container border-l border-outline-variant z-[60] transition-transform duration-500 ease-in-out shadow-2xl ${
        expert ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col p-[32px] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-start mb-[32px]">
          <div className="flex items-center gap-[16px]">
            <div className={`w-16 h-16 rounded-full border-2 border-${expert.color} flex items-center justify-center bg-surface-container-high`}>
              <span className={`${textColor} font-bold text-[20px]`}>{expert.avatar}</span>
            </div>
            <div>
              <h2 className="font-inter text-[24px] font-semibold text-on-surface leading-[1.4]">
                {expert.name}
              </h2>
              <span className={`font-jetbrains text-[13px] ${textColor} uppercase tracking-widest`}>
                {expert.role}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-variant rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface">close</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-[16px] mb-[32px]">
          <div className="p-[16px] bg-surface-container-low border border-outline-variant/30">
            <p className="font-jetbrains text-[13px] text-on-surface-variant mb-1">Avg MTTR</p>
            <p className="text-[32px] font-bold text-primary leading-tight">{expert.mttr || expert.avg_mttr || '—'}</p>
            <p className="text-[10px] text-primary/60 font-jetbrains">{expert.mttrDelta || ''}</p>
          </div>
          <div className="p-[16px] bg-surface-container-low border border-outline-variant/30">
            <p className="font-jetbrains text-[13px] text-on-surface-variant mb-1">Incidents</p>
            <p className="text-[32px] font-bold text-on-surface leading-tight">{expert.incidents || '—'}</p>
            <p className="text-[10px] text-tertiary font-jetbrains">{expert.successNote || 'resolved'}</p>
          </div>
        </div>

        {/* Resolution Velocity */}
        <div className="mb-[32px]">
          <h3 className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase mb-[8px]">
            RESOLUTION VELOCITY (7D)
          </h3>
          <div className="w-full h-32 bg-surface-container-lowest border border-outline-variant/20 relative flex items-end p-2 gap-1">
            {[40, 60, 35, 80, 55, 90, 75].map((h, i) => (
              <div
                key={i}
                className={`flex-1 bg-primary/20 rounded-t-sm border-t border-primary ${
                  i === 6 ? 'bg-primary/40 shadow-[0_0_10px_rgba(76,215,246,0.3)]' : ''
                }`}
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Investigation Patterns */}
        <div className="mb-[32px]">
          <h3 className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase mb-[8px]">
            INVESTIGATION PATTERNS
          </h3>
          <ul className="space-y-[8px]">
            {(expert.patterns || []).map((pattern, i) => (
              <li key={i} className="flex items-start gap-[8px]">
                <span className="material-symbols-outlined text-primary text-[18px] mt-1">check_circle</span>
                <span className="text-[16px] text-on-surface">{pattern}</span>
              </li>
            ))}
            {(!expert.patterns || expert.patterns.length === 0) && (
              <li className="text-on-surface-variant text-[14px]">Investigation patterns are being learned from Splunk data...</li>
            )}
          </ul>
        </div>

        {/* Expertise Topology */}
        <div className="mb-[32px]">
          <h3 className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase mb-[8px]">
            EXPERTISE TOPOLOGY
          </h3>
          <div className="flex flex-wrap gap-2">
            {(expert.expertise || []).map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-surface-container-highest font-jetbrains text-[13px] text-on-surface border border-outline-variant"
              >
                {tag}
              </span>
            ))}
            {(!expert.expertise || expert.expertise.length === 0) && (
              <span className="text-on-surface-variant text-[14px]">Expertise domains loading...</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-[32px]">
          <button className="w-full py-4 bg-primary text-on-primary font-bold hover:bg-secondary transition-colors photonic-glow text-[16px]">
            SYNCHRONIZE TWIN KNOWLEDGE
          </button>
        </div>
      </div>
    </aside>
  )
}

/* ===================== SIDEBAR ===================== */
function KnowledgeSidebar({ user }) {
  const navItems = [
    { id: 'home', icon: 'dashboard', label: 'Home', href: '/dashboard' },
    { id: 'investigate', icon: 'search', label: 'Investigate' },
    { id: 'knowledge', icon: 'psychology', label: 'Knowledge', active: true },
    { id: 'analytics', icon: 'bar_chart', label: 'Analytics', href: '/dashboard/analytics' },
    { id: 'history', icon: 'history', label: 'History' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ]

  return (
    <aside className="w-[240px] flex-shrink-0 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col h-screen sticky top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
        <span className="font-inter text-[20px] font-bold text-on-surface">OpsTwin AI</span>
      </div>

      <nav className="flex-grow px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href || '#'}
            className={`flex items-center gap-3 px-4 py-3 transition-colors ${
              item.active
                ? 'bg-primary/10 text-primary border-r-2 border-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[16px]">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-outline-variant/10">
        <button className="w-full py-3 bg-primary/10 text-primary border border-primary/30 rounded mb-6 hover:bg-primary/20 transition-all font-bold text-sm">
          NEW INVESTIGATION
        </button>
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10">
            <span className="text-primary font-bold text-[12px]">{user.avatar}</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-on-surface truncate">{user.name}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider truncate">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

/* ===================== HEADER ===================== */
function KnowledgeHeader({ user }) {
  return (
    <header className="h-14 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 z-40 flex items-center justify-between px-6 sticky top-0">
      <div className="flex items-center gap-4 bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/20 w-96">
        <span className="material-symbols-outlined text-on-surface-variant text-xl">search</span>
        <input
          className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm text-on-surface w-full placeholder:text-on-surface-variant/50"
          placeholder="Search system overmind..."
          type="text"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
          {user.avatar}
        </div>
      </div>
    </header>
  )
}

/* ===================== FOOTER ===================== */
function KnowledgeFooter() {
  return (
    <footer className="w-full py-12 border-t border-outline-variant/20 bg-surface-container-lowest mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-[24px] max-w-[1280px] mx-auto gap-[24px]">
        <div className="font-inter text-[24px] font-bold text-primary leading-[1.4]">OpsTwin AI</div>
        <p className="text-on-surface-variant text-sm text-center md:text-left">
          © 2025 OpsTwin AI. All rights reserved. Built for Agentic Intelligence.
        </p>
        <div className="flex gap-[16px]">
          <a className="text-on-surface-variant hover:text-primary underline transition-all text-sm" href="#">Documentation</a>
          <a className="text-on-surface-variant hover:text-primary underline transition-all text-sm" href="#">Privacy Policy</a>
          <a className="text-on-surface-variant hover:text-primary underline transition-all text-sm" href="#">Contact Support</a>
        </div>
      </div>
    </footer>
  )
}
