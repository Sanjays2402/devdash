import { useEffect, useMemo, useState } from 'react'
import { useStore, THEMES } from '../store'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { WIDGET_IDS } from '../widgetConfig'

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const { setTheme, toggleFocusMode, resetLayout, addQuickNote, setPomodoroRunning, pomodoroRunning } = useStore()

  // Keyboard: Cmd/Ctrl+K to open, Esc to close
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setOpen(o => !o)
        setQuery('')
        setActive(0)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const commands = useMemo(() => {
    const list = [
      { id: 'focus', label: 'Toggle Focus Mode', group: 'View', run: () => toggleFocusMode() },
      { id: 'reset', label: 'Reset layout', group: 'View', run: () => resetLayout() },
      { id: 'note', label: 'Add quick note', group: 'Notes', run: () => addQuickNote() },
      { id: 'pomo-toggle', label: pomodoroRunning ? 'Pause pomodoro' : 'Start pomodoro', group: 'Pomodoro', run: () => setPomodoroRunning(!pomodoroRunning) },
    ]
    for (const t of THEMES) {
      list.push({ id: `theme-${t}`, label: `Theme: ${t}`, group: 'Theme', run: () => setTheme(t) })
    }
    for (const w of WIDGET_IDS) {
      list.push({
        id: `scroll-${w}`,
        label: `Jump to widget: ${w}`,
        group: 'Widget',
        run: () => {
          const el = document.querySelector(`[data-widget-id="${w}"], .react-grid-item:has([data-widget-id="${w}"])`)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        },
      })
    }
    return list
  }, [toggleFocusMode, resetLayout, addQuickNote, setPomodoroRunning, pomodoroRunning, setTheme])

  const q = query.trim().toLowerCase()
  const filtered = q
    ? commands.filter(c => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q))
    : commands

  // Reset highlight when filter changes
  useEffect(() => { setActive(0) }, [query])

  if (!open) return null

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(filtered.length - 1, a + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a - 1)) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      const c = filtered[active]
      if (c) { c.run(); setOpen(false) }
    }
  }

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '15vh', animation: 'fadeIn 0.12s ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="glass"
        style={{
          width: 'min(520px, 92vw)', borderRadius: 14,
          border: '1px solid var(--border-hover)', overflow: 'hidden',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 14px', borderBottom: '1px solid var(--border)',
        }}>
          <MagnifyingGlass size={16} weight="bold" style={{ color: 'var(--text-2)' }} />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a command…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text-1)', fontSize: 14, fontFamily: 'var(--font-ui)',
            }}
          />
          <kbd style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 6px',
            borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: 'var(--text-2)',
          }}>Esc</kbd>
        </div>

        <div style={{ maxHeight: '50vh', overflowY: 'auto', padding: 6 }}>
          {filtered.length === 0 && (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-2)', fontSize: 12 }}>
              No commands match.
            </div>
          )}
          {filtered.map((c, i) => (
            <div
              key={c.id}
              onMouseEnter={() => setActive(i)}
              onClick={() => { c.run(); setOpen(false) }}
              style={{
                padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: i === active ? 'var(--accent-muted)' : 'transparent',
                color: i === active ? 'var(--text-1)' : 'var(--text-2)',
                fontSize: 13,
              }}
            >
              <span>{c.label}</span>
              <span style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {c.group}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
