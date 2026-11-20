function toDateOnly(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayStr() {
  return formatDate(new Date())
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function getActiveDateSet(entries) {
  return new Set(entries.map((e) => e.date))
}

export function computeCurrentStreak(entries) {
  const dates = getActiveDateSet(entries)
  if (dates.size === 0) return 0

  let cursor = toDateOnly(todayStr())
  if (!dates.has(formatDate(cursor))) {
    cursor = addDays(cursor, -1)
    if (!dates.has(formatDate(cursor))) return 0
  }

  let streak = 0
  while (dates.has(formatDate(cursor))) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function computeLongestStreak(entries) {
  const dates = getActiveDateSet(entries)
  if (dates.size === 0) return 0

  const sorted = Array.from(dates)
    .map((d) => toDateOnly(d))
    .sort((a, b) => a - b)

  let longest = 1
  let current = 1
  for (let i = 1; i < sorted.length; i += 1) {
    const diffDays = Math.round((sorted[i] - sorted[i - 1]) / 86400000)
    if (diffDays === 1) {
      current += 1
    } else if (diffDays > 1) {
      current = 1
    }
    longest = Math.max(longest, current)
  }
  return longest
}

export function buildHeatmapGrid(entries, weeks = 53) {
  const counts = new Map()
  for (const e of entries) {
    counts.set(e.date, (counts.get(e.date) || 0) + 1)
  }

  const end = toDateOnly(todayStr())
  const endDow = end.getDay()
  const start = addDays(end, -(weeks * 7 - 1) - endDow)

  const days = []
  let cursor = start
  while (cursor <= end) {
    const dateStr = formatDate(cursor)
    days.push({
      date: dateStr,
      count: counts.get(dateStr) || 0,
      inFuture: cursor > end,
    })
    cursor = addDays(cursor, 1)
  }

  const columns = []
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7))
  }
  return columns
}
