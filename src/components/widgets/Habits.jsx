import { useStore } from '../../store'

export default function Habits() {
  const { habits, toggleHabit, habitStreak, habitHistory } = useStore()
  const done = habits.filter(h => h.done).length
  const total = habits.length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const allDone = total > 0 && done === total

  // Last 7 days, oldest → newest
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const key = d.toDateString()
    days.push({
      key,
      label: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      pct: habitHistory?.[key] ?? 0,
      isToday: i === 0,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Habits</span>
        <span style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-data)' }}>
          {habitStreak > 0 && <span style={{ color: 'var(--accent)' }}>🔥 {habitStreak}d </span>}
          {done}/{total}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.05)',
        marginBottom: 10, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: allDone ? 'var(--accent)' : 'var(--accent-muted, var(--accent))',
          transition: 'width 0.25s ease-out',
        }} />
      </div>

      {/* Habit list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflow: 'auto', minHeight: 0 }}>        {habits.map(h => (
          <button
            key={h.id}
            onClick={() => toggleHabit(h.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '6px 8px', borderRadius: 6,
              background: h.done ? 'rgba(255,255,255,0.04)' : 'transparent',
              border: '1px solid transparent',
              cursor: 'pointer', textAlign: 'left',
              transition: 'background 0.12s ease-out',
            }}
            onMouseEnter={e => { if (!h.done) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
            onMouseLeave={e => { if (!h.done) e.currentTarget.style.background = 'transparent' }}
          >
            <div style={{
              width: 16, height: 16, borderRadius: 4,
              border: h.done ? 'none' : '1.5px solid var(--border)',
              background: h.done ? 'var(--accent)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.15s ease-out',
            }}>
              {h.done && (
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L6.5 11.5L13 5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{
              fontSize: 12, color: h.done ? 'var(--text-2)' : 'var(--text-1)',
              textDecoration: h.done ? 'line-through' : 'none',
              flex: 1, fontWeight: 500,
            }}>
              {h.name}
            </span>
          </button>
        ))}
      </div>

      {/* 7-day heatmap */}
      <div style={{ display: 'flex', gap: 4, marginTop: 10, justifyContent: 'space-between' }}>
        {days.map(d => {
          const intensity = d.pct
          const bg = intensity === 0
            ? 'rgba(255,255,255,0.04)'
            : `color-mix(in srgb, var(--accent) ${Math.round(intensity * 100)}%, transparent)`
          return (
            <div key={d.key} title={`${d.key}: ${Math.round(intensity * 100)}%`}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
            >
              <div style={{
                width: '100%', height: 14, borderRadius: 3,
                background: bg,
                border: d.isToday ? '1px solid var(--accent)' : '1px solid var(--border)',
              }} />
              <span style={{ fontSize: 9, color: d.isToday ? 'var(--accent)' : 'var(--text-3)', fontFamily: 'var(--font-data)' }}>
                {d.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
