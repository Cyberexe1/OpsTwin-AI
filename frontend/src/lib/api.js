import { getToken } from './auth'

const API_BASE = import.meta.env.VITE_API_URL || ''  // Empty = uses Vite proxy in dev

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function startInvestigation({ service, symptoms, severity, rootCauseHint }) {
  const resp = await fetch(`${API_BASE}/api/v1/investigation/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({
      service,
      symptoms,
      severity,
      root_cause_hint: rootCauseHint || '',
    }),
  })
  if (!resp.ok) throw new Error(`API error: ${resp.status}`)
  return resp.json()
}

export async function getInvestigations() {
  const resp = await fetch(`${API_BASE}/api/v1/investigations`, {
    headers: authHeaders(),
  })
  if (!resp.ok) throw new Error(`API error: ${resp.status}`)
  return resp.json()
}

export async function getInvestigation(incidentId) {
  const resp = await fetch(`${API_BASE}/api/v1/investigations/${incidentId}`, {
    headers: authHeaders(),
  })
  if (!resp.ok) throw new Error(`API error: ${resp.status}`)
  return resp.json()
}

export async function getAnalyticsSummary() {
  const resp = await fetch(`${API_BASE}/api/v1/analytics/summary`, {
    headers: authHeaders(),
  })
  if (!resp.ok) throw new Error(`API error: ${resp.status}`)
  return resp.json()
}

export async function getExperts() {
  const resp = await fetch(`${API_BASE}/api/v1/knowledge/experts`, {
    headers: authHeaders(),
  })
  if (!resp.ok) throw new Error(`API error: ${resp.status}`)
  return resp.json()
}

export async function getHealth() {
  const resp = await fetch(`${API_BASE}/health`)
  if (!resp.ok) throw new Error(`API error: ${resp.status}`)
  return resp.json()
}

export async function getRootCauses() {
  const resp = await fetch(`${API_BASE}/api/v1/analytics/summary`, {
    headers: authHeaders(),
  })
  if (!resp.ok) return null
  return resp.json()
}

export async function getServiceHeatmap() {
  const resp = await fetch(`${API_BASE}/api/v1/analytics/summary`, {
    headers: authHeaders(),
  })
  if (!resp.ok) return null
  return resp.json()
}
