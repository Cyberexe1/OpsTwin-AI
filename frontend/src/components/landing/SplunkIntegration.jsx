export default function SplunkIntegration() {
  const features = [
    'Direct Splunk Observability Cloud metric stream access',
    'Automated SPL generation based on natural language intent',
    'Real-time dashboard updates via the MCP interface',
  ]

  const gridCards = [
    {
      label: 'MCP_LAYER_CONNECTED',
      icon: 'settings_input_component',
      border: 'border-primary cyan-glow',
      labelColor: 'text-primary',
      iconColor: 'text-primary',
    },
    {
      label: 'DATA_INGEST_OK',
      icon: 'cloud_download',
      border: 'border-outline-variant',
      labelColor: 'text-on-surface-variant',
      iconColor: 'text-on-surface-variant',
    },
    {
      label: 'AUTOSCALE_DISABLED',
      icon: 'analytics',
      border: 'border-outline-variant',
      labelColor: 'text-on-surface-variant',
      iconColor: 'text-on-surface-variant',
    },
    {
      label: 'SIGNAL_STRENGTH_99',
      icon: 'network_check',
      border: 'border-outline-variant',
      labelColor: 'text-on-surface-variant',
      iconColor: 'text-on-surface-variant',
    },
  ]

  return (
    <section className="py-[80px] bg-surface-container" id="splunk">
      <div className="max-w-[1280px] mx-auto px-[24px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div>
            <h2 className="font-inter text-[40px] font-semibold leading-[1.2] text-on-surface mb-[16px]">
              Deep Splunk Native Integration
            </h2>
            <p className="text-on-surface-variant text-[16px] leading-[1.6] mb-8">
              Built specifically for the Splunk ecosystem, leveraging the full
              power of Machine Control Protocol.
            </p>

            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                  <span className="text-on-surface text-[16px]">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex gap-4">
              <div className="p-4 bg-background border border-outline-variant rounded-lg flex items-center gap-3">
                <span className="text-2xl">🥇</span>
                <span className="font-jetbrains text-[14px] font-medium tracking-[0.15em] uppercase text-xs text-on-surface-variant">
                  Innovation Winner
                </span>
              </div>
              <div className="p-4 bg-background border border-outline-variant rounded-lg flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <span className="font-jetbrains text-[14px] font-medium tracking-[0.15em] uppercase text-xs text-on-surface-variant">
                  High Performance
                </span>
              </div>
            </div>
          </div>

          {/* Right - Grid */}
          <div className="grid grid-cols-2 gap-4">
            {gridCards.map((card) => (
              <div
                key={card.label}
                className={`bg-background border ${card.border} p-6 aspect-square flex flex-col justify-between`}
              >
                <span
                  className={`font-jetbrains text-[14px] font-medium tracking-[0.15em] uppercase text-xs ${card.labelColor}`}
                >
                  {card.label}
                </span>
                <span
                  className={`material-symbols-outlined ${card.iconColor} text-5xl`}
                >
                  {card.icon}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
