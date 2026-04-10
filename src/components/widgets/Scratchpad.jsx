import { useStore } from '../../store'
import { Notepad } from '@phosphor-icons/react'

export default function Scratchpad() {
  const { notes, setNotes } = useStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="section-label"><Notepad size={14} weight="duotone" style={{ marginRight: 6, opacity: 0.7 }} />Scratchpad</div>
      <div style={{ flex: 1, position: 'relative' }}>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          spellCheck={false}
          style={{
            width: '100%', height: '100%', resize: 'none', outline: 'none',
            fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.7,
            background: 'rgba(255,255,255,0.02)', color: 'var(--text-1)',
            border: '1px solid var(--border)', borderRadius: 8,
            padding: '10px 12px',
            transition: 'border-color 0.15s ease-out',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.3)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>
    </div>
  )
}
