export default function GitHubStreak() {
  const days = Array.from({ length: 30 }, (_, i) => {
    const r = Math.random()
    return r > 0.7 ? 3 : r > 0.4 ? 2 : r > 0.2 ? 1 : 0
  })

  const levelColor = (l) => {
    if (l === 0) return 'rgba(255,255,255,0.04)'
    if (l === 1) return 'var(--accent-muted)'
    if (l === 2) return 'rgba(99,102,241,0.3)'
    return 'var(--accent)'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 48, fontWeight: 700, color: 'var(--accent)' }}>4</span>
        <span style={{ fontSize: 20 }}>🔥</span>
        <span style={{ fontSize: 13, color: 'var(--text-2)', marginLeft: 4 }}>day streak</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, margin: '10px 0' }}>
        {days.map((d, i) => (
          <div key={i} style={{
            width: 12, height: 12, borderRadius: 2,
            background: levelColor(d),
            transition: 'all 0.2s ease-out',
          }} />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: 13, color: 'var(--success)' }}>✅ Today: 5 commits</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          feat: add preset thumbnails...
        </div>
      </div>
    </div>
  )
}
