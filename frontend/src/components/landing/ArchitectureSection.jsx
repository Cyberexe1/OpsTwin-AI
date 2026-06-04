export default function ArchitectureSection() {
  const agents = [
    {
      icon: 'history',
      iconColor: 'text-primary',
      title: 'Historian Agent',
      description: 'Parses historical RFOs and Splunk query logs.',
    },
    {
      icon: 'hub',
      iconColor: 'text-purple-400',
      title: 'Expert Twin Agent',
      description: 'Replicates learned logic paths of specific users.',
    },
    {
      icon: 'gavel',
      iconColor: 'text-amber-400',
      title: 'Risk Assessment',
      description: 'Validates remediation plans against safety rules.',
    },
  ]

  return (
    <section className="py-[80px] bg-background" id="architecture">
      <div className="max-w-[1280px] mx-auto px-[24px] text-center">
        <h2 className="font-inter text-[40px] font-semibold leading-[1.2] text-on-surface mb-20">
          The Agentic Architecture
        </h2>

        <div className="relative flex flex-col items-center">
          {/* Top Node - MCP Server */}
          <div className="z-10 bg-primary/5 border border-primary px-8 py-4 rounded-lg mb-12 cyan-glow">
            <span className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-primary uppercase">
              Splunk MCP Server
            </span>
          </div>

          {/* Connector */}
          <div className="w-1 h-12 dashed-connector mb-0"></div>

          {/* Agent Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full max-w-5xl mb-12">
            {agents.map((agent) => (
              <div
                key={agent.title}
                className="bg-surface-container border border-outline-variant p-6 rounded-lg text-center hover:scale-105 transition-transform"
              >
                <span
                  className={`material-symbols-outlined ${agent.iconColor} text-4xl mb-4 block`}
                >
                  {agent.icon}
                </span>
                <h5 className="font-bold text-on-surface mb-2">
                  {agent.title}
                </h5>
                <p className="text-sm text-on-surface-variant">
                  {agent.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Connectors */}
          <div className="flex justify-around w-full max-w-5xl h-12">
            <div className="w-1 dashed-connector"></div>
            <div className="w-1 dashed-connector"></div>
            <div className="w-1 dashed-connector"></div>
          </div>

          {/* Resolution Planner */}
          <div className="z-10 bg-surface-container border border-outline-variant px-12 py-6 rounded-lg">
            <h5 className="font-inter text-[24px] font-semibold leading-[1.4] text-on-surface">
              Resolution Planner
            </h5>
            <p className="text-on-surface-variant">
              Synthesizes agent data into actionable Splunk search strings.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
