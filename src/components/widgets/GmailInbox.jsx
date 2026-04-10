import { useState, useEffect } from 'react'
import { EnvelopeSimple } from '@phosphor-icons/react'

const API = 'http://localhost:5198'

const FALLBACK_EMAILS = [
  { sender: 'No data', initial: '?', color: '#555', subject: 'Run scripts/fetch-gmail.sh to load real inbox', time: '', unread: false },
]

export default function GmailInbox() {
  const [data, setData] = useState({ emails: FALLBACK_EMAILS, unreadCount: 0 })
  const [selected, setSelected] = useState(null)
  const [emailBody, setEmailBody] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/data/gmail.json?t=' + Date.now())
        if (res.ok) {
          const json = await res.json()
          if (json.emails?.length) setData(json)
        }
      } catch {}
    }
    load()
    const interval = setInterval(load, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const openEmail = async (email) => {
    setSelected(email)
    setEmailBody(null)
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/email?id=${email.id}`)
      if (res.ok) {
        const json = await res.json()
        setEmailBody(json)
      }
    } catch {
      setEmailBody({ ok: false, error: 'Failed to fetch email' })
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden', position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexShrink: 0 }}>
        <div className="section-label" style={{ margin: 0 }}><EnvelopeSimple size={14} weight="duotone" style={{ marginRight: 6, opacity: 0.7 }} />Inbox</div>
        <div style={{
          fontFamily: 'var(--font-data)', fontSize: 12, fontWeight: 600,
          background: data.unreadCount > 0 ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
          color: '#fff', padding: '2px 10px', borderRadius: 999,
        }}>
          {data.unreadCount} unread
        </div>
      </div>

      {/* Email list */}
      <div className="inbox-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto', minHeight: 0 }}>
        {data.emails.map((e, i) => (
          <div key={e.id || i} onClick={() => e.id && openEmail(e)} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 10,
            cursor: e.id ? 'pointer' : 'default', transition: 'all 0.15s ease-out',
          }}
            onMouseEnter={ev => ev.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: e.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 600, color: '#fff', flexShrink: 0,
            }}>
              {e.initial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: e.unread ? 700 : 500, color: e.unread ? 'var(--text-1)' : 'var(--text-2)' }}>{e.sender}</span>
                <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{e.time}</span>
              </div>
              <div style={{
                fontSize: 12,
                color: e.unread ? 'var(--text-2)' : 'var(--text-3)',
                fontWeight: e.unread ? 500 : 400,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {e.subject}
              </div>
            </div>
            {e.unread && (
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0,
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Email detail modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)',
            display: 'flex', flexDirection: 'column',
            borderRadius: 16, overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              margin: 0, padding: 20, overflow: 'hidden',
            }}
          >
            {/* Modal header */}
            <div style={{ flexShrink: 0, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 15, fontWeight: 700, marginBottom: 6,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {selected.subject}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', background: selected.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 600, color: '#fff', flexShrink: 0,
                    }}>
                      {selected.initial}
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{selected.sender}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{selected.time}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
                    width: 28, height: 28, cursor: 'pointer', color: 'var(--text-2)',
                    fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginLeft: 12,
                  }}
                >✕</button>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginTop: 14 }} />
            </div>

            {/* Modal body */}
            <div style={{
              flex: 1, overflow: 'auto', minHeight: 0,
              fontSize: 13, lineHeight: 1.65, color: 'var(--text-1)',
              fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-3)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 8, animation: 'pulse 1.5s infinite' }}>📧</div>
                    <div style={{ fontSize: 12 }}>Loading email...</div>
                  </div>
                </div>
              ) : emailBody?.ok ? (
                emailBody.body || '(empty email)'
              ) : (
                <div style={{ color: '#ff6b6b', textAlign: 'center', paddingTop: 40 }}>
                  {emailBody?.error || 'Failed to load email'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
