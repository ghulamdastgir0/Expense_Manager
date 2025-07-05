"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

// Custom Tooltip Component for Dark Theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1C2C26] border border-gray-600 rounded-lg p-3 shadow-lg">
        <p className="text-white font-medium">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey === "expenses" ? "Expense" : entry.dataKey === "income" ? "Income" : entry.dataKey}: $${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function BarChat(props) {
  // Check if it's comparison mode (has both income and expenses)
  const isComparison = props.dataKey === "comparison"

  return (
    <div className="w-full h-full bg-transparent">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={props.data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barCategoryGap="20%">
          <XAxis
            dataKey={isComparison ? "month" : "category"}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />

          {isComparison ? (
            <>
              <Bar dataKey="income" fill="#4ADE80" radius={[4, 4, 0, 0]} maxBarSize={50} name="Income" />
              <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={50} name="Expenses" />
            </>
          ) : (
            <Bar
              dataKey={props.dataKey}
              fill="#4ADE80"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
              name={props.dataKey === "expenses" ? "Expenses" : props.dataKey}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChat
