import { useState, useMemo } from 'react'
import { useStore } from '../../store'
import { Notepad, Eye, PencilSimple } from '@phosphor-icons/react'

// Tiny zero-dep markdown renderer (safe-ish: escapes HTML first, then formats).
// Supports: headings, bold, italic, inline code, code blocks, links, lists, blockquotes, hr.
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderMarkdown(src) {
  let s = escapeHtml(src)
  // Code fences
  s = s.replace(/```([\s\S]*?)```/g, (_, code) =>
    `<pre style="background:rgba(255,255,255,0.04);padding:8px 10px;border-radius:6px;overflow:auto;font-family:var(--font-mono);font-size:11px;margin:6px 0;">${code.trim()}</pre>`
  )
  // Headings
  s = s.replace(/^### (.+)$/gm, '<h3 style="font-size:13px;margin:8px 0 4px;color:var(--text-1);font-weight:600;">$1</h3>')
  s = s.replace(/^## (.+)$/gm, '<h2 style="font-size:15px;margin:10px 0 6px;color:var(--text-1);font-weight:600;">$1</h2>')
  s = s.replace(/^# (.+)$/gm, '<h1 style="font-size:17px;margin:12px 0 8px;color:var(--text-1);font-weight:700;">$1</h1>')
  // Horizontal rule
  s = s.replace(/^---+$/gm, '<hr style="border:none;border-top:1px solid var(--border);margin:8px 0;">')
  // Blockquote
  s = s.replace(/^&gt; (.+)$/gm, '<blockquote style="border-left:2px solid var(--accent);padding-left:8px;color:var(--text-2);margin:4px 0;">$1</blockquote>')
  // Inline code
  s = s.replace(/`([^`\n]+)`/g, '<code style="background:rgba(255,255,255,0.06);padding:1px 4px;border-radius:3px;font-family:var(--font-mono);font-size:11px;">$1</code>')
  // Bold + italic
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  // Links
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener" style="color:var(--accent);">$1</a>')
  // Bullet lists
  s = s.replace(/(^|\n)((?:- .+(?:\n|$))+)/g, (_m, lead, block) => {
    const items = block.trim().split('\n').map(line => `<li>${line.replace(/^- /, '')}</li>`).join('')
    return `${lead}<ul style="padding-left:18px;margin:4px 0;">${items}</ul>`
  })
  // Paragraphs (collapse runs of newlines)
  s = s.split(/\n{2,}/).map(p => /^<(h\d|ul|pre|hr|blockquote)/.test(p) ? p : `<p style="margin:4px 0;">${p.replace(/\n/g, '<br>')}</p>`).join('')
  return s
}

export default function Scratchpad() {
  const { notes, setNotes } = useStore()
  const [preview, setPreview] = useState(false)
  const html = useMemo(() => renderMarkdown(notes), [notes])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Notepad size={14} weight="duotone" style={{ marginRight: 6, opacity: 0.7 }} />Scratchpad
        </span>
        <button
          onClick={() => setPreview(p => !p)}
          title={preview ? 'Edit' : 'Preview markdown'}
          style={{
            width: 22, height: 18, borderRadius: 4, border: 'none', cursor: 'pointer',
            background: preview ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
            color: preview ? '#fff' : 'var(--text-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {preview ? <PencilSimple size={11} weight="bold" /> : <Eye size={11} weight="bold" />}
        </button>
      </div>
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        {preview ? (
          <div
            style={{
              width: '100%', height: '100%', overflow: 'auto',
              fontFamily: 'var(--font-ui)', fontSize: 12, lineHeight: 1.6,
              background: 'rgba(255,255,255,0.02)', color: 'var(--text-1)',
              border: '1px solid var(--border)', borderRadius: 8,
              padding: '10px 12px',
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
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
        )}
      </div>
    </div>
  )
}
