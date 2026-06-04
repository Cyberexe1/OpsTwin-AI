import { useState } from 'react'

export default function InvestigatePage() {
  const [isRunning, setIsRunning] = useState(false)

  const handleTrigger = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 3000)
  }

  return (
    <div className="pt-8 pb-12 px-8">
      <div className="grid grid-cols-12 gap-[24px] max-w-[1600px] mx-auto">
            {/* Left: Form */}
            <section className="col-span-12 lg:col-span-4 space-y-[24px]">
              <InvestigationForm onTrigger={handleTrigger} isRunning={isRunning} />
              <SessionStatus />
            </section>
            {/* Right: Pipeline + Results */}
            <section className="col-span-12 lg:col-span-8 space-y-[24px]">
              <AgentPipeline />
              <ResolutionPlan />
              <AgentDetailCards />
            </section>
          </div>
        <InvestigateFooter />
    </div>
  )
}

/* ===================== FORM ===================== */
function InvestigationForm({ onTrigger, isRunning }) {
  const [symptoms] = useState(['Latency > 500ms', '5xx Errors'])

  return (
    <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/30">
      <h2 className="font-inter text-[24px] font-semibold leading-[1.4] text-on-surface mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">search_insights</span>
        Trigger Investigation
      </h2>
      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onTrigger(); }}>
        <div className="space-y-2">
          <label className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase">TARGET SERVICE</label>
          <select className="w-full bg-background border border-outline-variant rounded-lg p-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
            <option>Auth-Service-Production</option>
            <option>Payment-Gateway-v2</option>
            <option>Inventory-Manager</option>
            <option>User-Profile-DB</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase">SYMPTOMS</label>
          <div className="flex flex-wrap gap-2 p-3 bg-background border border-outline-variant rounded-lg min-h-[100px] content-start">
            {symptoms.map((s) => (
              <span key={s} className="bg-primary-container/10 border border-primary/40 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {s} <span className="material-symbols-outlined text-sm cursor-pointer">close</span>
              </span>
            ))}
            <input className="bg-transparent border-none focus:ring-0 focus:outline-none p-0 text-sm w-24 text-on-surface-variant" placeholder="Add symptom..." type="text" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase">SEVERITY</label>
            <select className="w-full bg-background border border-outline-variant rounded-lg p-3 text-on-surface focus:border-primary outline-none">
              <option>P0 - Critical</option>
              <option>P1 - High</option>
              <option>P2 - Medium</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase">HINT (OPTIONAL)</label>
            <input className="w-full bg-background border border-outline-variant rounded-lg p-3 text-on-surface focus:border-primary outline-none placeholder:text-on-surface-variant/50" placeholder="e.g. recent deployment" type="text" />
          </div>
        </div>
        <button type="submit" disabled={isRunning} className="w-full bg-primary-container text-on-primary-container font-bold py-4 rounded-lg photonic-glow hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-60">
          {isRunning ? (
            <><span className="material-symbols-outlined animate-spin">refresh</span> INITIALIZING AGENTS...</>
          ) : (
            <><span className="material-symbols-outlined">bolt</span> TRIGGER INVESTIGATION</>
          )}
        </button>
      </form>
    </div>
  )
}

/* ===================== SESSION STATUS ===================== */
function SessionStatus() {
  return (
    <div className="bg-surface-container-high p-4 rounded-lg border border-outline-variant/30 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-3 h-3 bg-primary rounded-full status-pulse"></div>
        <div>
          <p className="text-xs font-jetbrains tracking-[0.15em] text-on-surface-variant uppercase">CURRENT SESSION</p>
          <p className="font-jetbrains text-[13px] text-on-surface">INV-8842-XTR</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-jetbrains tracking-[0.15em] text-on-surface-variant uppercase">RUNTIME</p>
        <p className="font-jetbrains text-[13px] text-primary">04:12s</p>
      </div>
    </div>
  )
}

