import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import Box from "./Box"

function StatBox({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  trend,
  trendValue,
  trendLabel = "vs last month",
  className = "",
  ...props
}) {
  const isPositiveTrend = trend === "up" || (typeof trend === "number" && trend > 0)
  const TrendIcon = isPositiveTrend ? ArrowUpRight : ArrowDownRight
  const trendColorClass = isPositiveTrend ? "text-green-400" : "text-red-400"

  return (
    <Box
      title={title}
      icon={Icon}
      iconBgColor={iconBgColor}
      iconColor={iconColor}
      className={`min-h-[140px] ${className}`}
      {...props}
    >
      <div className="space-y-3">
        {/* Main Value */}
        <p className="text-2xl font-bold text-white">{value}</p>

        {/* Trend Indicator */}
        {(trend || trendValue) && (
          <div className={`flex items-center text-sm ${trendColorClass}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="ml-1">{trendValue}</span>
            {trendLabel && <span className="ml-2 text-gray-400">{trendLabel}</span>}
          </div>
        )}
      </div>
    </Box>
  )
}

export default StatBox
