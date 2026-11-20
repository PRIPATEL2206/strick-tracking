import { useEffect, useState } from 'react'
import {
  getEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  importEntriesAppend,
  importEntriesOverwrite,
} from './lib/storage'
import { computeCurrentStreak, computeLongestStreak } from './lib/streak'
import StreakStats from './components/StreakStats'
import CalendarHeatmap from './components/CalendarHeatmap'
import PlatformChart from './components/PlatformChart'
import DifficultyChart from './components/DifficultyChart'
import DifficultyTrendChart from './components/DifficultyTrendChart'
import ActivityList from './components/ActivityList'
import AddEntryModal from './components/AddEntryModal'
import EmptyState from './components/EmptyState'
import ImportExportMenu from './components/ImportExportMenu'

export default function App() {
  const [entries, setEntries] = useState([])
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    setEntries(getEntries())
  }, [])

  function refresh() {
    setEntries(getEntries())
  }

  function handleAdd(data) {
    addEntry(data)
    refresh()
    setModalOpen(false)
  }

  function handleUpdate(id, updates) {
    updateEntry(id, updates)
    refresh()
  }

  function handleDelete(id) {
    if (window.confirm('Delete this entry?')) {
      deleteEntry(id)
      refresh()
    }
  }

  function handleImportAppend(imported) {
    importEntriesAppend(imported)
    refresh()
  }

  function handleImportOverwrite(imported) {
    importEntriesOverwrite(imported)
    refresh()
  }

  const currentStreak = computeCurrentStreak(entries)
  const longestStreak = computeLongestStreak(entries)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-xl font-semibold">Streak Tracker</h1>
          <div className="flex items-center gap-2">
            <ImportExportMenu
              onImportAppend={handleImportAppend}
              onImportOverwrite={handleImportOverwrite}
            />
            <button
              onClick={() => setModalOpen(true)}
              className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Log Solve
            </button>
          </div>
        </header>

        {entries.length === 0 ? (
          <EmptyState onAdd={() => setModalOpen(true)} />
        ) : (
          <div className="space-y-4">
            <StreakStats current={currentStreak} longest={longestStreak} total={entries.length} />
            <CalendarHeatmap entries={entries} />
            <DifficultyTrendChart entries={entries} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PlatformChart entries={entries} />
              <DifficultyChart entries={entries} />
            </div>
            <ActivityList entries={entries} onUpdate={handleUpdate} onDelete={handleDelete} />
          </div>
        )}
      </div>

      {modalOpen && (
        <AddEntryModal onClose={() => setModalOpen(false)} onSubmit={handleAdd} />
      )}
    </div>
  )
}
