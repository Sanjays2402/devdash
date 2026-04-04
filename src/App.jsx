import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from './store'
import Header from './components/Header'
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

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }

export default function App() {
  const { theme, setTheme } = useStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: 16, gap: 14 }}>
      <Header />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: 14,
          minHeight: 0,
        }}
      >
        {/* Row 1 */}
        <Widget style={{ gridColumn: '1 / 5', gridRow: '1' }}><ClockWeather /></Widget>
        <Widget style={{ gridColumn: '5 / 9', gridRow: '1' }}><GitHubStreak /></Widget>
        <Widget style={{ gridColumn: '9 / 11', gridRow: '1' }}><SystemMonitor /></Widget>
        <Widget style={{ gridColumn: '11 / 13', gridRow: '1' }}><Pomodoro /></Widget>

        {/* Row 2-3 */}
        <Widget style={{ gridColumn: '1 / 5', gridRow: '2 / 4' }}><GmailInbox /></Widget>
        <Widget style={{ gridColumn: '5 / 8', gridRow: '2' }}><CalendarNext /></Widget>
        <Widget style={{ gridColumn: '8 / 13', gridRow: '2' }}><NowPlaying /></Widget>
        <Widget style={{ gridColumn: '5 / 8', gridRow: '3' }}><QuickLinks /></Widget>
        <Widget style={{ gridColumn: '8 / 11', gridRow: '3' }}><Scratchpad /></Widget>
        <Widget style={{ gridColumn: '11 / 13', gridRow: '3' }}><HackerNews /></Widget>
      </motion.div>
    </div>
  )
}

function Widget({ children, style }) {
  return (
    <motion.div
      variants={item}
      className="glass"
      style={{ padding: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', ...style }}
    >
      {children}
    </motion.div>
  )
}
