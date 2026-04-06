import { useStore } from '../../store'

const NOTE_COLORS = [
  'rgba(99,102,241,0.15)',
  'rgba(16,185,129,0.15)',
  'rgba(244,63,94,0.15)',
  'rgba(245,158,11,0.15)',
  'rgba(139,92,246,0.15)',
]

const BORDER_COLORS = [
  'rgba(99,102,241,0.3)',
  'rgba(16,185,129,0.3)',
  'rgba(244,63,94,0.3)',
  'rgba(245,158,11,0.3)',
  'rgba(139,92,246,0.3)',
]

export default function QuickNotes() {
  const { quickNotes, addQuickNote, updateQuickNote, deleteQuickNote, cycleNoteColor } = useStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div className="section-label" style={{ margin: 0 }}>Quick Notes</div>
        <button
          onClick={addQuickNote}
          style={{
            width: 22, height: 22, borderRadius: 6,
            background: 'var(--accent-muted)', border: '1px solid var(--border)',
            color: 'var(--accent)', cursor: 'pointer', fontSize: 14, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s ease-out',
          }}
          title="Add note"
        >
          +
        </button>
      </div>
      <div style={{
        flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0,
      }}>
        {quickNotes.length === 0 && (
          <div style={{ color: 'var(--text-2)', fontSize: 12, textAlign: 'center', padding: 16 }}>
            No notes yet. Click + to add one.
          </div>
        )}
        {quickNotes.map(note => (
          <div
            key={note.id}
            style={{
              background: NOTE_COLORS[note.color],
              border: `1px solid ${BORDER_COLORS[note.color]}`,
              borderRadius: 8, padding: '8px 10px', position: 'relative',
              flexShrink: 0,
            }}
          >
            <textarea
              value={note.text}
              onChange={e => updateQuickNote(note.id, e.target.value)}
              placeholder="Type a note..."
              rows={2}
              style={{
                width: '100%', resize: 'none', outline: 'none',
                fontFamily: 'var(--font-ui)', fontSize: 12, lineHeight: 1.5,
                background: 'transparent', color: 'var(--text-1)',
                border: 'none', padding: 0,
              }}
            />
            <div style={{
              display: 'flex', gap: 4, justifyContent: 'flex-end', marginTop: 4,
            }}>
              <button
                onClick={() => cycleNoteColor(note.id)}
                title="Change color"
                style={{
                  width: 18, height: 18, borderRadius: 4,
                  background: 'transparent', border: 'none',
                  color: 'var(--text-2)', cursor: 'pointer', fontSize: 11,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0.6, transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
              >
                🎨
              </button>
              <button
                onClick={() => deleteQuickNote(note.id)}
                title="Delete note"
                style={{
                  width: 18, height: 18, borderRadius: 4,
                  background: 'transparent', border: 'none',
                  color: 'var(--danger)', cursor: 'pointer', fontSize: 11,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0.6, transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
