import { useState, useEffect } from 'react'

export default function NowPlaying() {
  const [progress, setProgress] = useState(154) // 2:34 in seconds
  const total = 202 // 3:22

  useEffect(() => {
    const id = setInterval(() => setProgress(p => p < total ? p + 1 : 0), 1000)
    return () => clearInterval(id)
  }, [])

  const fmt = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`

  return (
    <div style={{ display: 'flex', gap: 20, height: '100%', alignItems: 'center' }}>
      {/* Album art */}
      <div style={{
        width: 100, height: 100, borderRadius: 12, flexShrink: 0,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        boxShadow: '0 8px 30px rgba(118,75,162,0.3)',
      }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>Blinding Lights</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)' }}>The Weeknd</div>
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', position: 'relative' }}>
            <div style={{
              height: '100%', borderRadius: 2, width: `${(progress/total)*100}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--accent-light))',
              transition: 'width 1s linear',
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 4,
            fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)',
          }}>
            <span>{fmt(progress)}</span>
            <span>{fmt(total)}</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 4 }}>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-2)', fontSize: 16, cursor: 'pointer' }}>⏮</button>
          <button style={{
            width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)',
            border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px var(--accent-glow)',
          }}>⏸</button>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-2)', fontSize: 16, cursor: 'pointer' }}>⏭</button>
        </div>
      </div>
    </div>
  )
}
