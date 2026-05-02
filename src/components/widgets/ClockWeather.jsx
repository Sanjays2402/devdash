import { useState, useEffect } from 'react'

// Coordinates and label come from env (see .env.example).
// Defaults to Greenwich, UK.
const LAT = parseFloat(import.meta.env.VITE_WEATHER_LAT || '51.4779')
const LON = parseFloat(import.meta.env.VITE_WEATHER_LON || '-0.0015')
const LOCATION = import.meta.env.VITE_WEATHER_LOCATION || 'Greenwich'

// WMO weather codes → emoji + label
// https://open-meteo.com/en/docs#weather_variable_documentation
function wmoToIcon(code, isDay) {
  if (code === 0) return isDay ? { icon: '☀️', label: 'Clear' } : { icon: '🌙', label: 'Clear' }
  if (code <= 2) return isDay ? { icon: '⛅', label: 'Partly Cloudy' } : { icon: '☁️', label: 'Partly Cloudy' }
  if (code === 3) return { icon: '☁️', label: 'Overcast' }
  if (code <= 49) return { icon: '🌫️', label: 'Fog' }
  if (code <= 57) return { icon: '🌦️', label: 'Drizzle' }
  if (code <= 67) return { icon: '🌧️', label: 'Rain' }
  if (code <= 77) return { icon: '🌨️', label: 'Snow' }
  if (code <= 82) return { icon: '🌧️', label: 'Showers' }
  if (code <= 86) return { icon: '🌨️', label: 'Snow Showers' }
  if (code <= 99) return { icon: '⛈️', label: 'Thunderstorm' }
  return { icon: '☁️', label: 'Cloudy' }
}

const cToF = c => Math.round(c * 9 / 5 + 32)

export default function ClockWeather() {
  const [time, setTime] = useState(new Date())
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
          `&current=temperature_2m,weather_code,is_day&hourly=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit&forecast_days=1&timezone=auto`
        const r = await fetch(url)
        if (!r.ok) throw new Error('weather fetch failed')
        const d = await r.json()
        if (cancelled) return
        const cur = d.current
        setWeather({
          temp: Math.round(cur.temperature_2m),
          ...wmoToIcon(cur.weather_code, !!cur.is_day),
        })
        // Pick next 4 hourly slots starting after now
        const nowH = new Date().getHours()
        const out = []
        for (let i = 0; i < d.hourly.time.length && out.length < 4; i++) {
          const t = new Date(d.hourly.time[i])
          if (t.getHours() <= nowH && t.toDateString() === new Date().toDateString()) continue
          const ico = wmoToIcon(d.hourly.weather_code[i], !!d.hourly.is_day[i])
          out.push({
            time: `+${out.length + 1}h`,
            temp: `${Math.round(d.hourly.temperature_2m[i])}°`,
            icon: ico.icon,
          })
        }
        setForecast(out)
      } catch {
        // Fallback: keep prior state
      }
    }
    load()
    const id = setInterval(load, 15 * 60 * 1000) // refresh every 15 min
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  // Suppress unused-var lint for cToF (kept for future C/F toggling)
  void cToF

  const hours = time.getHours()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  const m = time.getMinutes().toString().padStart(2, '0')
  const s = time.getSeconds().toString().padStart(2, '0')
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

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
        <span style={{ fontSize: 28 }}>{weather?.icon || '⏳'}</span>
        <div>
          <div style={{ fontFamily: 'var(--font-data)', fontSize: 22, fontWeight: 600 }}>
            {weather ? `${weather.temp}°F` : '—'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
            {weather ? `${weather.label} · ${LOCATION}` : 'Loading weather…'}
          </div>
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
