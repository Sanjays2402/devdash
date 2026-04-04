const stories = [
  { title: 'Show HN: DevDash — personal dev dashboard', domain: 'github.com', points: 342 },
  { title: 'Why I stopped using RAG and switched to INDEX.md', domain: 'blog.karpathy.ai', points: 289 },
  { title: 'Claude Opus 4.6 system prompt leaked', domain: 'reddit.com', points: 201 },
  { title: 'The best Git workflow nobody talks about', domain: 'mtlynch.io', points: 156 },
]

export default function HackerNews() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="section-label" style={{ color: '#f97316' }}>🔶 HN Top</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {stories.map((s, i) => (
          <div key={i} style={{ cursor: 'pointer', transition: 'all 0.15s ease-out' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.4 }}>{s.title}</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', display: 'flex', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-data)', color: '#f97316' }}>{s.points} pts</span>
              <span>{s.domain}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
