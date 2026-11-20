const STORAGE_KEY = 'streak-tracker:entries:v1'

function readRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeRaw(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // storage unavailable or full — silently no-op, app still works for the session
  }
}

export function getEntries() {
  return readRaw().sort((a, b) => b.createdAt - a.createdAt)
}

export function addEntry(entry) {
  const entries = readRaw()
  const newEntry = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    link: null,
    notes: null,
    ...entry,
  }
  entries.push(newEntry)
  writeRaw(entries)
  return newEntry
}

export function updateEntry(id, updates) {
  const entries = readRaw()
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return null
  entries[idx] = { ...entries[idx], ...updates }
  writeRaw(entries)
  return entries[idx]
}

export function deleteEntry(id) {
  const entries = readRaw().filter((e) => e.id !== id)
  writeRaw(entries)
}

export function exportEntries() {
  const entries = readRaw()
  const blob = new Blob([JSON.stringify(entries, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const today = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `streak-tracker-export-${today}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function isValidEntry(e) {
  return (
    e &&
    typeof e === 'object' &&
    typeof e.date === 'string' &&
    typeof e.platform === 'string' &&
    typeof e.problem === 'string'
  )
}

export function parseImportFile(text) {
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('File is not valid JSON.')
  }
  if (!Array.isArray(parsed)) {
    throw new Error('Expected a JSON array of entries.')
  }
  const valid = parsed.filter(isValidEntry)
  if (valid.length === 0) {
    throw new Error('No valid entries found in file.')
  }
  return valid.map((e) => ({
    id: typeof e.id === 'string' ? e.id : crypto.randomUUID(),
    date: e.date,
    platform: e.platform,
    problem: e.problem,
    difficulty: e.difficulty === 'Easy' || e.difficulty === 'Medium' || e.difficulty === 'Hard'
      ? e.difficulty
      : 'Medium',
    link: typeof e.link === 'string' ? e.link : null,
    notes: typeof e.notes === 'string' ? e.notes : null,
    createdAt: typeof e.createdAt === 'number' ? e.createdAt : Date.now(),
  }))
}

export function importEntriesAppend(importedEntries) {
  const existing = readRaw()
  const existingIds = new Set(existing.map((e) => e.id))
  const merged = importedEntries.map((e) =>
    existingIds.has(e.id) ? { ...e, id: crypto.randomUUID() } : e,
  )
  writeRaw([...existing, ...merged])
}

export function importEntriesOverwrite(importedEntries) {
  writeRaw(importedEntries)
}
