import { useEffect, useRef, useState } from 'react'

function CountUp({ target, color }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let current = 0
    const step = target / 50
    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        setValue(target)
        clearInterval(timer)
      } else {
        setValue(Math.floor(current))
      }
    }, 30)
    return () => clearInterval(timer)
  }, [started, target])

  return (
    <div ref={ref} className={`text-5xl font-bold ${color} mb-2`}>
      {value}
    </div>
  )
}

export default function ImpactMetrics() {
  return (
    <section className="py-[80px] bg-background" id="impact">
      <div className="max-w-[1280px] mx-auto px-[24px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[24px] text-center">
          <div>
            <CountUp target={47} color="text-primary" />
            <div className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase text-sm">
              % MTTR REDUCTION
            </div>
          </div>
          <div>
            <CountUp target={92} color="text-secondary" />
            <div className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase text-sm">
              % ACCURACY RATE
            </div>
          </div>
          <div>
            <div className="text-5xl font-bold text-purple-400 mb-2">500+</div>
            <div className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase text-sm">
              SPLUNK NODES
            </div>
          </div>
          <div>
            <div className="text-5xl font-bold text-amber-400 mb-2">3x</div>
            <div className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-on-surface-variant uppercase text-sm">
              TEAM VELOCITY
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
