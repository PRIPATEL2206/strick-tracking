export function byPlatform(entries) {
  const counts = new Map()
  for (const e of entries) {
    counts.set(e.platform, (counts.get(e.platform) || 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function byDifficulty(entries) {
  const order = ['Easy', 'Medium', 'Hard']
  const counts = new Map(order.map((d) => [d, 0]))
  for (const e of entries) {
    counts.set(e.difficulty, (counts.get(e.difficulty) || 0) + 1)
  }
  return order.map((name) => ({ name, value: counts.get(name) || 0 }))
}

export function recentEntries(entries, limit = 10) {
  return entries.slice(0, limit)
}

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

function emptyBucket(period) {
  return { period, Easy: 0, Medium: 0, Hard: 0 }
}

function shortLabel(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function toDateOnly(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function buildDailyTrend(entries, days) {
  const end = toDateOnly(formatDate(new Date()))
  const buckets = new Map()
  let cursor = addDays(end, -(days - 1))
  while (cursor <= end) {
    buckets.set(formatDate(cursor), emptyBucket(shortLabel(cursor)))
    cursor = addDays(cursor, 1)
  }
  for (const e of entries) {
    const bucket = buckets.get(e.date)
    if (bucket && DIFFICULTIES.includes(e.difficulty)) bucket[e.difficulty] += 1
  }
  return Array.from(buckets.values())
}

function buildWeeklyTrend(entries, weeksCount) {
  const end = toDateOnly(formatDate(new Date()))
  const windows = []
  for (let i = weeksCount - 1; i >= 0; i -= 1) {
    const windowEnd = addDays(end, -7 * i)
    const windowStart = addDays(windowEnd, -6)
    windows.push({ start: windowStart, end: windowEnd, bucket: emptyBucket(shortLabel(windowStart)) })
  }
  for (const e of entries) {
    const date = toDateOnly(e.date)
    const win = windows.find((w) => date >= w.start && date <= w.end)
    if (win && DIFFICULTIES.includes(e.difficulty)) win.bucket[e.difficulty] += 1
  }
  return windows.map((w) => w.bucket)
}

function buildMonthlyTrend(entries, monthsCount) {
  const end = toDateOnly(formatDate(new Date()))
  const buckets = new Map()
  for (let i = monthsCount - 1; i >= 0; i -= 1) {
    const d = new Date(end.getFullYear(), end.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    buckets.set(key, emptyBucket(d.toLocaleDateString('en-US', { month: 'short' })))
  }
  for (const e of entries) {
    const key = e.date.slice(0, 7)
    const bucket = buckets.get(key)
    if (bucket && DIFFICULTIES.includes(e.difficulty)) bucket[e.difficulty] += 1
  }
  return Array.from(buckets.values())
}

export function buildDifficultyTrend(entries, granularity) {
  if (granularity === 'weekly') return buildWeeklyTrend(entries, 8)
  if (granularity === 'monthly') return buildMonthlyTrend(entries, 6)
  return buildDailyTrend(entries, 14)
}
