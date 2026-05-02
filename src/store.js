import { create } from 'zustand'
import { DEFAULT_LAYOUT, WIDGET_SIZES, DEFAULT_FOCUS_WIDGETS } from './widgetConfig'

export const THEMES = ['void', 'aurora', 'crimson', 'solar']
export const THEME_COLORS = {
  void: '#6366f1',
  aurora: '#10b981',
  crimson: '#f43f5e',
  solar: '#f59e0b',
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function saveJSON(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

export const useStore = create((set, get) => ({
  // ─── Theme ─────────────────────────────────────────
  theme: localStorage.getItem('devdash-theme') || 'void',
  autoTheme: localStorage.getItem('devdash-auto-theme') === '1',
  setTheme: (t) => {
    localStorage.setItem('devdash-theme', t)
    document.documentElement.setAttribute('data-theme', t)
    set({ theme: t })
  },
  setAutoTheme: (v) => {
    localStorage.setItem('devdash-auto-theme', v ? '1' : '0')
    set({ autoTheme: v })
  },

  // ─── Layout (drag-drop) ────────────────────────────
  layout: loadJSON('devdash-layout', DEFAULT_LAYOUT),
  setLayout: (newLayout) => {
    // Merge only position data, keep other fields
    const merged = newLayout.map(item => ({
      i: item.i, x: item.x, y: item.y, w: item.w, h: item.h,
    }))
    saveJSON('devdash-layout', merged)
    set({ layout: merged })
  },
  resetLayout: () => {
    saveJSON('devdash-layout', DEFAULT_LAYOUT)
    const defaultSizes = {}
    DEFAULT_LAYOUT.forEach(item => { defaultSizes[item.i] = 'md' })
    saveJSON('devdash-widget-sizes', defaultSizes)
    set({ layout: [...DEFAULT_LAYOUT], widgetSizes: defaultSizes })
  },

  // ─── Widget sizes (sm/md/lg) ───────────────────────
  widgetSizes: loadJSON('devdash-widget-sizes', {}),
  setWidgetSize: (id, size) => {
    const preset = WIDGET_SIZES[id]
    if (!preset) return
    const [w, h] = preset[size]
    const newSizes = { ...get().widgetSizes, [id]: size }
    saveJSON('devdash-widget-sizes', newSizes)
    const newLayout = get().layout.map(item =>
      item.i === id ? { ...item, w, h } : item
    )
    saveJSON('devdash-layout', newLayout)
    set({ widgetSizes: newSizes, layout: newLayout })
  },

  // ─── Focus mode ────────────────────────────────────
  focusMode: false,
  toggleFocusMode: () => set(s => ({ focusMode: !s.focusMode })),
  focusWidgets: loadJSON('devdash-focus-widgets', DEFAULT_FOCUS_WIDGETS),
  toggleFocusWidget: (id) => {
    const current = get().focusWidgets
    const next = current.includes(id)
      ? current.filter(w => w !== id)
      : [...current, id]
    saveJSON('devdash-focus-widgets', next)
    set({ focusWidgets: next })
  },

  // ─── Scratchpad ────────────────────────────────────
  notes: localStorage.getItem('devdash-notes') || '// TODO: finish DevDash\n// Review PR #42\n// Deploy to Vercel\n// Call dentist',
  setNotes: (n) => { localStorage.setItem('devdash-notes', n); set({ notes: n }) },

  // ─── Quick Notes (sticky notes) ────────────────────
  quickNotes: loadJSON('devdash-quick-notes', [
    { id: '1', text: 'Welcome to Quick Notes!', color: 0 },
  ]),
  addQuickNote: () => {
    const notes = get().quickNotes
    const newNote = { id: Date.now().toString(), text: '', color: notes.length % 5 }
    const next = [...notes, newNote]
    saveJSON('devdash-quick-notes', next)
    set({ quickNotes: next })
  },
  updateQuickNote: (id, text) => {
    const next = get().quickNotes.map(n => n.id === id ? { ...n, text } : n)
    saveJSON('devdash-quick-notes', next)
    set({ quickNotes: next })
  },
  deleteQuickNote: (id) => {
    const next = get().quickNotes.filter(n => n.id !== id)
    saveJSON('devdash-quick-notes', next)
    set({ quickNotes: next })
  },
  cycleNoteColor: (id) => {
    const next = get().quickNotes.map(n =>
      n.id === id ? { ...n, color: (n.color + 1) % 5 } : n
    )
    saveJSON('devdash-quick-notes', next)
    set({ quickNotes: next })
  },

  // ─── Quick links ───────────────────────────────────
  links: JSON.parse(localStorage.getItem('devdash-links') || 'null') || [
    { name: 'GitHub', url: 'https://github.com', color: '#8b949e' },
    { name: 'Gmail', url: 'https://mail.google.com', color: '#ea4335' },
    { name: 'Calendar', url: 'https://calendar.google.com', color: '#4285f4' },
    { name: 'ChatGPT', url: 'https://chat.openai.com', color: '#10a37f' },
    { name: 'Notion', url: 'https://notion.so', color: '#ffffff' },
    { name: 'YouTube', url: 'https://youtube.com', color: '#ff0000' },
  ],
  addLink: (link) => set(s => {
    const next = [...s.links, link]
    localStorage.setItem('devdash-links', JSON.stringify(next))
    return { links: next }
  }),
  removeLink: (idx) => set(s => {
    const next = s.links.filter((_, i) => i !== idx)
    localStorage.setItem('devdash-links', JSON.stringify(next))
    return { links: next }
  }),

  // ─── Pomodoro ──────────────────────────────────────
  pomodoroRunning: false,
  pomodoroTime: 25 * 60,
  pomodoroSession: 1,
  pomodoroStats: (() => {
    const stored = JSON.parse(localStorage.getItem('devdash-pomo-stats') || 'null')
    const today = new Date().toDateString()
    if (!stored || stored.date !== today) return { date: today, completed: 0, focusedSec: 0 }
    return stored
  })(),
  setPomodoroRunning: (v) => set({ pomodoroRunning: v }),
  setPomodoroTime: (v) => set({ pomodoroTime: v }),
  tickPomodoro: () => set(s => {
    if (!s.pomodoroRunning) return {}
    const next = s.pomodoroTime - 1
    if (next <= 0) {
      const today = new Date().toDateString()
      const stats = s.pomodoroStats.date === today
        ? { ...s.pomodoroStats, completed: s.pomodoroStats.completed + 1, focusedSec: s.pomodoroStats.focusedSec + 25 * 60 }
        : { date: today, completed: 1, focusedSec: 25 * 60 }
      localStorage.setItem('devdash-pomo-stats', JSON.stringify(stats))
      return {
        pomodoroTime: 25 * 60,
        pomodoroRunning: false,
        pomodoroSession: s.pomodoroSession + 1,
        pomodoroStats: stats,
      }
    }
    return { pomodoroTime: next }
  }),

  // ─── Habits ────────────────────────────────────────
  habits: (() => {
    const stored = JSON.parse(localStorage.getItem('devdash-habits') || 'null')
    const lastReset = localStorage.getItem('devdash-habits-date')
    const today = new Date().toDateString()
    const defaults = [
      { id: 'exercise', name: 'Exercise', done: false },
      { id: 'read', name: 'Read 30min', done: false },
      { id: 'water', name: 'Drink 8 glasses', done: false },
      { id: 'code', name: 'Code 1hr', done: false },
      { id: 'journal', name: 'Journal', done: false },
    ]
    if (!stored) return defaults
    if (lastReset !== today) {
      // Daily reset: clear done flags but keep habit list
      return stored.map(h => ({ ...h, done: false }))
    }
    return stored
  })(),
  habitStreak: parseInt(localStorage.getItem('devdash-habit-streak') || '0', 10),
  habitHistory: JSON.parse(localStorage.getItem('devdash-habit-history') || '{}'),
  toggleHabit: (id) => set(s => {
    const habits = s.habits.map(h => h.id === id ? { ...h, done: !h.done } : h)
    const today = new Date().toDateString()
    localStorage.setItem('devdash-habits', JSON.stringify(habits))
    localStorage.setItem('devdash-habits-date', today)

    // History: percent done for today
    const pct = habits.length === 0 ? 0 : habits.filter(h => h.done).length / habits.length
    const history = { ...s.habitHistory, [today]: pct }
    // Trim to last 30 entries to bound localStorage
    const keys = Object.keys(history)
    if (keys.length > 30) {
      const sorted = keys.sort((a, b) => new Date(a) - new Date(b))
      for (const k of sorted.slice(0, keys.length - 30)) delete history[k]
    }
    localStorage.setItem('devdash-habit-history', JSON.stringify(history))

    // Streak bookkeeping: bump only on the transition to all-done for today
    const allDone = habits.length > 0 && habits.every(h => h.done)
    const wasAllDone = s.habits.length > 0 && s.habits.every(h => h.done)
    let streak = s.habitStreak
    if (allDone && !wasAllDone) {
      const last = localStorage.getItem('devdash-habit-streak-date')
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
      streak = last === yesterday ? streak + 1 : 1
      localStorage.setItem('devdash-habit-streak', String(streak))
      localStorage.setItem('devdash-habit-streak-date', today)
    } else if (!allDone && wasAllDone) {
      // User unchecked after completing — keep the streak (don't punish edits)
    }
    return { habits, habitStreak: streak, habitHistory: history }
  }),
}))
