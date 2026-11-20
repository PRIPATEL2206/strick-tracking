import { useState } from 'react'
import { todayStr } from '../lib/streak'

const PLATFORMS = ['LeetCode', 'HackerRank', 'Codeforces', 'CodeChef', 'GeeksforGeeks', 'Other']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

const DIFFICULTY_STYLE = {
  Easy: 'border-green-500 text-green-600 data-[active=true]:bg-green-500 data-[active=true]:text-white',
  Medium: 'border-yellow-500 text-yellow-600 data-[active=true]:bg-yellow-500 data-[active=true]:text-white',
  Hard: 'border-red-500 text-red-600 data-[active=true]:bg-red-500 data-[active=true]:text-white',
}

export default function AddEntryModal({ onClose, onSubmit }) {
  const [platform, setPlatform] = useState('LeetCode')
  const [customPlatform, setCustomPlatform] = useState('')
  const [problem, setProblem] = useState('')
  const [difficulty, setDifficulty] = useState('Medium')
  const [date, setDate] = useState(todayStr())
  const [showDetails, setShowDetails] = useState(false)
  const [showDate, setShowDate] = useState(false)
  const [link, setLink] = useState('')
  const [notes, setNotes] = useState('')

  const resolvedPlatform = platform === 'Other' ? customPlatform.trim() : platform

  function handleSubmit(e) {
    e.preventDefault()
    if (!resolvedPlatform || !problem.trim()) return
    onSubmit({
      platform: resolvedPlatform,
      problem: problem.trim(),
      difficulty,
      date,
      link: link.trim() || null,
      notes: notes.trim() || null,
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Log a solve
        </h2>

        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
          Platform
        </label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm mb-3"
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {platform === 'Other' && (
          <input
            value={customPlatform}
            onChange={(e) => setCustomPlatform(e.target.value)}
            placeholder="Platform name"
            autoFocus
            className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm mb-3"
          />
        )}

        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
          Problem
        </label>
        <input
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="e.g. 42 or Trapping Rain Water"
          autoFocus={platform !== 'Other'}
          className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm mb-3"
        />

        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
          Difficulty
        </label>
        <div className="flex gap-2 mb-3">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              data-active={difficulty === d}
              onClick={() => setDifficulty(d)}
              className={`flex-1 rounded border px-3 py-1.5 text-sm font-medium transition-colors ${DIFFICULTY_STYLE[d]}`}
            >
              {d}
            </button>
          ))}
        </div>

        {showDate ? (
          <div className="mb-3">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              max={todayStr()}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowDate(true)}
            className="text-xs text-blue-600 hover:underline mb-3"
          >
            Backfill a different date (defaulting to today)
          </button>
        )}

        <div className="mb-3">
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className="text-xs text-blue-600 hover:underline"
          >
            {showDetails ? 'Hide' : 'Add'} link / notes (optional)
          </button>
          {showDetails && (
            <div className="mt-2 space-y-2">
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Link (optional)"
                className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes (optional)"
                rows={2}
                className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
