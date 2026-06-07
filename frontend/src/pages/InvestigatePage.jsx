import { useState } from 'react'
import { startInvestigation } from '../lib/api'

export default function InvestigatePage() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleTrigger = async (formData) => {
    setIsRunning(true)
    setError('')
    setResult(null)
    try {
      const response = await startInvestigation(formData)
      setResult(response)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="pt-8 pb-12 px-8">
      <div className="grid grid-cols-12 gap-[24px] max-w-[1600px] mx-auto">
            {/* Left: Form */}
            <section className="col-span-12 lg:col-span-4 space-y-[24px]">
              <InvestigationForm onTrigger={handleTrigger} isRunning={isRunning} />
              <SessionStatus result={result} isRunning={isRunning} />
              {error && (
                <div className="p-4 bg-error-container/20 border border-error/30 rounded-lg text-error text-sm">
                  {error}
                </div>
              )}
            </section>
            {/* Right: Pipeline + Results */}
            <section className="col-span-12 lg:col-span-8 space-y-[24px]">
              <AgentPipeline result={result} isRunning={isRunning} />
              {result && <ResolutionPlan plan={result.resolution_plan} confidence={result.overall_confidence} incidentId={result.incident_id} />}
              {result && <AgentDetailCards agents={result.agent_outputs} />}
            </section>
          </div>
        <InvestigateFooter />
    </div>
  )
}

