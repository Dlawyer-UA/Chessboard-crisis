// ── constants ────────────────────────────────────────────────────────────────
export const SPHERES_FULL = [
  'Кадрова',
  'Організаційно-управлінська',
  'Операційно-виробнича',
  'Логістична',
  'Фінансова',
  'Стратегічна',
]

export const SPHERES_SHORT = [
  'Кадрова', 'Орг-упр', 'Операційна', 'Логістична', 'Фінансова', 'Стратегічна',
]

export const WEIGHTS = [0.12, 0.14, 0.20, 0.16, 0.22, 0.16]

export const DEFAULT_A = [
  [1.00, 0.55, 0.65, 0.40, 0.50, 0.60],
  [0.50, 1.00, 0.70, 0.55, 0.60, 0.80],
  [0.45, 0.60, 1.00, 0.75, 0.70, 0.65],
  [0.35, 0.55, 0.65, 1.00, 0.65, 0.55],
  [0.40, 0.55, 0.65, 0.65, 1.00, 0.70],
  [0.60, 0.70, 0.65, 0.55, 0.70, 1.00],
]

export const PRESET_COMPANIES = [
  { id: 'svitanok',   name: 'ПСП «Світанок»',                    S: [7.5, 7.8, 7.2, 6.9, 8.1, 7.6] },
  { id: 'zelena',     name: 'ТОВ «Зелена Долина»',               S: [7.1, 7.0, 6.8, 6.5, 7.9, 7.2] },
  { id: 'hart',       name: 'ТОВ «Гарт»',                        S: [4.5, 5.2, 5.0, 4.8, 5.5, 4.9] },
  { id: 'lanagro',    name: 'ТОВ «Лан-Агро»',                    S: [4.0, 3.8, 4.2, 4.1, 4.7, 4.3] },
]

// ── IKP scale ────────────────────────────────────────────────────────────────
export const CRISIS_SCALE = [
  { max: 0.20, label: 'Стабільний',         color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   dot: '🟢' },
  { max: 0.40, label: 'Слабка криза',       color: '#84cc16', bg: 'rgba(132,204,22,0.12)',  dot: '🟡' },
  { max: 0.60, label: 'Помірна криза',      color: '#eab308', bg: 'rgba(234,179,8,0.12)',   dot: '🟠' },
  { max: 0.80, label: 'Розвинена криза',    color: '#f97316', bg: 'rgba(249,115,22,0.12)',  dot: '🔴' },
  { max: 1.00, label: 'Глибока криза',      color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   dot: '🚨' },
]

export function getCrisisLevel(ikp) {
  return CRISIS_SCALE.find(s => ikp <= s.max) || CRISIS_SCALE[4]
}

// ── calculations ─────────────────────────────────────────────────────────────
export function calcIKP(S) {
  return S.map(s => Math.round((1 - s / 10) * 10000) / 10000)
}

export function calcKsystem(ikp) {
  return Math.round(ikp.reduce((acc, v, i) => acc + v * WEIGHTS[i], 0) * 10000) / 10000
}

export function calcKMatrix(ikp, A) {
  return ikp.map((vi, i) =>
    A[i].map(aij => Math.round(vi * aij * 10 * 100) / 100)
  )
}

export function calcColSums(K) {
  const n = K.length
  return Array.from({ length: n }, (_, j) =>
    Math.round(K.reduce((a, row) => a + row[j], 0) * 100) / 100
  )
}

export function calcRowSums(K) {
  return K.map(row => Math.round(row.reduce((a, v) => a + v, 0) * 100) / 100)
}

// ── cell heat color ──────────────────────────────────────────────────────────
export function heatColor(val, max = 10) {
  const t = val / max
  if (t <= 0.20) return { bg: 'rgba(34,197,94,0.18)',  text: '#86efac' }
  if (t <= 0.40) return { bg: 'rgba(132,204,22,0.18)', text: '#bef264' }
  if (t <= 0.60) return { bg: 'rgba(234,179,8,0.18)',  text: '#fde047' }
  if (t <= 0.80) return { bg: 'rgba(249,115,22,0.18)', text: '#fdba74' }
  return              { bg: 'rgba(239,68,68,0.22)',   text: '#fca5a5' }
}

// ── local storage ────────────────────────────────────────────────────────────
const LS_KEY = 'chess_crisis_v1'

export function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export function saveState(state) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)) } catch {}
}

export function clearState() {
  try { localStorage.removeItem(LS_KEY) } catch {}
}
