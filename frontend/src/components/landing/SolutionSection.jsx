export default function SolutionSection() {
  return (
    <section className="py-[80px] bg-background" id="solution">
      <div className="max-w-[1280px] mx-auto px-[24px]">
        <div className="text-center mb-20">
          <h2 className="font-inter text-[40px] font-semibold leading-[1.2] text-on-surface mb-[16px]">
            The OpsTwin Evolution
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-[16px] leading-[1.6]">
            We don't just alert you. We capture the{' '}
            <strong className="text-on-surface">intent</strong> of your best
            responders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Before Card */}
          <div className="bg-surface-container border border-outline-variant p-8 relative overflow-hidden opacity-80">
            <div className="absolute top-4 right-4 text-red-500 font-jetbrains text-[14px] font-medium tracking-[0.15em] uppercase text-xs">
              TRADITIONAL OBS
            </div>
            <h3 className="font-inter text-[24px] font-semibold leading-[1.4] text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-400">
                warning
              </span>
              The Siloed Present
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-on-surface-variant">
                <span className="text-red-400 mt-1">✕</span>
                <span>Dashboards require manual expert interpretation</span>
              </li>
              <li className="flex items-start gap-3 text-on-surface-variant">
                <span className="text-red-400 mt-1">✕</span>
                <span>Incident context dies in closed DM threads</span>
              </li>
              <li className="flex items-start gap-3 text-on-surface-variant">
                <span className="text-red-400 mt-1">✕</span>
                <span>On-call fatigue leads to high turnover</span>
              </li>
            </ul>
          </div>

          {/* After Card */}
          <div className="bg-surface-container border border-primary p-8 relative overflow-hidden cyan-glow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl"></div>
            <div className="absolute top-4 right-4 text-primary font-jetbrains text-[14px] font-medium tracking-[0.15em] uppercase text-xs">
              OPSTWIN AI
            </div>
            <h3 className="font-inter text-[24px] font-semibold leading-[1.4] text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                auto_awesome
              </span>
              The Agentic Future
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-on-surface">
                <span className="text-primary mt-1">✓</span>
                <span>
                  Digital Twins shadow and learn from expert behavior
                </span>
              </li>
              <li className="flex items-start gap-3 text-on-surface">
                <span className="text-primary mt-1">✓</span>
                <span>
                  Splunk MCP provides direct agent-to-tool actionability
                </span>
              </li>
              <li className="flex items-start gap-3 text-on-surface">
                <span className="text-primary mt-1">✓</span>
                <span>Knowledge is codified, not just documented</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
