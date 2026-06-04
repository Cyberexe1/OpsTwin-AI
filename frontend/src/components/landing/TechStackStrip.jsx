export default function TechStackStrip() {
  const items = [
    { label: 'SPLUNK MCP', icon: 'terminal', highlighted: true, border: 'border-primary/20', color: 'text-primary-container' },
    { label: 'PYTHON 3.12', icon: 'code', highlighted: false },
    { label: 'LLM REASONING', icon: 'memory', highlighted: true, border: 'border-primary', color: 'text-primary' },
    { label: 'VECTOR DB', icon: 'database', highlighted: false },
    { label: 'KUBERNETES', icon: 'lan', highlighted: false },
    { label: 'RBAC ENFORCED', icon: 'security', highlighted: true, border: 'border-primary/20', color: 'text-primary-container' },
  ]

  // Duplicate for seamless loop
  const doubled = [...items, ...items]

  return (
    <section className="py-12 bg-surface-container overflow-hidden">
      <div className="flex items-center gap-12 animate-infinite-scroll whitespace-nowrap px-[24px]">
        {doubled.map((item, i) => (
          <span
            key={`${item.label}-${i}`}
            className={`font-jetbrains text-[14px] font-medium tracking-[0.15em] uppercase flex items-center gap-2 px-4 py-2 shrink-0 ${
              item.highlighted
                ? `${item.color} border ${item.border}`
                : 'text-on-surface-variant opacity-50'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {item.icon}
            </span>
            {item.label}
          </span>
        ))}
      </div>
    </section>
  )
}
