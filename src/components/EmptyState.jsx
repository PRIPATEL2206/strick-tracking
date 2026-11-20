export default function EmptyState({ onAdd }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center">
      <p className="text-2xl mb-2">🔥</p>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
        Start your streak
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Log your first solved problem to see your stats and streak build up here.
      </p>
      <button
        onClick={onAdd}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        + Log Solve
      </button>
    </div>
  )
}
