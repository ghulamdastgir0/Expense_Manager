"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

// Custom Tooltip Component for Dark Theme
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

// Custom Legend Component
const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-2">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-300 text-sm">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ data, colors }) {
  // Calculate total for percentage calculation
  const dataWithTotal = data.map((item) => ({
    ...item,
    total: data.reduce((sum, d) => sum + d.value, 0),
  }))

  return (
    <div className="w-full h-full bg-transparent">
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
