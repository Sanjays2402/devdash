import { useEffect, useState } from 'react'
import { Keyboard, X } from '@phosphor-icons/react'

const SHORTCUTS = [
  { key: '?',         desc: 'Show this help' },
  { key: '⌘ K',       desc: 'Open command palette' },
  { key: 'F',         desc: 'Toggle Focus Mode' },
  { key: 'R',         desc: 'Reset layout' },
  { key: '1 – 4',     desc: 'Cycle theme' },
  { key: 'Esc',       desc: 'Close overlays' },
  { key: 'Space',     desc: 'Pomodoro start/pause (when timer focused)' },
]

export default function ShortcutsOverlay() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(e) {
      const tag = e.target?.tagName
      const editable = tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable
      if (e.key === '?' && !editable) {
        e.preventDefault()
        setOpen(o => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!open) return null

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.15s ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="glass"
        style={{
          width: 'min(440px, 90vw)', padding: 24, borderRadius: 16,
          border: '1px solid var(--border-hover)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
            <Keyboard size={18} weight="duotone" />
            Keyboard Shortcuts
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              width: 24, height: 24, borderRadius: 6, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', color: 'var(--text-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={14} weight="bold" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {SHORTCUTS.map((s, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 12px', borderRadius: 8,
              background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 13, color: 'var(--text-1)' }}>{s.desc}</span>
              <kbd style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, padding: '2px 8px',
                borderRadius: 4, background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border)', color: 'var(--text-2)',
              }}>{s.key}</kbd>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, fontSize: 11, color: 'var(--text-3)', textAlign: 'center' }}>
          Press <kbd style={{ fontFamily: 'var(--font-mono)' }}>Esc</kbd> or click outside to close
        </div>
      </div>
    </div>
  )
}
