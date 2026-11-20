import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
  ResponsiveContainer,
} from 'recharts'
import { byDifficulty } from '../lib/stats'

const COLORS = {
  Easy: '#0ca30c',
  Medium: '#fab219',
  Hard: '#d03b3b',
}

export default function DifficultyChart({ entries }) {
  const data = byDifficulty(entries)
  const hasData = data.some((d) => d.value > 0)

  if (!hasData) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          By difficulty
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-500">No data yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        By difficulty
      </h2>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#898781' }}
          />
          <YAxis hide />
          <Tooltip
            formatter={(value) => [`${value} solved`, '']}
            cursor={{ fill: 'var(--chart-cursor)', stroke: 'none' }}
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
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.map((d) => (
              <Cell key={d.name} fill={COLORS[d.name]} />
            ))}
            <LabelList dataKey="value" position="top" style={{ fill: '#52514e', fontSize: 12 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
