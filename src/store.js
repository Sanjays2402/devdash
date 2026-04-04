import { create } from 'zustand'

export const THEMES = ['void', 'aurora', 'crimson', 'solar']
export const THEME_COLORS = {
  void: '#6366f1',
  aurora: '#10b981',
  crimson: '#f43f5e',
  solar: '#f59e0b',
}

export const useStore = create((set) => ({
  theme: localStorage.getItem('devdash-theme') || 'void',
  setTheme: (t) => {
    localStorage.setItem('devdash-theme', t)
    document.documentElement.setAttribute('data-theme', t)
    set({ theme: t })
  },

  // Scratchpad
  notes: localStorage.getItem('devdash-notes') || '// TODO: finish DevDash\n// Review PR #42\n// Deploy to Vercel\n// Call dentist',
  setNotes: (n) => { localStorage.setItem('devdash-notes', n); set({ notes: n }) },

  // Quick links
  links: JSON.parse(localStorage.getItem('devdash-links') || 'null') || [
    { name: 'GitHub', url: 'https://github.com', color: '#8b949e' },
    { name: 'Gmail', url: 'https://mail.google.com', color: '#ea4335' },
    { name: 'Calendar', url: 'https://calendar.google.com', color: '#4285f4' },
    { name: 'ChatGPT', url: 'https://chat.openai.com', color: '#10a37f' },
    { name: 'Notion', url: 'https://notion.so', color: '#ffffff' },
    { name: 'YouTube', url: 'https://youtube.com', color: '#ff0000' },
  ],

  // Pomodoro
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

  // Habits
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
