// Demo user credentials
const DEMO_USER = {
  email: 'demo@opstwin.ai',
  password: 'demo1234',
  name: 'Alex Chen',
  role: 'Senior SRE',
  avatar: 'AC',
}

export function loginUser(email, password) {
  if (email === DEMO_USER.email && password === DEMO_USER.password) {
    const userData = {
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      role: DEMO_USER.role,
      avatar: DEMO_USER.avatar,
    }
    localStorage.setItem('opstwin_user', JSON.stringify(userData))
    return { success: true, user: userData }
  }
  return { success: false, error: 'Invalid email or password' }
}

export function getUser() {
  const stored = localStorage.getItem('opstwin_user')
  return stored ? JSON.parse(stored) : null
}

export function logoutUser() {
  localStorage.removeItem('opstwin_user')
}

export function isAuthenticated() {
  return !!localStorage.getItem('opstwin_user')
}

export { DEMO_USER }
