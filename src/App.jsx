import { useEffect } from 'react'
import { GridLayout, useContainerWidth } from 'react-grid-layout'
import { useStore } from './store'
import { WIDGET_IDS } from './widgetConfig'
import Header from './components/Header'
import WidgetWrapper from './components/WidgetWrapper'
import ClockWeather from './components/widgets/ClockWeather'
import GitHubStreak from './components/widgets/GitHubStreak'
import SystemMonitor from './components/widgets/SystemMonitor'
import Pomodoro from './components/widgets/Pomodoro'
import GmailInbox from './components/widgets/GmailInbox'
import CalendarNext from './components/widgets/CalendarNext'
import NowPlaying from './components/widgets/NowPlaying'
import QuickLinks from './components/widgets/QuickLinks'
import Scratchpad from './components/widgets/Scratchpad'
import HackerNews from './components/widgets/HackerNews'
import QuickNotes from './components/widgets/QuickNotes'
import Habits from './components/widgets/Habits'
import ShortcutsOverlay from './components/ShortcutsOverlay'
import CommandPalette from './components/CommandPalette'

const WIDGET_MAP = {
  'clock-weather': ClockWeather,
  'github-streak': GitHubStreak,
  'system-monitor': SystemMonitor,
  'pomodoro': Pomodoro,
  'gmail-inbox': GmailInbox,
  'calendar-next': CalendarNext,
  'now-playing': NowPlaying,
  'quick-links': QuickLinks,
  'scratchpad': Scratchpad,
  'hacker-news': HackerNews,
  'quick-notes': QuickNotes,
  'habits': Habits,
}

export default function App() {
  const { theme, layout, setLayout, focusMode, focusWidgets, autoTheme, setTheme } = useStore()
  const { width, containerRef, mounted } = useContainerWidth()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Auto theme: choose based on hour of day
  useEffect(() => {
    if (!autoTheme) return
    const pick = () => {
      const h = new Date().getHours()
      // 6–11 solar, 12–17 aurora, 18–21 crimson, 22–5 void
      if (h >= 6 && h < 12) return 'solar'
      if (h >= 12 && h < 18) return 'aurora'
      if (h >= 18 && h < 22) return 'crimson'
      return 'void'
    }
    setTheme(pick())
    const id = setInterval(() => setTheme(pick()), 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [autoTheme, setTheme])

  const visibleWidgets = focusMode
    ? WIDGET_IDS.filter(id => focusWidgets.includes(id))
    : WIDGET_IDS

  const visibleLayout = layout.filter(item => visibleWidgets.includes(item.i))

  // Calculate row height from container
  const containerEl = containerRef.current
  const containerHeight = containerEl ? containerEl.clientHeight : 600
  const rowHeight = Math.max(100, Math.floor((containerHeight - 14 * 2) / 3))

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: 16, gap: 14 }}>
      <ShortcutsOverlay />
      <CommandPalette />
      <Header />
      <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {mounted && (
          <GridLayout
            layout={visibleLayout}
            width={width}
            cols={12}
            rowHeight={rowHeight}
            margin={[14, 14]}
            containerPadding={[0, 0]}
            isDraggable
            isResizable={false}
            draggableHandle=".drag-handle"
            onLayoutChange={(newLayout) => {
              if (newLayout.length === visibleLayout.length) {
                setLayout(newLayout)
              }
            }}
            useCSSTransforms
          >
            {visibleLayout.map(item => {
              const Comp = WIDGET_MAP[item.i]
              if (!Comp) return null
              return (
                <div key={item.i} className="grid-item-outer">
                  <div className="drag-handle" />
                  <WidgetWrapper id={item.i}>
                    <Comp />
                  </WidgetWrapper>
                </div>
              )
            })}
          </GridLayout>
        )}
      </div>
    </div>
  )
}
