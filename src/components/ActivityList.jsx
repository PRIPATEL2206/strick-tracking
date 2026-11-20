import { useState } from 'react'

const DIFFICULTY_BADGE = {
  Easy: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

const PLATFORMS = ['LeetCode', 'HackerRank', 'Codeforces', 'CodeChef', 'GeeksforGeeks', 'Other']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

function EditRow({ entry, onSave, onCancel }) {
  const [platform, setPlatform] = useState(entry.platform)
  const [problem, setProblem] = useState(entry.problem)
  const [difficulty, setDifficulty] = useState(entry.difficulty)
  const [date, setDate] = useState(entry.date)

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <input
        value={date}
        type="date"
        onChange={(e) => setDate(e.target.value)}
        className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-2 py-1 text-sm"
      />
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-2 py-1 text-sm"
      >
        {PLATFORMS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <input
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        className="flex-1 min-w-[120px] rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-2 py-1 text-sm"
      />
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-2 py-1 text-sm"
      >
        {DIFFICULTIES.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <button
        onClick={() => onSave({ platform, problem, difficulty, date })}
        className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="rounded px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Cancel
      </button>
    </div>
  )
}

export default function ActivityList({ entries, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null)

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Recent activity
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Nothing logged yet — add your first solve to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Recent activity
      </h2>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {entries.map((entry) =>
          editingId === entry.id ? (
            <EditRow
              key={entry.id}
              entry={entry}
              onCancel={() => setEditingId(null)}
              onSave={(updates) => {
                onUpdate(entry.id, updates)
                setEditingId(null)
              }}
            />
          ) : (
            <div key={entry.id} className="flex items-center gap-3 py-2">
              <span className="text-xs text-gray-400 dark:text-gray-500 w-20 shrink-0">
                {entry.date}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 w-24 shrink-0 truncate">
                {entry.platform}
              </span>
              <span className="flex-1 text-sm text-gray-800 dark:text-gray-200 truncate">
                {entry.problem}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${DIFFICULTY_BADGE[entry.difficulty]}`}
              >
                {entry.difficulty}
              </span>
              <button
                onClick={() => setEditingId(entry.id)}
                className="text-xs text-gray-400 hover:text-blue-600 shrink-0"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(entry.id)}
                className="text-xs text-gray-400 hover:text-red-600 shrink-0"
              >
                Delete
              </button>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
