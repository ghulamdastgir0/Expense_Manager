"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

// Custom Tooltip Component for Dark Theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1C2C26] border border-gray-600 rounded-lg p-3 shadow-lg">
        <p className="text-white font-medium">{`${label}`}</p>
        <p className="text-[#4ADE80]">{`Expense: $${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

function Top5Expenses(props) {
  return (
    <div className="w-full h-full bg-transparent [&_.recharts-active-bar]:fill-[#4ADE80] [&_.recharts-bar-rectangle]:hover:fill-[#4ADE80] [&_.recharts-layer]:hover:fill-none">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={props.data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }} barCategoryGap="20%">
          <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar dataKey="expense" fill="#4ADE80" radius={[4, 4, 0, 0]} maxBarSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Top5Expenses
