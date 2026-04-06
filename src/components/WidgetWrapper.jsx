import { useState } from 'react'
import { useStore } from '../store'
import { WIDGET_SIZES } from '../widgetConfig'

const SIZE_LABELS = { sm: 'S', md: 'M', lg: 'L' }
const SIZES = ['sm', 'md', 'lg']

export default function WidgetWrapper({ id, children }) {
  const [showResize, setShowResize] = useState(false)
  const { widgetSizes, setWidgetSize, focusMode, focusWidgets, toggleFocusWidget } = useStore()
  const currentSize = widgetSizes[id] || 'md'
  const hasSizes = !!WIDGET_SIZES[id]

  return (
    <div
      className="glass widget-wrapper"
      style={{
        height: '100%', padding: 20, overflow: 'hidden',
        display: 'flex', flexDirection: 'column', minHeight: 0,
        position: 'relative',
      }}
      onMouseEnter={() => setShowResize(true)}
      onMouseLeave={() => setShowResize(false)}
    >
      {/* Widget controls — shown on hover */}
      {showResize && (
        <div
          style={{
            position: 'absolute', top: 6, right: 6, zIndex: 10,
            display: 'flex', gap: 2, alignItems: 'center',
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          {/* Focus pin */}
          <button
            onClick={() => toggleFocusWidget(id)}
            title={focusWidgets.includes(id) ? 'Remove from focus set' : 'Add to focus set'}
            style={{
              width: 22, height: 22, borderRadius: 4,
              background: focusWidgets.includes(id) ? 'var(--accent-muted)' : 'rgba(255,255,255,0.04)',
              border: focusWidgets.includes(id) ? '1px solid var(--accent)' : '1px solid var(--border)',
              color: focusWidgets.includes(id) ? 'var(--accent)' : 'var(--text-2)',
              cursor: 'pointer', fontSize: 11, lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s ease-out',
            }}
          >
            📌
          </button>

          {/* Resize buttons */}
          {hasSizes && SIZES.map(size => (
            <button
              key={size}
              onClick={() => setWidgetSize(id, size)}
              style={{
                width: 22, height: 22, borderRadius: 4,
                background: currentSize === size ? 'var(--accent)' : 'rgba(255,255,255,0.04)',
                border: currentSize === size ? 'none' : '1px solid var(--border)',
                color: currentSize === size ? '#fff' : 'var(--text-2)',
                cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-data)',
                transition: 'all 0.15s ease-out',
              }}
              title={`Resize to ${size}`}
            >
              {SIZE_LABELS[size]}
            </button>
          ))}
        </div>
      )}

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}
