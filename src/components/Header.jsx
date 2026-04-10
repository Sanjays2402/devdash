import { useStore, THEMES, THEME_COLORS } from '../store'
import { Crosshair, ArrowCounterClockwise } from '@phosphor-icons/react'

export default function Header() {
  const { theme, setTheme, focusMode, toggleFocusMode, resetLayout } = useStore()

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div style={{
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 8px',
      flexShrink: 0,
    }}>
      <div style={{
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: '-0.03em',
        background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        DevDash
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontSize: 14, color: 'var(--text-1)' }}>
          {greeting}, Sanjay 👋
        </span>
        <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
          {dateStr}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Focus mode toggle */}
        <button
          onClick={toggleFocusMode}
          title={focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode (pin widgets via pin icon)'}
          style={{
            padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 500,
            fontFamily: 'var(--font-ui)',
            background: focusMode ? 'var(--accent)' : 'rgba(255,255,255,0.04)',
            color: focusMode ? '#fff' : 'var(--text-2)',
            border: focusMode ? 'none' : '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'all 0.2s ease-out',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <Crosshair size={15} weight={focusMode ? 'fill' : 'regular'} />
          <span>{focusMode ? 'Exit Focus' : 'Focus'}</span>
        </button>

        {/* Reset layout */}
        <button
          onClick={resetLayout}
          title="Reset layout to default"
          style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            color: 'var(--text-2)', cursor: 'pointer', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s ease-out',
          }}
        >
          ↺
        </button>

        {/* Theme selector */}
        {THEMES.map(t => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            style={{
              width: theme === t ? 14 : 10,
              height: theme === t ? 14 : 10,
              borderRadius: '50%',
              background: THEME_COLORS[t],
              border: theme === t ? `2px solid ${THEME_COLORS[t]}` : '2px solid transparent',
              boxShadow: theme === t ? `0 0 12px ${THEME_COLORS[t]}44` : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease-out',
              outline: 'none',
            }}
            title={t.charAt(0).toUpperCase() + t.slice(1)}
          />
        ))}
      </div>
    </div>
  )
}
