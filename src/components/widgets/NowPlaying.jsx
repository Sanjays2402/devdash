import { useState, useEffect, useRef, useCallback } from 'react'

const API = 'http://localhost:5199'

export default function NowPlaying() {
  const [data, setData] = useState(null)
  const [localPos, setLocalPos] = useState(0)
  const lastFetch = useRef(Date.now())

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/data/spotify.json?t=' + Date.now())
      if (res.ok) {
        const json = await res.json()
        setData(json)
        if (json.track) setLocalPos(json.track.positionMs)
        lastFetch.current = Date.now()
      }
    } catch {}
  }, [])

  useEffect(() => {
    fetchState()
    const id = setInterval(fetchState, 3000)
    return () => clearInterval(id)
  }, [fetchState])

  // Tick local position when playing
  useEffect(() => {
    if (!data || data.state !== 'playing') return
    const id = setInterval(() => {
      setLocalPos(p => {
        const max = data.track?.durationMs || 0
        return Math.min(p + 1000, max)
      })
    }, 1000)
    return () => clearInterval(id)
  }, [data])

  const control = async (action) => {
    try {
      await fetch(`${API}/${action}`, { method: 'POST' })
      setTimeout(fetchState, 500)
    } catch {}
  }

  const fmt = (ms) => {
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
  }

  if (!data || !data.track) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>🎵</div>
          <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Nothing playing</div>
          <button
            onClick={() => control('play')}
            style={{
              marginTop: 12, padding: '6px 16px', borderRadius: 999,
              background: 'var(--accent)', border: 'none', color: '#fff',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            ▶ Play
          </button>
        </div>
      </div>
    )
  }

  const { track, state, shuffle, repeat: rep } = data
  const progress = localPos / (track.durationMs || 1)
  const isPlaying = state === 'playing'

  return (
    <div style={{ display: 'flex', gap: 20, height: '100%', alignItems: 'center' }}>
      {/* Album art */}
      <div style={{
        width: 100, height: 100, borderRadius: 12, flexShrink: 0,
        overflow: 'hidden', position: 'relative',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
      }}>
        <img
          src={track.artUrl}
          alt={track.album}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {isPlaying && (
          <div style={{
            position: 'absolute', bottom: 6, right: 6,
            width: 20, height: 20, borderRadius: '50%',
            background: 'var(--accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 10px var(--accent-glow)',
          }}>
            <span style={{ fontSize: 8, color: '#fff' }}>♪</span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, minWidth: 0 }}>
        <div>
          <div style={{
            fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {track.name}
          </div>
          <div style={{
            fontSize: 13, color: 'var(--text-2)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {track.artist} — {track.album}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', position: 'relative' }}>
            <div style={{
              height: '100%', borderRadius: 2, width: `${progress * 100}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--accent-light))',
              transition: 'width 1s linear',
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 4,
            fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)',
          }}>
            <span>{fmt(localPos)}</span>
            <span>{fmt(track.durationMs)}</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 2 }}>
          <button
            onClick={() => control('shuffle')}
            title="Shuffle"
            style={{
              background: 'none', border: 'none', fontSize: 14, cursor: 'pointer',
              color: shuffle ? 'var(--accent)' : 'var(--text-3)',
              opacity: shuffle ? 1 : 0.5,
            }}
          >🔀</button>
          <button
            onClick={() => control('prev')}
            style={{ background: 'none', border: 'none', color: 'var(--text-2)', fontSize: 16, cursor: 'pointer' }}
          >⏮</button>
          <button
            onClick={() => control('toggle')}
            style={{
              width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)',
              border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px var(--accent-glow)',
            }}
          >{isPlaying ? '⏸' : '▶'}</button>
          <button
            onClick={() => control('next')}
            style={{ background: 'none', border: 'none', color: 'var(--text-2)', fontSize: 16, cursor: 'pointer' }}
          >⏭</button>
          <button
            onClick={() => control('repeat')}
            title="Repeat"
            style={{
              background: 'none', border: 'none', fontSize: 14, cursor: 'pointer',
              color: rep ? 'var(--accent)' : 'var(--text-3)',
              opacity: rep ? 1 : 0.5,
            }}
          >🔁</button>
        </div>
      </div>
    </div>
  )
}
