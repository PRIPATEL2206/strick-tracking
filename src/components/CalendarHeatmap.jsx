import { buildHeatmapGrid } from '../lib/streak'

const EMPTY_LIGHT = '#e1e0d9'
const EMPTY_DARK = '#2c2c2a'

function levelColor(count) {
  if (count === 0) return null
  if (count === 1) return '#9ec5f4'
  if (count === 2) return '#5598e7'
  if (count === 3) return '#3987e5'
  return '#1c5cab'
}

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export default function CalendarHeatmap({ entries }) {
  const columns = buildHeatmapGrid(entries, 53)

  const monthMarkers = []
  let lastMonth = null
  columns.forEach((col, colIdx) => {
    const firstDay = col[0]
    if (!firstDay) return
    const month = Number(firstDay.date.slice(5, 7)) - 1
    if (month !== lastMonth) {
      monthMarkers.push({ colIdx, label: MONTH_LABELS[month] })
      lastMonth = month
    }
  })

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Activity
      </h2>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-[3px] mb-1 ml-[1px]" style={{ paddingLeft: 0 }}>
            {columns.map((_, colIdx) => {
              const marker = monthMarkers.find((m) => m.colIdx === colIdx)
              return (
                <div key={colIdx} className="w-[11px] text-[10px] text-gray-400 dark:text-gray-500 shrink-0">
                  {marker ? marker.label : ''}
                </div>
              )
            })}
          </div>
          <div className="flex gap-[3px]">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-[3px]">
                {col.map((day) => {
                  const color = levelColor(day.count)
                  return (
                    <div
                      key={day.date}
                      title={`${day.date}: ${day.count} solved`}
                      className="w-[11px] h-[11px] rounded-sm shrink-0"
                      style={{
                        backgroundColor: color ?? 'var(--heatmap-empty)',
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        :root { --heatmap-empty: ${EMPTY_LIGHT}; }
        @media (prefers-color-scheme: dark) {
          :root { --heatmap-empty: ${EMPTY_DARK}; }
        }
      `}</style>
      <div className="flex items-center gap-1.5 mt-3 text-[11px] text-gray-400 dark:text-gray-500">
        <span>Less</span>
        <span className="w-[11px] h-[11px] rounded-sm" style={{ backgroundColor: 'var(--heatmap-empty)' }} />
        <span className="w-[11px] h-[11px] rounded-sm" style={{ backgroundColor: '#9ec5f4' }} />
        <span className="w-[11px] h-[11px] rounded-sm" style={{ backgroundColor: '#5598e7' }} />
        <span className="w-[11px] h-[11px] rounded-sm" style={{ backgroundColor: '#3987e5' }} />
        <span className="w-[11px] h-[11px] rounded-sm" style={{ backgroundColor: '#1c5cab' }} />
        <span>More</span>
      </div>
    </div>
  )
}
