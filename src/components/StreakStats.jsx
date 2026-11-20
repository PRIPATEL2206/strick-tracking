const STREAK_FLAME = '🔥'

function StatTile({ label, value, accent }) {
  return (
    <div className="flex-1 min-w-[140px] rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p
        className={`mt-1 text-3xl font-semibold ${accent ? 'text-orange-500' : 'text-gray-900 dark:text-gray-100'}`}
      >
        {value}
      </p>
    </div>
  )
}

export default function StreakStats({ current, longest, total }) {
  return (
    <div className="flex flex-wrap gap-3">
      <StatTile
        label="Current streak"
        value={
          <>
            {current} {current > 0 ? STREAK_FLAME : ''}
          </>
        }
        accent
      />
      <StatTile label="Longest streak" value={longest} />
      <StatTile label="Total solved" value={total} />
    </div>
  )
}
