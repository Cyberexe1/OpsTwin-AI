import { useLocation, useNavigate } from 'react-router-dom'
import { getUser } from '../../lib/auth'

const navItems = [
  { id: 'home', icon: 'dashboard', label: 'Home', href: '/dashboard' },
  { id: 'investigate', icon: 'search_insights', label: 'Investigate', href: '/dashboard/investigate' },
  { id: 'knowledge', icon: 'menu_book', label: 'Knowledge', href: '/dashboard/knowledge' },
  { id: 'analytics', icon: 'analytics', label: 'Analytics', href: '/dashboard/analytics' },
  { id: 'history', icon: 'history', label: 'History', href: '/dashboard/history' },
  { id: 'settings', icon: 'settings', label: 'Settings', href: '/dashboard/settings' },
]

export default function DashboardSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = getUser()

  const isActive = (href) => {
    if (href === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(href)
  }

  return (
    <aside className="w-[240px] flex-shrink-0 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col fixed top-0 left-0 h-screen z-50">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <span
          className="material-symbols-outlined text-primary text-3xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          psychology
        </span>
        <span className="font-inter text-[20px] font-bold text-primary tracking-tight leading-[1.4]">
          OpsTwin AI
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.href)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-all duration-200 ${
              isActive(item.href)
                ? 'text-primary bg-primary/10 font-bold border-l-2 border-primary'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/50'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[16px]">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-outline-variant/20">
        <button
          onClick={() => navigate('/dashboard/investigate')}
          className="w-full py-3 bg-primary/10 text-primary border border-primary/30 rounded mb-4 hover:bg-primary/20 transition-all font-bold text-sm"
        >
          NEW INVESTIGATION
        </button>

        <div className="p-3 bg-surface-container rounded border border-outline-variant/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot"></span>
            <span className="font-jetbrains text-[12px] font-medium tracking-[0.15em] text-on-surface-variant uppercase">
              Engine Active
            </span>
          </div>
          <p className="text-[11px] text-outline">v2.4.1-stable / Agentic Cluster 09</p>
        </div>

        {user && (
          <div className="flex items-center gap-3 px-2 mt-4">
            <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10">
              <span className="text-primary font-bold text-[12px]">{user.avatar}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-on-surface truncate">{user.name}</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider truncate">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
