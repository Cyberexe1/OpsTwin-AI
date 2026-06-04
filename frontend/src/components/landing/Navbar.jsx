import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant">
      <div className="flex justify-between items-center px-[24px] py-[16px] max-w-[1280px] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-[8px]">
          <span className="material-symbols-outlined text-primary text-[32px]">
            psychology
          </span>
          <span className="font-inter text-[24px] font-bold text-on-surface leading-[1.4]">
            OpsTwin AI
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-[24px]">
          <a
            className="text-on-surface-variant text-[16px] hover:text-primary transition-colors duration-200"
            href="#problem"
          >
            Problem
          </a>
          <a
            className="text-on-surface-variant text-[16px] hover:text-primary transition-colors duration-200"
            href="#solution"
          >
            Solution
          </a>
          <a
            className="text-on-surface-variant text-[16px] hover:text-primary transition-colors duration-200"
            href="#how-it-works"
          >
            How It Works
          </a>
          <a
            className="text-on-surface-variant text-[16px] hover:text-primary transition-colors duration-200"
            href="#architecture"
          >
            Architecture
          </a>
          <a
            className="text-on-surface-variant text-[16px] hover:text-primary transition-colors duration-200"
            href="#splunk"
          >
            Splunk
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2 border border-outline-variant text-on-surface font-medium text-[15px] hover:border-primary hover:text-primary transition-colors duration-200"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 bg-primary-container text-on-primary-container font-bold text-[15px] hover:scale-105 active:scale-95 transition-all duration-200 cyan-glow"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}
