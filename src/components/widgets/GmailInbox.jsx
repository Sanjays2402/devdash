const emails = [
  { sender: 'Chase', initial: 'C', color: '#1a73e8', subject: 'Payment of $61.22 posted to your account', time: '2h' },
  { sender: 'Fidelity', initial: 'F', color: '#4caf50', subject: '401(k) contribution confirmed — Microsoft match', time: '5h' },
  { sender: 'USPS', initial: 'U', color: '#336', subject: 'Your package is arriving today by 8:00 PM', time: '8h' },
  { sender: 'GitHub', initial: 'G', color: '#8b949e', subject: 'PR review requested: feat/recording-system', time: '1d' },
  { sender: 'LinkedIn', initial: 'L', color: '#0a66c2', subject: 'Sanjay, 3 people viewed your profile this week', time: '2d' },
]

export default function GmailInbox() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div className="section-label" style={{ margin: 0 }}>Inbox</div>
        <div style={{
          fontFamily: 'var(--font-data)', fontSize: 12, fontWeight: 600,
          background: 'var(--accent)', color: '#fff', padding: '2px 10px', borderRadius: 999,
        }}>
          12 unread
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {emails.map((e, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 10,
            cursor: 'pointer', transition: 'all 0.15s ease-out',
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
                <span style={{ fontSize: 13, fontWeight: 600 }}>{e.sender}</span>
                <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{e.time}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {e.subject}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
