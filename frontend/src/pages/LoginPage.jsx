import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, DEMO_HINT } from '../lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await loginUser(email, password)
    setLoading(false)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  const fillDemo = () => {
    setEmail(DEMO_HINT.email)
    setPassword(DEMO_HINT.password)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary text-[40px]">
              psychology
            </span>
            <span className="font-inter text-[28px] font-bold text-on-surface">
              OpsTwin AI
            </span>
          </Link>
          <h1 className="font-inter text-[32px] font-bold text-on-surface mb-2">
            Welcome back
          </h1>
          <p className="text-on-surface-variant text-[16px]">
            Sign in to access your operational dashboard
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-8">
          {/* Demo Credentials Banner */}
          <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-jetbrains text-[12px] font-medium tracking-[0.15em] text-primary uppercase">
                Demo Credentials
              </span>
              <button
                type="button"
                onClick={fillDemo}
                className="text-[12px] text-primary font-medium hover:text-secondary transition-colors border border-primary/30 px-2 py-0.5 rounded"
              >
                Auto-fill
              </button>
            </div>
            <div className="font-jetbrains text-[13px] text-on-surface-variant space-y-1">
              <div>
                Email: <span className="text-on-surface">{DEMO_HINT.email}</span>
              </div>
              <div>
                Password: <span className="text-on-surface">{DEMO_HINT.password}</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-error-container/20 border border-error/30 rounded text-error text-[14px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block font-jetbrains text-[12px] font-medium tracking-[0.15em] text-on-surface-variant uppercase mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="engineer@company.com"
                className="w-full px-4 py-3 bg-background border border-outline-variant text-on-surface placeholder-on-surface-variant/50 font-jetbrains text-[14px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block font-jetbrains text-[12px] font-medium tracking-[0.15em] text-on-surface-variant uppercase"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-primary text-[13px] hover:text-secondary transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-background border border-outline-variant text-on-surface placeholder-on-surface-variant/50 font-jetbrains text-[14px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-container text-on-primary-container font-bold text-[16px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cyan-glow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-outline-variant"></div>
            <span className="px-4 text-on-surface-variant text-[13px]">or</span>
            <div className="flex-1 border-t border-outline-variant"></div>
          </div>

          {/* SSO Button */}
          <button className="w-full py-3 border border-outline-variant text-on-surface font-medium text-[15px] hover:bg-surface-variant/30 transition-colors flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-[20px]">key</span>
            Continue with SSO
          </button>
        </div>

        {/* Sign up link */}
        <p className="text-center mt-6 text-on-surface-variant text-[15px]">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-primary font-medium hover:text-secondary transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
