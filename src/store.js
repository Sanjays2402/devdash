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
  setTheme: (t) => {
    localStorage.setItem('devdash-theme', t)
    document.documentElement.setAttribute('data-theme', t)
    set({ theme: t })
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

  // ─── Pomodoro ──────────────────────────────────────
  pomodoroRunning: false,
  pomodoroTime: 25 * 60,
  pomodoroSession: 1,
  setPomodoroRunning: (v) => set({ pomodoroRunning: v }),
  setPomodoroTime: (v) => set({ pomodoroTime: v }),
  tickPomodoro: () => set(s => {
    if (!s.pomodoroRunning) return {}
    const next = s.pomodoroTime - 1
    if (next <= 0) return { pomodoroTime: 25 * 60, pomodoroRunning: false, pomodoroSession: s.pomodoroSession + 1 }
    return { pomodoroTime: next }
  }),

  // ─── Habits ────────────────────────────────────────
  habits: JSON.parse(localStorage.getItem('devdash-habits') || 'null') || [
    { id: 'exercise', name: 'Exercise', done: false },
    { id: 'read', name: 'Read 30min', done: false },
    { id: 'water', name: 'Drink 8 glasses', done: false },
    { id: 'code', name: 'Code 1hr', done: false },
    { id: 'journal', name: 'Journal', done: false },
  ],
  toggleHabit: (id) => set(s => {
    const habits = s.habits.map(h => h.id === id ? { ...h, done: !h.done } : h)
    localStorage.setItem('devdash-habits', JSON.stringify(habits))
    return { habits }
  }),
}))
