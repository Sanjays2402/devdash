import { useStore } from '../../store'

export default function QuickLinks() {
  const { links } = useStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="section-label">Quick Links</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, flex: 1, alignContent: 'center' }}>
        {links.map((l, i) => (
          <a key={i} href={l.url} target="_blank" rel="noopener" style={{
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
              fontSize: 14, fontWeight: 600, color: l.color,
            }}>
              {l.name[0]}
            </div>
            <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-2)' }}>{l.name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
