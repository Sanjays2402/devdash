import { useStore, THEMES, THEME_COLORS } from '../store'

export default function Header() {
  const { theme, setTheme } = useStore()

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
        background: `linear-gradient(135deg, var(--accent), var(--accent-light))`,
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
        <span style={{ marginLeft: 8, fontSize: 16, color: 'var(--text-2)', cursor: 'pointer' }}>⚙</span>
      </div>
    </div>
  )
}
