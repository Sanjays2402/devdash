import { useState, useEffect } from 'react'

export default function ClockWeather() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hours = time.getHours()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  const m = time.getMinutes().toString().padStart(2, '0')
  const s = time.getSeconds().toString().padStart(2, '0')
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

  const forecast = [
    { time: '+1h', temp: '56°', icon: '☁️' },
    { time: '+2h', temp: '54°', icon: '🌙' },
    { time: '+3h', temp: '52°', icon: '🌙' },
    { time: '+4h', temp: '51°', icon: '🌙' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-data)', fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
          {h}:{m}<span style={{ fontSize: 20, color: 'var(--text-2)', marginLeft: 4 }}>{s}</span>
          <span style={{ fontSize: 18, color: 'var(--text-2)', marginLeft: 8 }}>{ampm}</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6 }}>{dateStr}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <span style={{ fontSize: 28 }}>⛅</span>
        <div>
          <div style={{ fontFamily: 'var(--font-data)', fontSize: 22, fontWeight: 600 }}>58°F</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Partly Cloudy · Bellevue, WA</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        {forecast.map((f, i) => (
          <div key={i} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{f.time}</div>
            <div style={{ fontSize: 16, margin: '2px 0' }}>{f.icon}</div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 13, fontWeight: 500 }}>{f.temp}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
