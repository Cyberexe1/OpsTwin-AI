import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: integrate with backend auth
    console.log('Signup:', { name, email, password })
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
            Create your account
          </h1>
          <p className="text-on-surface-variant text-[16px]">
            Start preserving your team's operational expertise
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block font-jetbrains text-[12px] font-medium tracking-[0.15em] text-on-surface-variant uppercase mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Alex Chen"
                className="w-full px-4 py-3 bg-background border border-outline-variant text-on-surface placeholder-on-surface-variant/50 font-jetbrains text-[14px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="signup-email"
                className="block font-jetbrains text-[12px] font-medium tracking-[0.15em] text-on-surface-variant uppercase mb-2"
              >
                Email Address
              </label>
              <input
                id="signup-email"
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
              <label
                htmlFor="signup-password"
                className="block font-jetbrains text-[12px] font-medium tracking-[0.15em] text-on-surface-variant uppercase mb-2"
              >
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 bg-background border border-outline-variant text-on-surface placeholder-on-surface-variant/50 font-jetbrains text-[14px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block font-jetbrains text-[12px] font-medium tracking-[0.15em] text-on-surface-variant uppercase mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-background border border-outline-variant text-on-surface placeholder-on-surface-variant/50 font-jetbrains text-[14px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1 w-4 h-4 bg-background border border-outline-variant accent-primary-container"
              />
              <label
                htmlFor="terms"
                className="text-on-surface-variant text-[13px] leading-[1.5]"
              >
                I agree to the{' '}
                <a href="#" className="text-primary hover:text-secondary">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:text-secondary">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-primary-container text-on-primary-container font-bold text-[16px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cyan-glow"
            >
              Create Account
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
            Sign up with SSO
          </button>
        </div>

        {/* Login link */}
        <p className="text-center mt-6 text-on-surface-variant text-[15px]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary font-medium hover:text-secondary transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
