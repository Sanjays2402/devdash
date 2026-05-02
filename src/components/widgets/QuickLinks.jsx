import { useState } from 'react'
import { useStore } from '../../store'
import { Link, Plus, X } from '@phosphor-icons/react'

function faviconFor(url) {
  try {
    const u = new URL(url)
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`
  } catch { return null }
}

function deriveName(url) {
  try {
    const h = new URL(url).hostname.replace(/^www\./, '')
    return h.split('.')[0].replace(/^./, c => c.toUpperCase())
  } catch { return 'Link' }
}

const COLOR_POOL = ['#8b949e', '#ea4335', '#4285f4', '#10a37f', '#f59e0b', '#a855f7', '#ec4899', '#06b6d4']

export default function QuickLinks() {
  const { links, addLink, removeLink } = useStore()
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')

  const submit = () => {
    let url = draft.trim()
    if (!url) return
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url
    const color = COLOR_POOL[links.length % COLOR_POOL.length]
    addLink({ name: deriveName(url), url, color })
    setDraft('')
    setAdding(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="section-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Link size={14} weight="duotone" style={{ marginRight: 6, opacity: 0.7 }} />Quick Links
        </span>
        <button
          onClick={() => setAdding(a => !a)}
          title="Add link"
          style={{
            width: 18, height: 18, borderRadius: 4, border: 'none', cursor: 'pointer',
            background: adding ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
            color: adding ? '#fff' : 'var(--text-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Plus size={11} weight="bold" />
        </button>
      </div>

      {adding && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <input
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') { setAdding(false); setDraft('') } }}
            placeholder="https://example.com"
            style={{
              flex: 1, padding: '4px 8px', borderRadius: 6, fontSize: 11,
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
              color: 'var(--text-1)', outline: 'none', fontFamily: 'var(--font-mono)',
            }}
          />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, flex: 1, alignContent: 'center' }}>
        {links.map((l, i) => (
          <div key={i} style={{ position: 'relative' }} className="ql-tile">
            <a href={l.url} target="_blank" rel="noopener" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '10px 6px', borderRadius: 10, textDecoration: 'none',
              background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
              transition: 'all 0.15s ease-out', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: l.color + '22',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 600, color: l.color, overflow: 'hidden',
              }}>
                {faviconFor(l.url) ? (
                  <img
                    src={faviconFor(l.url)}
                    alt=""
                    width="18" height="18"
                    style={{ display: 'block' }}
                    onError={e => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (l.name[0] || '?')}
              </div>
              <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-2)' }}>{l.name}</span>
            </a>
            <button
              onClick={() => removeLink(i)}
              title="Remove"
              className="ql-remove"
              style={{
                position: 'absolute', top: 2, right: 2, width: 14, height: 14, borderRadius: 4,
                border: 'none', background: 'rgba(0,0,0,0.4)', color: 'var(--text-2)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0,
              }}
            >
              <X size={9} weight="bold" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
