import { Desktop } from '@phosphor-icons/react'

function ArcGauge({ value, max, label, size = 70, color }) {
  const r = (size - 8) / 2
  const circ = Math.PI * r
  const pct = value / max
  const offset = circ * (1 - pct)

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
        <path d={`M 4 ${size/2 + 2} A ${r} ${r} 0 0 1 ${size - 4} ${size/2 + 2}`}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" strokeLinecap="round" />
        <path d={`M 4 ${size/2 + 2} A ${r} ${r} 0 0 1 ${size - 4} ${size/2 + 2}`}
          fill="none" stroke={color || 'var(--accent)'} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
      </svg>
      <div style={{ fontFamily: 'var(--font-data)', fontSize: 18, fontWeight: 600, marginTop: -6 }}>
        {Math.round(pct * 100)}%
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>{label}</div>
    </div>
  )
}

export default function SystemMonitor() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div className="section-label"><Desktop size={14} weight="duotone" style={{ marginRight: 6, opacity: 0.7 }} />System</div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <ArcGauge value={23} max={100} label="CPU" />
        <ArcGauge value={78} max={100} label="RAM" />
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-2)', marginBottom: 4 }}>
          <span>Disk</span><span style={{ fontFamily: 'var(--font-data)' }}>234 / 512 GB</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
          <div style={{ height: '100%', width: '46%', borderRadius: 2, background: 'var(--accent)', transition: 'width 1s ease-out' }} />
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
        uptime 4d 12h
      </div>
    </div>
  )
}
