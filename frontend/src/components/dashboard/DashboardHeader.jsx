import { useNavigate } from 'react-router-dom'
import { getUser, logoutUser } from '../../lib/auth'

export default function DashboardHeader() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  return (
    <header className="h-14 flex items-center justify-between px-[24px] border-b border-outline-variant/20 sticky top-0 bg-background/80 backdrop-blur-md z-40">
      {/* Search */}
      <div className="flex items-center gap-4 bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/20 w-full max-w-xl focus-within:border-primary focus-within:photonic-glow transition-all">
        <span className="material-symbols-outlined text-on-surface-variant text-xl">search</span>
        <input
          className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm text-on-surface w-full placeholder:text-on-surface-variant/50"
          placeholder="Search investigations, agents, or services..."
          type="text"
        />
        <span className="text-[10px] text-outline bg-outline-variant/30 px-1.5 py-0.5 rounded border border-outline-variant/50 font-jetbrains hidden md:inline">
          ⌘K
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 ml-6">
        <button className="relative text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full border border-background"></span>
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <div className="h-6 w-[1px] bg-outline-variant/30"></div>
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-[14px] text-on-surface font-semibold leading-tight">{user.name}</p>
              <p className="text-[11px] text-outline">{user.role}</p>
            </div>
            <div className="w-9 h-9 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-[12px]">{user.avatar}</span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="text-on-surface-variant hover:text-error transition-colors"
          title="Log out"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>
    </header>
  )
}
