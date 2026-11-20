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
import { byPlatform } from '../lib/stats'

const BAR_COLOR = '#2a78d6'

export default function PlatformChart({ entries }) {
  const data = byPlatform(entries)

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex flex-col">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          By platform
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-500">No data yet.</p>
      </div>
    )
  }

  const height = Math.max(120, data.length * 36 + 20)

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        By platform
      </h2>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#898781' }}
          />
          <Tooltip
            formatter={(value) => [`${value} solved`, '']}
            labelFormatter={(label) => label}
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
          <Bar dataKey="value" radius={[4, 4, 4, 4]} maxBarSize={24}>
            {data.map((_, i) => (
              <Cell key={i} fill={BAR_COLOR} />
            ))}
            <LabelList dataKey="value" position="right" style={{ fill: '#52514e', fontSize: 12 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
