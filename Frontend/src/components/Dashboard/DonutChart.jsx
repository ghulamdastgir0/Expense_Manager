"use client"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useMemo } from "react"

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-[#1C2C26] border border-gray-600 rounded-lg p-3 shadow-lg">
        <p className="text-white font-medium">{data.name}</p>
        <p style={{ color: data.payload.fill }}>{`Value: ${data.value.toLocaleString()}`}</p>
        <p className="text-gray-300 text-sm">{`${((data.value / data.payload.total) * 100).toFixed(1)}%`}</p>
      </div>
    )
  }
  return null
}

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-3 mt-2">
    {payload.map((entry, index) => (
      <div key={index} className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
        <span className="text-gray-300 text-sm">{entry.value}</span>
      </div>
    ))}
  </div>
)

function DonutChart({ data, colors }) {
  // ✅ Memoize so it doesn't recompute on every parent render
  const dataWithTotal = useMemo(() => {
    const total = data.reduce((sum, d) => sum + d.value, 0)
    return data.map((item) => ({ ...item, total }))
  }, [data])

  // ✅ Show empty state instead of rendering empty chart
  if (!dataWithTotal.length || dataWithTotal.every(d => d.value === 0)) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
        No data available
      </div>
    )
  }

  return (
    <div className="w-full" style={{ height: 260 }}> {/* ✅ Fixed height — no layout thrashing */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="40%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
            isAnimationActive={false} // ✅ Disables slow re-animation on filter change
          >
            {dataWithTotal.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DonutChart