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
                    <span className="w-2 h-2 rounded-full bg-error"></span> Incident
                  </span>
                  <span className="flex items-center gap-2 font-jetbrains text-[13px] text-on-surface-variant">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span> Service
                  </span>
                </div>
              </div>

              <div className="flex-grow bg-surface-container-lowest border border-outline-variant relative overflow-hidden canvas-bg flex items-center justify-center">
                {/* SVG Graph */}
                <svg className="w-full h-full max-h-[700px] absolute inset-0 z-0 opacity-80" viewBox="0 0 800 600">
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur result="blur" stdDeviation="3" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  {/* Connection Lines */}
                  <g className="stroke-outline-variant/30" strokeWidth="1" fill="none">
                    <line x1="400" y1="300" x2="250" y2="150" />
                    <line x1="400" y1="300" x2="550" y2="150" />
                    <line x1="400" y1="300" x2="250" y2="450" />
                    <line x1="400" y1="300" x2="550" y2="450" />
                    <line x1="250" y1="150" x2="100" y2="100" />
                    <line x1="250" y1="150" x2="300" y2="50" />
                    <line x1="550" y1="150" x2="650" y2="100" />
                    <line x1="550" y1="150" x2="500" y2="50" />
                    <line x1="250" y1="450" x2="150" y2="520" />
                    <line x1="550" y1="450" x2="650" y2="520" />
                  </g>
                  {/* Central Core */}
                  <g className="cursor-pointer">
                    <circle cx="400" cy="300" r="14" className="fill-primary node-pulse" filter="url(#glow)" />
                    <circle cx="400" cy="300" r="6" className="fill-primary" />
                    <text x="400" y="330" textAnchor="middle" className="fill-primary font-jetbrains text-[12px]">ROOT_SYSTEM</text>
                  </g>
                  {/* Level 1 Nodes */}
                  <g className="cursor-pointer">
                    <circle cx="250" cy="150" r="8" className="fill-tertiary" />
                    <text x="250" y="175" textAnchor="middle" className="fill-on-surface-variant text-[10px] font-jetbrains">Auth_Service</text>
                  </g>
                  <g className="cursor-pointer">
                    <circle cx="550" cy="150" r="8" className="fill-tertiary" />
                    <text x="550" y="175" textAnchor="middle" className="fill-on-surface-variant text-[10px] font-jetbrains">Kube_Master</text>
                  </g>
                  <g className="cursor-pointer">
                    <circle cx="250" cy="450" r="10" className="fill-error" />
                    <text x="250" y="475" textAnchor="middle" className="fill-on-surface-variant text-[10px] font-jetbrains">Latency_Spike_09</text>
                  </g>
                  <g className="cursor-pointer">
                    <circle cx="550" cy="450" r="8" className="fill-secondary" />
                    <text x="550" y="475" textAnchor="middle" className="fill-on-surface-variant text-[10px] font-jetbrains">Alex_Chen_Twin</text>
                  </g>
                  {/* Satellite Nodes */}
                  <circle cx="100" cy="100" r="5" className="fill-outline-variant" />
                  <circle cx="300" cy="50" r="5" className="fill-outline-variant" />
                  <circle cx="650" cy="100" r="5" className="fill-outline-variant" />
                  <circle cx="500" cy="50" r="5" className="fill-outline-variant" />
                  <circle cx="150" cy="520" r="5" className="fill-outline-variant" />
                  <circle cx="650" cy="520" r="5" className="fill-outline-variant" />
                </svg>

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

                {/* Search in Canvas */}
                <div className="absolute top-6 right-6 z-10">
                  <div className="flex items-center gap-2 bg-surface-container/90 backdrop-blur-md border border-outline-variant px-4 py-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
                    <input
                      className="bg-transparent border-none focus:ring-0 focus:outline-none text-[16px] text-on-surface placeholder:text-on-surface-variant w-48"
                      placeholder="Search knowledge..."
                      type="text"
                    />
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
            <p className="text-[32px] font-bold text-primary leading-tight">{expert.mttr}</p>
            <p className="text-[10px] text-primary/60 font-jetbrains">{expert.mttrDelta}</p>
          </div>
          <div className="p-[16px] bg-surface-container-low border border-outline-variant/30">
            <p className="font-jetbrains text-[13px] text-on-surface-variant mb-1">Success Rate</p>
            <p className="text-[32px] font-bold text-on-surface leading-tight">{expert.successRate}</p>
            <p className="text-[10px] text-tertiary font-jetbrains">{expert.successNote}</p>
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
            {expert.patterns.map((pattern) => (
              <li key={pattern} className="flex items-start gap-[8px]">
                <span className="material-symbols-outlined text-primary text-[18px] mt-1">check_circle</span>
                <span className="text-[16px] text-on-surface">{pattern}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expertise Topology */}
        <div className="mb-[32px]">
          <h3 className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase mb-[8px]">
            EXPERTISE TOPOLOGY
          </h3>
          <div className="flex flex-wrap gap-2">
            {expert.expertise.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-surface-container-highest font-jetbrains text-[13px] text-on-surface border border-outline-variant"
              >
                {tag}
              </span>
            ))}
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
