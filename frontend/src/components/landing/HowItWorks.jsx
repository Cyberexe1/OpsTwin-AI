export default function HowItWorks() {
  const steps = [
    {
      icon: 'report_problem',
      iconColor: 'text-amber-400',
      title: '1. Alert Ingestion',
      description:
        'OpsTwin monitors Splunk signals and identifies high-priority anomalies before they escalate.',
    },
    {
      icon: 'psychology',
      iconColor: 'text-primary',
      title: '2. Expert Shadowing',
      description:
        'The agent observes how your senior engineers query Splunk and interact with the MCP.',
    },
    {
      icon: 'assignment',
      iconColor: 'text-primary-container',
      title: '3. Plan Generation',
      description:
        'A resolution plan is created based on historical successes and learned reasoning paths.',
    },
    {
      icon: 'check_circle',
      iconColor: 'text-green-400',
      title: '4. Auto-Remediation',
      description:
        "OpsTwin executes the fix or provides a 'one-click' approval for human operators.",
    },
  ]

  return (
    <section className="py-[80px] bg-surface-container" id="how-it-works">
      <div className="max-w-[1280px] mx-auto px-[24px]">
        <h2 className="font-inter text-[40px] font-semibold leading-[1.2] text-on-surface text-center mb-20">
          How OpsTwin Codifies Expertise
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-[24px]">
          {steps.map((step) => (
            <div key={step.title} className="relative group">
              <div className="w-16 h-16 rounded-full bg-background border border-outline-variant flex items-center justify-center mb-6 group-hover:border-primary transition-colors">
                <span
                  className={`material-symbols-outlined ${step.iconColor} text-3xl`}
                >
                  {step.icon}
                </span>
              </div>
              <h4 className="font-inter text-[20px] font-semibold text-on-surface mb-2">
                {step.title}
              </h4>
              <p className="text-on-surface-variant text-[16px] leading-[1.6]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
