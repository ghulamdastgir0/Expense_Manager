import Box from "./Box"

function ChartBox({ title, subtitle, children, headerAction, className = "", ...props }) {
  return (
    <Box className={`${className}`} padding="p-6" {...props}>
      {/* Custom Header with Action */}
      {(title || subtitle || headerAction) && (
        <div className="flex justify-between items-center mb-4">
          <div>
            {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
            {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div className="text-gray-400">{headerAction}</div>}
        </div>
      )}

      {/* Chart Content */}
      <div className="h-80 w-full">{children}</div>
    </Box>
  )
}

export default ChartBox
