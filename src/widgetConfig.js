// Widget configuration: IDs, default layout, size presets

export const WIDGET_IDS = [
  'clock-weather',
  'github-streak',
  'system-monitor',
  'pomodoro',
  'gmail-inbox',
  'calendar-next',
  'now-playing',
  'quick-links',
  'scratchpad',
  'hacker-news',
  'quick-notes',
]

export const DEFAULT_LAYOUT = [
  { i: 'clock-weather',  x: 0,  y: 0, w: 4, h: 1 },
  { i: 'github-streak',  x: 4,  y: 0, w: 4, h: 1 },
  { i: 'system-monitor', x: 8,  y: 0, w: 2, h: 1 },
  { i: 'pomodoro',       x: 10, y: 0, w: 2, h: 1 },
  { i: 'gmail-inbox',    x: 0,  y: 1, w: 4, h: 2 },
  { i: 'calendar-next',  x: 4,  y: 1, w: 3, h: 1 },
  { i: 'now-playing',    x: 7,  y: 1, w: 5, h: 1 },
  { i: 'quick-links',    x: 4,  y: 2, w: 2, h: 1 },
  { i: 'scratchpad',     x: 6,  y: 2, w: 2, h: 1 },
  { i: 'quick-notes',    x: 8,  y: 2, w: 2, h: 1 },
  { i: 'hacker-news',    x: 10, y: 2, w: 2, h: 1 },
]

// Size presets per widget: [w, h]
export const WIDGET_SIZES = {
  'clock-weather':  { sm: [3, 1], md: [4, 1], lg: [6, 2] },
  'github-streak':  { sm: [3, 1], md: [4, 1], lg: [6, 2] },
  'system-monitor': { sm: [2, 1], md: [2, 1], lg: [4, 2] },
  'pomodoro':       { sm: [2, 1], md: [2, 1], lg: [4, 2] },
  'gmail-inbox':    { sm: [3, 2], md: [4, 2], lg: [6, 3] },
  'calendar-next':  { sm: [2, 1], md: [3, 1], lg: [5, 2] },
  'now-playing':    { sm: [3, 1], md: [5, 1], lg: [6, 2] },
  'quick-links':    { sm: [2, 1], md: [2, 1], lg: [4, 2] },
  'scratchpad':     { sm: [2, 1], md: [2, 1], lg: [4, 2] },
  'hacker-news':    { sm: [2, 1], md: [2, 1], lg: [4, 2] },
  'quick-notes':    { sm: [2, 1], md: [2, 1], lg: [4, 2] },
}

// Default focus set
export const DEFAULT_FOCUS_WIDGETS = ['clock-weather', 'pomodoro', 'scratchpad', 'quick-notes']