/* ===================== FORM ===================== */
function InvestigationForm({ onTrigger, isRunning }) {
  const [symptoms, setSymptoms] = useState(['Latency > 500ms', '5xx Errors'])
  const [service, setService] = useState('Auth-Service-Production')
  const [severity, setSeverity] = useState('P1')
  const [hint, setHint] = useState('')
  const [newSymptom, setNewSymptom] = useState('')

  const serviceMap = {
    'Auth-Service-Production': 'auth-service',
    'Payment-Gateway-v2': 'payment-service',
    'Inventory-Manager': 'search-indexer',
    'User-Profile-DB': 'user-profile-db',
    'Redis-Cluster': 'redis-cluster',
    'API-Gateway': 'api-gateway',
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onTrigger({
      service: serviceMap[service] || service.toLowerCase().replace(/\s+/g, '-'),
      symptoms,
      severity,
      rootCauseHint: hint,
    })
  }

  const addSymptom = (e) => {
    if (e.key === 'Enter' && newSymptom.trim()) {
      e.preventDefault()
      setSymptoms([...symptoms, newSymptom.trim()])
      setNewSymptom('')
    }
  }

  const removeSymptom = (idx) => {
    setSymptoms(symptoms.filter((_, i) => i !== idx))
  }

  return (
    <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/30">
      <h2 className="font-inter text-[24px] font-semibold leading-[1.4] text-on-surface mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">search_insights</span>
        Trigger Investigation
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase">TARGET SERVICE</label>
          <select value={service} onChange={(e) => setService(e.target.value)} className="w-full bg-background border border-outline-variant rounded-lg p-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
            <option>Auth-Service-Production</option>
            <option>Payment-Gateway-v2</option>
            <option>Redis-Cluster</option>
            <option>API-Gateway</option>
            <option>Inventory-Manager</option>
            <option>User-Profile-DB</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase">SYMPTOMS</label>
          <div className="flex flex-wrap gap-2 p-3 bg-background border border-outline-variant rounded-lg min-h-[100px] content-start">
            {symptoms.map((s, i) => (
              <span key={i} className="bg-primary-container/10 border border-primary/40 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {s} <span className="material-symbols-outlined text-sm cursor-pointer" onClick={() => removeSymptom(i)}>close</span>
              </span>
            ))}
            <input
              className="bg-transparent border-none focus:ring-0 focus:outline-none p-0 text-sm w-32 text-on-surface-variant"
              placeholder="Add symptom..."
              type="text"
              value={newSymptom}
              onChange={(e) => setNewSymptom(e.target.value)}
              onKeyDown={addSymptom}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase">SEVERITY</label>
            <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full bg-background border border-outline-variant rounded-lg p-3 text-on-surface focus:border-primary outline-none">
              <option value="P0">P0 - Critical</option>
              <option value="P1">P1 - High</option>
              <option value="P2">P2 - Medium</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase">HINT (OPTIONAL)</label>
            <input value={hint} onChange={(e) => setHint(e.target.value)} className="w-full bg-background border border-outline-variant rounded-lg p-3 text-on-surface focus:border-primary outline-none placeholder:text-on-surface-variant/50" placeholder="e.g. memory_leak" type="text" />
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
function SessionStatus({ result, isRunning }) {
  return (
    <div className="bg-surface-container-high p-4 rounded-lg border border-outline-variant/30 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-amber-400 animate-pulse' : result ? 'bg-primary' : 'bg-outline'} status-pulse`}></div>
        <div>
          <p className="text-xs font-jetbrains tracking-[0.15em] text-on-surface-variant uppercase">CURRENT SESSION</p>
          <p className="font-jetbrains text-[13px] text-on-surface">{result?.incident_id || 'Waiting...'}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-jetbrains tracking-[0.15em] text-on-surface-variant uppercase">STATUS</p>
        <p className={`font-jetbrains text-[13px] ${isRunning ? 'text-amber-400' : result ? 'text-primary' : 'text-on-surface-variant'}`}>
          {isRunning ? 'Running...' : result?.status || 'Idle'}
        </p>
      </div>
    </div>
  )
}

/* ===================== AGENT PIPELINE ===================== */
function AgentPipeline({ result, isRunning }) {
  const getStepState = (agentKey) => {
    if (!isRunning && !result) return 'idle'
    if (result && result.agent_outputs && result.agent_outputs[agentKey]) return 'done'
    if (isRunning) return 'running'
    return 'idle'
  }

  const steps = [
    { key: 'historian', icon: 'history', label: 'HISTORIAN', color: 'bg-blue-500', glowClass: 'agent-active-glow-blue', textColor: 'text-blue-400', desc: result?.agent_outputs?.historian ? 'Complete' : 'Searching memory...' },
    { key: 'expert_twin', icon: 'psychology', label: 'EXPERT TWIN', color: 'bg-purple-500', glowClass: 'agent-active-glow-purple', textColor: 'text-purple-400', desc: result?.agent_outputs?.expert_twin ? 'Complete' : 'Reasoning...' },
    { key: 'risk_assessment', icon: 'warning', label: 'RISK AGENT', color: 'bg-amber-500', glowClass: 'agent-active-glow-amber', textColor: 'text-amber-400', desc: result?.agent_outputs?.risk_assessment ? 'Complete' : 'Evaluating...' },
    { key: 'planner', icon: 'architecture', label: 'RESOLUTION', color: 'bg-primary', glowClass: 'agent-active-glow-cyan', textColor: 'text-primary', desc: result?.resolution_plan ? 'Plan ready' : 'Planning...' },
  ]

  const completedCount = result ? Object.keys(result.agent_outputs || {}).length + (result.resolution_plan ? 1 : 0) : 0
  const progressWidth = isRunning ? '50%' : result ? '100%' : '0%'

  return (
    <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/20 relative overflow-hidden">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-outline-variant/20"></div>
      <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 transition-all duration-1000" style={{ width: progressWidth }}></div>

      <div className="flex justify-between items-start relative">
        {steps.map((step) => {
          const state = getStepState(step.key)
          const isDone = state === 'done'
          const isPending = state === 'idle' && !isRunning

          return (
            <div key={step.label} className="flex flex-col items-center gap-3 w-1/4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDone ? step.color + ' ' + step.glowClass : isPending ? 'bg-surface-container-highest border border-outline-variant' : step.color + ' animate-pulse'} ${isDone ? 'text-on-primary' : isPending ? 'text-outline-variant' : 'text-on-primary'}`}>
                <span className="material-symbols-outlined">{isDone ? 'check' : step.icon}</span>
              </div>
              <span className={`font-jetbrains text-[10px] tracking-[0.15em] uppercase ${isDone ? step.textColor : 'text-on-surface-variant'}`}>{step.label}</span>
              <span className={`text-xs text-center px-2 ${isDone ? 'text-on-surface-variant' : 'text-on-surface-variant/40'}`}>{step.desc}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ===================== RESOLUTION PLAN ===================== */
function ResolutionPlan({ plan, confidence, incidentId }) {
  if (!plan) return null

  const [status, setStatus] = useState(null)

  const steps = plan.steps || []
  const riskLevel = plan.risk_level || 'medium'
  const estimatedTime = plan.estimated_time || '15-30 minutes'
  const confidencePct = Math.round((confidence || 0) * 100)

  const handleApprove = () => {
    setStatus('approved')
  }

  const handleReject = () => {
    setStatus('rejected')
  }

  const handleModify = () => {
    setStatus('modifying')
  }

  return (
    <div className="bg-surface-container p-8 rounded-xl border border-primary/30 relative overflow-hidden">
      {/* Risk badge */}
      <div className="absolute top-0 right-0 p-4">
        <span className={`px-3 py-1 rounded text-xs font-bold tracking-widest uppercase border ${riskLevel === 'high' ? 'bg-red-900/40 border-red-500/50 text-red-400' : riskLevel === 'low' ? 'bg-green-900/40 border-green-500/50 text-green-400' : 'bg-amber-900/40 border-amber-500/50 text-amber-400'}`}>
          Risk: {riskLevel.toUpperCase()}
        </span>
      </div>

      <div className="mb-8">
        <h3 className="font-inter text-[24px] font-semibold text-on-surface leading-[1.4] mb-2">Resolution Plan</h3>
        <p className="text-on-surface-variant">Estimated time: {estimatedTime}</p>
      </div>

      {/* Confidence bar */}
      <div className="mb-10 space-y-3">
        <div className="flex justify-between text-xs font-jetbrains tracking-[0.15em] uppercase mb-1">
          <span className="text-on-surface-variant">PLAN CONFIDENCE</span>
          <span className="text-primary">{confidencePct}%</span>
        </div>
        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${confidencePct}%` }}></div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-8">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4 items-start p-4 bg-background/40 rounded-lg border border-outline-variant/10">
            <input type="checkbox" defaultChecked={i < 2} className="mt-1 w-5 h-5 rounded border-outline-variant bg-background text-primary focus:ring-primary focus:ring-offset-background" />
            <div>
              <p className="font-bold text-sm text-on-surface">{step}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      {status === 'approved' ? (
        <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <div>
            <p className="font-bold text-on-surface">Plan Approved</p>
            <p className="text-sm text-on-surface-variant">Investigation {incidentId} — executing remediation steps.</p>
          </div>
        </div>
      ) : status === 'rejected' ? (
        <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/30 rounded-lg">
          <span className="material-symbols-outlined text-error">cancel</span>
          <div>
            <p className="font-bold text-on-surface">Plan Rejected</p>
            <p className="text-sm text-on-surface-variant">Investigation requires manual review. Escalating to on-call team.</p>
          </div>
        </div>
      ) : status === 'modifying' ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <span className="material-symbols-outlined text-amber-400">edit</span>
            <p className="text-sm text-on-surface">Modify the steps above, then approve or reject.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={handleApprove} className="bg-primary text-on-primary font-bold px-8 py-3 rounded hover:bg-secondary transition-all flex items-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              Approve Modified Plan
            </button>
            <button onClick={handleReject} className="text-error px-4 py-3 rounded hover:bg-error/10 transition-all">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          <button onClick={handleApprove} className="bg-primary text-on-primary font-bold px-8 py-3 rounded hover:bg-secondary transition-all flex items-center gap-2">
            <span className="material-symbols-outlined">check_circle</span>
            Approve Plan
          </button>
          <button onClick={handleModify} className="border border-outline-variant text-on-surface px-8 py-3 rounded hover:bg-surface-variant transition-all">
            Modify
          </button>
          <button onClick={handleReject} className="text-error px-4 py-3 rounded hover:bg-error/10 transition-all">
            Reject
          </button>
        </div>
      )}
    </div>
  )
}

/* ===================== AGENT DETAIL CARDS ===================== */
function AgentDetailCards({ agents }) {
  if (!agents) return null

  const historian = agents.historian
  const expert = agents.expert_twin
  const risk = agents.risk_assessment

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Historian */}
      <div className="bg-surface-container-high p-5 rounded-lg border border-outline-variant/20">
        <div className="flex items-center gap-2 text-blue-400 mb-4">
          <span className="material-symbols-outlined text-sm">history</span>
          <span className="font-jetbrains text-[11px] tracking-[0.15em] uppercase">HISTORIAN ({Math.round((historian?.confidence || 0) * 100)}%)</span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
          {historian?.findings?.summary || historian?.reasoning || 'Searching operational memory...'}
        </p>
        {historian?.recommendations?.slice(0, 2).map((rec, i) => (
          <p key={i} className="text-[10px] text-on-surface-variant mt-1">• {rec}</p>
        ))}
      </div>

      {/* Expert Twin */}
      <div className="bg-surface-container-high p-5 rounded-lg border border-outline-variant/20">
        <div className="flex items-center gap-2 text-purple-400 mb-4">
          <span className="material-symbols-outlined text-sm">psychology</span>
          <span className="font-jetbrains text-[11px] tracking-[0.15em] uppercase">EXPERT ({Math.round((expert?.confidence || 0) * 100)}%)</span>
        </div>
        <div className="space-y-2">
          {expert?.recommendations?.slice(0, 4).map((rec, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] text-on-surface-variant">
              <span className="w-1 h-1 bg-purple-500 rounded-full shrink-0"></span>
              {rec}
            </div>
          ))}
          {!expert?.recommendations?.length && (
            <p className="text-xs text-on-surface-variant">{expert?.reasoning || 'Simulating expert...'}</p>
          )}
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-surface-container-high p-5 rounded-lg border border-outline-variant/20">
        <div className="flex items-center gap-2 text-amber-400 mb-4">
          <span className="material-symbols-outlined text-sm">lan</span>
          <span className="font-jetbrains text-[11px] tracking-[0.15em] uppercase">RISK ({Math.round((risk?.confidence || 0) * 100)}%)</span>
        </div>
        {risk?.findings?.blast_radius ? (
          <ul className="text-xs space-y-2">
            <li className="flex justify-between border-b border-outline-variant/10 pb-1">
              <span className="text-on-surface">Blast Radius</span>
              <span className={`${risk.findings.blast_radius.risk_level === 'high' ? 'text-error' : 'text-amber-500'}`}>
                {risk.findings.blast_radius.affected_count} services
              </span>
            </li>
            <li className="flex justify-between border-b border-outline-variant/10 pb-1">
              <span className="text-on-surface">Risk Level</span>
              <span className="text-amber-500 uppercase">{risk.findings.blast_radius.risk_level}</span>
            </li>
            {risk.findings.blast_radius.services?.slice(0, 3).map((svc, i) => (
              <li key={i} className="flex justify-between">
                <span className="text-on-surface-variant">{svc}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-on-surface-variant">{risk?.reasoning || 'Evaluating risk...'}</p>
        )}
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
