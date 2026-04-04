import { useEffect } from 'react'
import { useStore } from '../../store'

export default function Pomodoro() {
  const { pomodoroTime, pomodoroRunning, pomodoroSession, setPomodoroRunning, tickPomodoro } = useStore()

  useEffect(() => {
    if (!pomodoroRunning) return
    const id = setInterval(tickPomodoro, 1000)
    return () => clearInterval(id)
  }, [pomodoroRunning])

  const mins = Math.floor(pomodoroTime / 60).toString().padStart(2, '0')
  const secs = (pomodoroTime % 60).toString().padStart(2, '0')
  const pct = 1 - pomodoroTime / (25 * 60)

  const r = 38
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
      <div style={{ position: 'relative', width: 90, height: 90 }}>
        <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <circle cx="45" cy="45" r={r} fill="none" stroke="var(--accent)" strokeWidth="5"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }} />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-data)', fontSize: 20, fontWeight: 600,
        }}>
          {mins}:{secs}
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Session {pomodoroSession}/4</div>
      <button
        onClick={() => setPomodoroRunning(!pomodoroRunning)}
        style={{
          padding: '4px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500,
          background: pomodoroRunning ? 'rgba(255,255,255,0.06)' : 'var(--accent)',
          color: pomodoroRunning ? 'var(--text-1)' : '#fff',
          border: 'none', cursor: 'pointer', transition: 'all 0.15s ease-out',
        }}
      >
        {pomodoroRunning ? 'Pause' : 'Start'}
      </button>
    </div>
  )
}
