import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../../lib/auth'
import DashboardSidebar from './DashboardSidebar'
import DashboardHeader from './DashboardHeader'

export default function DashboardLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
    }
  }, [navigate])

  if (!isAuthenticated()) return null

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <DashboardSidebar />

      {/* Main Content (offset by sidebar width) */}
      <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
        {/* Sticky Header */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
