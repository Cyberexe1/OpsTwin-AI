export default function ProblemSection() {
  const stats = [
    {
      value: '47%',
      label: 'KNOWLEDGE DRAIN',
      description:
        'Of critical system knowledge is lost when a Senior Staff Engineer transitions or leaves the company.',
      color: 'text-red-400',
      hoverBorder: 'hover:border-error',
    },
    {
      value: '3.5h',
      label: 'ONBOARDING LAG',
      description:
        'Average time spent by juniors searching through old Slack threads and JIRA tickets per incident.',
      color: 'text-amber-400',
      hoverBorder: 'hover:border-amber-400',
    },
    {
      value: '92%',
      label: 'RECURRENCE RATE',
      description:
        'Of complex outages are caused by issues seen before, but resolved by someone no longer on-call.',
      color: 'text-red-400',
      hoverBorder: 'hover:border-red-400',
    },
  ]

  return (
    <section className="py-[80px] bg-surface-container" id="problem">
      <div className="max-w-[1280px] mx-auto px-[24px]">
        <h2 className="font-inter text-[40px] font-semibold leading-[1.2] text-on-surface mb-[32px] border-l-4 border-primary pl-6">
          When Expert Engineers Leave...
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mb-[32px]">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-background p-8 border border-outline-variant group ${stat.hoverBorder} transition-colors`}
            >
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant mb-4 uppercase">
                {stat.label}
              </div>
              <p className="text-on-surface-variant text-[16px] leading-[1.6]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="border-l-4 border-primary bg-background p-8">
          <p className="font-inter text-[18px] leading-[1.6] italic text-on-surface">
            "The biggest bottleneck in modern observability isn't data
            collection—it's the 'tribal knowledge' required to interpret that
            data during a P0 outage."
          </p>
          <footer className="mt-4 text-primary font-jetbrains text-[14px] font-medium tracking-[0.15em] uppercase">
            — ARCHITECT AT GLOBAL FINTECH
          </footer>
        </div>
      </div>
    </section>
  )
}
