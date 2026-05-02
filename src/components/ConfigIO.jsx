import { useRef } from 'react'
import { DownloadSimple, UploadSimple } from '@phosphor-icons/react'

const CONFIG_KEYS = [
  'devdash-theme',
  'devdash-layout',
  'devdash-widget-sizes',
  'devdash-focus-widgets',
  'devdash-notes',
  'devdash-quick-notes',
  'devdash-links',
  'devdash-habits',
  'devdash-habits-date',
  'devdash-habit-streak',
  'devdash-habit-streak-date',
  'devdash-pomo-stats',
]

function buildConfig() {
  const out = { _meta: { exportedAt: new Date().toISOString(), schema: 1 } }
  for (const k of CONFIG_KEYS) {
    const v = localStorage.getItem(k)
    if (v !== null) out[k] = v
  }
  return out
}

function applyConfig(cfg) {
  if (!cfg || typeof cfg !== 'object') throw new Error('invalid config')
  for (const k of CONFIG_KEYS) {
    if (typeof cfg[k] === 'string') localStorage.setItem(k, cfg[k])
  }
}

export default function ConfigIO() {
  const inputRef = useRef(null)

  const onExport = () => {
    const cfg = buildConfig()
    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const ts = new Date().toISOString().slice(0, 10)
    a.download = `devdash-config-${ts}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const onImportClick = () => inputRef.current?.click()

  const onFile = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    try {
      const text = await f.text()
      const cfg = JSON.parse(text)
      applyConfig(cfg)
      // eslint-disable-next-line no-alert
      if (window.confirm('Config imported. Reload to apply?')) window.location.reload()
    } catch (err) {
      // eslint-disable-next-line no-alert
      window.alert('Failed to import config: ' + (err?.message || 'unknown error'))
    } finally {
      e.target.value = ''
    }
  }

  const btn = {
    width: 28, height: 28, borderRadius: 8,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    color: 'var(--text-2)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s ease-out',
  }

  return (
    <>
      <button title="Export config (JSON)" onClick={onExport} style={btn}>
        <DownloadSimple size={14} weight="bold" />
      </button>
      <button title="Import config (JSON)" onClick={onImportClick} style={btn}>
        <UploadSimple size={14} weight="bold" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        onChange={onFile}
        style={{ display: 'none' }}
      />
    </>
  )
}