/* ===================== AGENT PIPELINE ===================== */
function AgentPipeline() {
  const steps = [
    { icon: 'history', label: 'HISTORIAN', color: 'bg-blue-500', glowClass: 'agent-active-glow-blue', textColor: 'text-blue-400', desc: 'Log context analysis complete' },
    { icon: 'psychology', label: 'EXPERT TWIN', color: 'bg-purple-500', glowClass: 'agent-active-glow-purple', textColor: 'text-purple-400', desc: 'Reasoning chain synthesized' },
    { icon: 'warning', label: 'RISK AGENT', color: 'bg-amber-500', glowClass: 'agent-active-glow-amber', textColor: 'text-amber-400', desc: 'Blast radius calculated' },
    { icon: 'architecture', label: 'RESOLUTION', color: 'bg-surface-container-highest', glowClass: '', textColor: 'text-on-surface-variant', desc: 'Finalizing steps...', pending: true },
  ]

  return (
    <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/20 relative overflow-hidden">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-outline-variant/20"></div>
      <div className="absolute top-0 left-0 w-3/4 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500"></div>

      <div className="flex justify-between items-start relative">
        {steps.map((step) => (
          <div key={step.label} className="flex flex-col items-center gap-3 w-1/4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step.color} ${step.glowClass} ${step.pending ? 'border border-outline-variant animate-pulse text-outline-variant' : 'text-on-primary'}`}>
              <span className="material-symbols-outlined">{step.icon}</span>
            </div>
            <span className={`font-jetbrains text-[10px] tracking-[0.15em] uppercase ${step.textColor}`}>{step.label}</span>
            <span className={`text-xs text-center px-2 ${step.pending ? 'text-on-surface-variant/40' : 'text-on-surface-variant'}`}>{step.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ===================== RESOLUTION PLAN ===================== */
function ResolutionPlan() {
  const steps = [
    { title: '1. Isolate Node: US-EAST-1A', desc: 'Remove traffic from affected node to prevent cascade.', checked: true },
    { title: '2. Clear Redis Namespace `auth:session:cache`', desc: 'Flush the specific namespace to remove corrupted pointer headers.', checked: true },
    { title: '3. Deploy Hotfix: Version 2.4.1b', desc: 'Automated rollback of recent commit `a9f23` while keeping DB migrations.', checked: false },
  ]

  return (
    <div className="bg-surface-container p-8 rounded-xl border border-primary/30 relative overflow-hidden">
      {/* Risk badge */}
      <div className="absolute top-0 right-0 p-4">
        <span className="bg-amber-900/40 border border-amber-500/50 text-amber-400 px-3 py-1 rounded text-xs font-bold tracking-widest uppercase">
          Risk: MEDIUM
        </span>
      </div>

      <div className="mb-8">
        <h3 className="font-inter text-[24px] font-semibold text-on-surface leading-[1.4] mb-2">Resolution Plan: Alpha-7</h3>
        <p className="text-on-surface-variant">Identified memory leak in `auth-provider.v2` cache layer.</p>
      </div>

      {/* Confidence bar */}
      <div className="mb-10 space-y-3">
        <div className="flex justify-between text-xs font-jetbrains tracking-[0.15em] uppercase mb-1">
          <span className="text-on-surface-variant">PLAN CONFIDENCE</span>
          <span className="text-primary">94%</span>
        </div>
        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full" style={{ width: '94%' }}></div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-8">
        {steps.map((step) => (
          <div key={step.title} className="flex gap-4 items-start p-4 bg-background/40 rounded-lg border border-outline-variant/10">
            <input
              type="checkbox"
              defaultChecked={step.checked}
              className="mt-1 w-5 h-5 rounded border-outline-variant bg-background text-primary focus:ring-primary focus:ring-offset-background"
            />
            <div>
              <p className="font-bold text-sm text-on-surface">{step.title}</p>
              <p className="text-xs text-on-surface-variant">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4">
        <button className="bg-primary text-on-primary font-bold px-8 py-3 rounded hover:bg-secondary transition-all flex items-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          Approve Plan
        </button>
        <button className="border border-outline-variant text-on-surface px-8 py-3 rounded hover:bg-surface-variant transition-all">
          Modify
        </button>
        <button className="text-error px-4 py-3 rounded hover:bg-error/10 transition-all">
          Reject
        </button>
      </div>
    </div>
  )
}

/* ===================== AGENT DETAIL CARDS ===================== */
function AgentDetailCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Historian */}
      <div className="bg-surface-container-high p-5 rounded-lg border border-outline-variant/20">
        <div className="flex items-center gap-2 text-blue-400 mb-4">
          <span className="material-symbols-outlined text-sm">history</span>
          <span className="font-jetbrains text-[11px] tracking-[0.15em] uppercase">HISTORIAN FINDINGS</span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Spike in <span className="font-jetbrains text-on-surface">malloc</span> failures detected exactly at 14:02:45 UTC across 3 containers following deployment of <span className="font-jetbrains text-on-surface">PR-922</span>.
        </p>
      </div>

      {/* Expert Twin */}
      <div className="bg-surface-container-high p-5 rounded-lg border border-outline-variant/20">
        <div className="flex items-center gap-2 text-purple-400 mb-4">
          <span className="material-symbols-outlined text-sm">psychology</span>
          <span className="font-jetbrains text-[11px] tracking-[0.15em] uppercase">EXPERT REASONING</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
            <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
            Mapping error codes to KB...
          </div>
          <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
            <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
            Correlating memory leak to Auth.
          </div>
          <div className="flex items-center gap-2 text-[10px] text-purple-400">
            <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
            Root cause: Unclosed file handles.
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-surface-container-high p-5 rounded-lg border border-outline-variant/20">
        <div className="flex items-center gap-2 text-amber-400 mb-4">
          <span className="material-symbols-outlined text-sm">lan</span>
          <span className="font-jetbrains text-[11px] tracking-[0.15em] uppercase">AFFECTED SERVICES</span>
        </div>
        <ul className="text-xs space-y-2">
          <li className="flex justify-between border-b border-outline-variant/10 pb-1">
            <span className="text-on-surface">Billing Engine</span>
            <span className="text-error">High</span>
          </li>
          <li className="flex justify-between border-b border-outline-variant/10 pb-1">
            <span className="text-on-surface">User API</span>
            <span className="text-amber-500">Med</span>
          </li>
          <li className="flex justify-between">
            <span className="text-on-surface">Admin UI</span>
            <span className="text-green-500">Low</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

/* ===================== SIDEBAR ===================== */
function InvestigateSidebar({ user }) {
  const navItems = [
    { id: 'home', icon: 'dashboard', label: 'Home', href: '/dashboard' },
    { id: 'investigate', icon: 'search', label: 'Investigate', active: true },
    { id: 'knowledge', icon: 'psychology', label: 'Knowledge', href: '/dashboard/knowledge' },
    { id: 'analytics', icon: 'bar_chart', label: 'Analytics', href: '/dashboard/analytics' },
    { id: 'history', icon: 'history', label: 'History', href: '/dashboard/history' },
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
function InvestigateHeader({ user }) {
  return (
    <header className="h-14 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 z-40 flex items-center justify-between px-6 sticky top-0">
      <div className="flex items-center gap-4 bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/20 w-96">
        <span className="material-symbols-outlined text-on-surface-variant text-xl">search</span>
        <input className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm text-on-surface w-full placeholder:text-on-surface-variant/50" placeholder="Search system overmind..." type="text" />
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
function InvestigateFooter() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20 w-full py-12 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-[1280px] mx-auto gap-8">
        <div className="font-inter text-[24px] font-bold text-primary leading-[1.4]">OpsTwin AI</div>
        <p className="text-on-surface-variant text-sm text-center md:text-left">
          © 2025 OpsTwin AI. All rights reserved. Built for Agentic Intelligence.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <a className="text-on-surface-variant text-sm hover:text-primary underline transition-all opacity-80 hover:opacity-100" href="#">Hackathon Credits</a>
          <a className="text-on-surface-variant text-sm hover:text-primary underline transition-all opacity-80 hover:opacity-100" href="#">Documentation</a>
          <a className="text-on-surface-variant text-sm hover:text-primary underline transition-all opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
          <a className="text-on-surface-variant text-sm hover:text-primary underline transition-all opacity-80 hover:opacity-100" href="#">Contact Support</a>
        </div>
      </div>
    </footer>
  )
}
