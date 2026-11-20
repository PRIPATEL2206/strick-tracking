import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { buildDifficultyTrend } from '../lib/stats'

const COLORS = {
  Easy: '#0ca30c',
  Medium: '#fab219',
  Hard: '#d03b3b',
}

const GRANULARITIES = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
]

export default function DifficultyTrendChart({ entries }) {
  const [granularity, setGranularity] = useState('daily')
  const data = buildDifficultyTrend(entries, granularity)
  const hasData = entries.length > 0

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Solves over time
        </h2>
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5">
          {GRANULARITIES.map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => setGranularity(g.key)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                granularity === g.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">No data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#898781' }}
              interval={granularity === 'daily' ? 1 : 0}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#898781' }}
              width={24}
            />
            <Tooltip
              cursor={{ stroke: 'var(--chart-grid)' }}
              contentStyle={{
                backgroundColor: 'var(--chart-tooltip-bg)',
                borderColor: 'var(--chart-tooltip-border)',
                color: 'var(--chart-tooltip-text)',
                fontSize: 12,
                borderRadius: 6,
              }}
              labelStyle={{ color: 'var(--chart-tooltip-text)' }}
              itemStyle={{ color: 'var(--chart-tooltip-text)' }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="Easy" stroke={COLORS.Easy} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Medium" stroke={COLORS.Medium} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Hard" stroke={COLORS.Hard} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
