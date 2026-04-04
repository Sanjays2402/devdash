const events = [
  { color: '#6366f1', title: 'Team Standup', time: 'in 45m', accent: true },
  { color: '#3b82f6', title: '1:1 with Manager', time: '3:00 PM' },
  { color: '#10b981', title: 'Dentist', time: 'Tomorrow 10 AM' },
]

export default function CalendarNext() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="section-label">Next Up</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {events.map((e, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
            borderRadius: 10, background: i === 0 ? 'var(--accent-muted)' : 'transparent',
            border: i === 0 ? '1px solid rgba(99,102,241,0.15)' : '1px solid transparent',
            transition: 'all 0.15s ease-out',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{e.title}</div>
            </div>
            <div style={{
              fontSize: 11, color: i === 0 ? 'var(--accent-light)' : 'var(--text-2)',
              fontFamily: 'var(--font-data)', fontWeight: 500,
            }}>
              {e.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
