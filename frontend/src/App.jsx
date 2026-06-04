import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardLayout from './components/dashboard/DashboardLayout'
import DashboardHome from './pages/DashboardHome'
import AnalyticsPage from './pages/AnalyticsPage'
import KnowledgePage from './pages/KnowledgePage'
import HistoryPage from './pages/HistoryPage'
import InvestigatePage from './pages/InvestigatePage'

function App() {
  return (
    <div className="font-inter text-base leading-relaxed">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="investigate" element={<InvestigatePage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
