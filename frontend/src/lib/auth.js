const API_BASE = ''

export async function loginUser(email, password) {
  try {
    const resp = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!resp.ok) {
      const err = await resp.json()
      return { success: false, error: err.detail || 'Login failed' }
    }

    const data = await resp.json()
    localStorage.setItem('opstwin_token', data.token)
    localStorage.setItem('opstwin_user', JSON.stringify(data.user))
    return { success: true, user: data.user }
  } catch (e) {
    return { success: false, error: 'Cannot connect to server' }
  }
}

export async function registerUser(email, name, password, role = 'Engineer') {
  try {
    const resp = await fetch(`${API_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password, role }),
    })

    if (!resp.ok) {
      const err = await resp.json()
      return { success: false, error: err.detail || 'Registration failed' }
    }

    const data = await resp.json()
    localStorage.setItem('opstwin_token', data.token)
    localStorage.setItem('opstwin_user', JSON.stringify(data.user))
    return { success: true, user: data.user }
  } catch (e) {
    return { success: false, error: 'Cannot connect to server' }
  }
}

export function getToken() {
  return localStorage.getItem('opstwin_token')
}

export function getUser() {
  const stored = localStorage.getItem('opstwin_user')
  return stored ? JSON.parse(stored) : null
}

export function logoutUser() {
  localStorage.removeItem('opstwin_token')
  localStorage.removeItem('opstwin_user')
}

export function isAuthenticated() {
  return !!localStorage.getItem('opstwin_token')
}

// Demo credentials hint for the login page
export const DEMO_HINT = {
  email: 'demo@opstwin.ai',
  password: 'demo1234',
}
