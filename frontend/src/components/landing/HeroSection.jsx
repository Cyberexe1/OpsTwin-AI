import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const terminalData = [
  { text: '$ opstwin investigate alert_id=392-B', color: 'text-on-surface' },
  { text: "⠋ Analyzing Splunk logs for service 'checkout-api'...", color: 'text-amber-400' },
  { text: '✔ Anomalous spike detected in DB connection pool (98.2%)', color: 'text-primary' },
  { text: '⠋ Consulting Historical Expert: Senior_Dave.twin...', color: 'text-amber-400' },
  { text: "✔ Dave's previous resolution (Oct 22): Recalibrate pool size", color: 'text-primary' },
  { text: 'Proposed Plan:', color: 'text-primary-container', weight: 'bold' },
  { text: '1. Increase max_connections to 250 via MCP control', color: 'text-primary' },
  { text: '2. Trigger Splunk re-indexing for affected pods', color: 'text-primary' },
  { text: '3. Verify MTTR metrics', color: 'text-primary' },
  { text: '$ Ready for approval? (y/n)_', color: 'text-on-surface' },
]

export default function HeroSection() {
  const [lines, setLines] = useState([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [started, setStarted] = useState(false)
  const terminalRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.1 }
    )
    if (terminalRef.current) observer.observe(terminalRef.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started || currentLine >= terminalData.length) return

    const line = terminalData[currentLine]
    if (currentChar < line.text.length) {
      const timer = setTimeout(() => {
        setLines((prev) => {
          const updated = [...prev]
          if (updated.length <= currentLine) {
            updated.push({ ...line, displayText: '' })
          }
          updated[currentLine] = {
            ...line,
            displayText: line.text.slice(0, currentChar + 1),
          }
          return updated
        })
        setCurrentChar((c) => c + 1)
      }, 40)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setCurrentLine((l) => l + 1)
        setCurrentChar(0)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [started, currentLine, currentChar])

  return (
    <section className="relative pt-40 pb-20 hero-radial overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none"></div>
      <div className="max-w-[1280px] mx-auto px-[24px] text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/30 bg-primary/5 mb-[32px] transition-all hover:border-primary/60">
          <span className="text-primary text-[18px]">🏆</span>
          <span className="font-jetbrains text-[14px] font-medium tracking-[0.15em] text-primary uppercase">
            Splunk Agentic Ops Hackathon 2025
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-inter text-[48px] md:text-[72px] font-bold text-on-surface mb-[16px] max-w-4xl mx-auto leading-[1.1] tracking-[-0.02em]">
          Your Best Engineers Leave.
          <br />
          <span className="text-primary-container">Their Expertise Shouldn't.</span>
        </h1>

        {/* Subheadline */}
        <p className="font-inter text-[18px] leading-[1.6] text-on-surface-variant max-w-2xl mx-auto mb-10">
          OpsTwin AI creates Digital Operational Twins that shadow your experts,
          learn their investigation patterns, and resolve incidents autonomously
          using Splunk MCP.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20">
          <Link to="/signup" className="w-full md:w-auto px-8 py-4 bg-primary-container text-on-primary-container font-bold text-lg hover:scale-105 transition-transform cyan-glow text-center">
            Start Investigation
          </Link>
          <a href="#architecture" className="w-full md:w-auto px-8 py-4 border border-outline-variant text-on-surface font-bold text-lg hover:bg-surface-container transition-colors text-center">
            Watch Demo
          </a>
        </div>

        {/* Terminal */}
        <div className="max-w-4xl mx-auto bg-surface-container border border-outline-variant rounded-lg overflow-hidden shadow-2xl">
          <div className="bg-surface-variant px-4 py-2 flex items-center justify-between border-b border-outline-variant">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-primary/50"></div>
            </div>
            <span className="font-jetbrains text-[12px] font-medium tracking-[0.15em] text-on-surface-variant uppercase">
              opstwin-agent-v1.0.4 --bash
            </span>
          </div>
          <div
            ref={terminalRef}
            className="p-6 text-left font-jetbrains text-[13px] leading-[1.5] min-h-[320px] bg-background"
          >
            <div className="space-y-2">
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={`${line.color} ${line.weight === 'bold' ? 'font-bold' : ''}`}
                >
                  {line.displayText}
                  {i === currentLine && currentLine < terminalData.length && (
                    <span className="cursor-blink"></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
