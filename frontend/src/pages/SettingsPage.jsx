import { useState, useEffect } from 'react'
import { getHealth } from '../lib/api'

export default function SettingsPage() {
  const [health, setHealth] = useState(null)
  const [testing, setTesting] = useState(false)

  const testConnection = async () => {
    setTesting(true)
    try {
      const data = await getHealth()
      setHealth(data)
    } catch {
      setHealth({ status: 'error', components: {} })
    }
    setTesting(false)
  }

  useEffect(() => { testConnection() }, [])

  return (
    <div className="p-[24px] max-w-[900px] mx-auto space-y-[32px]">
      <div>
        <h1 className="font-inter text-[40px] font-bold text-on-surface leading-[1.2]">Settings</h1>
        <p className="text-on-surface-variant mt-1">System configuration and connection status</p>
      </div>

      {/* Connection Status */}
      <div className="bg-surface-container border border-outline-variant rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase">
            Connection Status
          </h3>
          <button
            onClick={testConnection}
            disabled={testing}
            className="px-4 py-2 border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors font-jetbrains text-[12px] tracking-[0.15em] uppercase flex items-center gap-2"
          >
            <span className={`material-symbols-outlined text-[16px] ${testing ? 'animate-spin' : ''}`}>
              {testing ? 'sync' : 'refresh'}
            </span>
            Test Connection
          </button>
        </div>

        {health && (
          <div className="space-y-3">
            {Object.entries(health.components || {}).map(([name, status]) => (
              <div key={name} className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant/20 rounded">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${status === 'online' ? 'bg-green-400' : status === 'offline' ? 'bg-red-400' : 'bg-amber-400'}`}></span>
                  <span className="text-on-surface capitalize">{name.replace('_', ' ')}</span>
                </div>
                <span className={`font-jetbrains text-[12px] uppercase ${status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                  {status}
                </span>
              </div>
            ))}
            {health.splunk_version && (
              <p className="text-[12px] text-on-surface-variant font-jetbrains mt-2">
                Splunk Version: {health.splunk_version}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Splunk Configuration */}
      <div className="bg-surface-container border border-outline-variant rounded-lg p-6">
        <h3 className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase mb-6">
          Splunk Configuration
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-jetbrains text-[11px] tracking-[0.15em] text-on-surface-variant uppercase block mb-2">Host</label>
            <input disabled value="44.222.62.149" className="w-full px-3 py-2 bg-background border border-outline-variant text-on-surface font-jetbrains text-[13px] opacity-70" />
          </div>
          <div>
            <label className="font-jetbrains text-[11px] tracking-[0.15em] text-on-surface-variant uppercase block mb-2">Port</label>
            <input disabled value="8089" className="w-full px-3 py-2 bg-background border border-outline-variant text-on-surface font-jetbrains text-[13px] opacity-70" />
          </div>
          <div>
            <label className="font-jetbrains text-[11px] tracking-[0.15em] text-on-surface-variant uppercase block mb-2">Index</label>
            <input disabled value="opstwin_incidents" className="w-full px-3 py-2 bg-background border border-outline-variant text-on-surface font-jetbrains text-[13px] opacity-70" />
          </div>
          <div>
            <label className="font-jetbrains text-[11px] tracking-[0.15em] text-on-surface-variant uppercase block mb-2">HEC Status</label>
            <input disabled value="Enabled" className="w-full px-3 py-2 bg-background border border-outline-variant text-on-surface font-jetbrains text-[13px] opacity-70" />
          </div>
        </div>
      </div>

      {/* Agent Configuration */}
      <div className="bg-surface-container border border-outline-variant rounded-lg p-6">
        <h3 className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase mb-6">
          Agent Configuration
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant/20 rounded">
            <span className="text-on-surface">LLM Model</span>
            <span className="font-jetbrains text-[12px] text-primary">Llama 3.3 70B (Groq)</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant/20 rounded">
            <span className="text-on-surface">Agent Pipeline</span>
            <span className="font-jetbrains text-[12px] text-primary">Historian → Expert → Risk → Planner</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant/20 rounded">
            <span className="text-on-surface">MCP Layer</span>
            <span className="font-jetbrains text-[12px] text-primary">Active (5 tools)</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant/20 rounded">
            <span className="text-on-surface">Knowledge Base</span>
            <span className="font-jetbrains text-[12px] text-primary">500+ incidents indexed</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant/20 rounded">
            <span className="text-on-surface">Auto-Approval Threshold</span>
            <span className="font-jetbrains text-[12px] text-amber-400">90% confidence (requires manual approval below)</span>
          </div>
        </div>
      </div>

      {/* Database */}
      <div className="bg-surface-container border border-outline-variant rounded-lg p-6">
        <h3 className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase mb-6">
          Database
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant/20 rounded">
            <span className="text-on-surface">Provider</span>
            <span className="font-jetbrains text-[12px] text-primary">Neon PostgreSQL</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant/20 rounded">
            <span className="text-on-surface">Region</span>
            <span className="font-jetbrains text-[12px] text-on-surface-variant">us-east-1</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant/20 rounded">
            <span className="text-on-surface">Tables</span>
            <span className="font-jetbrains text-[12px] text-on-surface-variant">users, investigations</span>
          </div>
        </div>
      </div>
    </div>
  )
}
