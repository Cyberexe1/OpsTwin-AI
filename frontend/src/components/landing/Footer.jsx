export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest py-[80px] border-t border-outline-variant">
      <div className="max-w-[1280px] mx-auto px-[24px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mb-20">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-[28px]">
                psychology
              </span>
              <span className="font-inter text-[24px] font-bold text-primary leading-[1.4]">
                OpsTwin AI
              </span>
            </div>
            <p className="text-on-surface-variant max-w-xs text-[16px] leading-[1.6]">
              Next-generation agentic operations for the modern enterprise.
              Built for the Splunk Hackathon 2025.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h6 className="font-bold text-on-surface mb-6">Platform</h6>
            <ul className="space-y-3">
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Splunk MCP Guide
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Architecture Whitepaper
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h6 className="font-bold text-on-surface mb-6">Connect</h6>
            <ul className="space-y-3">
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Join Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-[32px] border-t border-outline-variant gap-4">
          <div className="text-on-surface-variant text-sm">
            © 2025 OpsTwin AI. Built for the Splunk Hackathon.
          </div>
          <div className="flex gap-6">
            <a
              className="text-sm text-on-surface-variant hover:text-secondary transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-sm text-on-surface-variant hover:text-secondary transition-colors"
              href="#"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
