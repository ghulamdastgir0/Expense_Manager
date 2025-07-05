function FilterBox({ title, subtitle, children, headerAction, className = "", ...props }) {
  return (
    <div className={`bg-[#1C2C26] rounded-xl shadow-lg border border-gray-700 p-4 ${className}`} {...props}>
      {/* Custom Header with Action */}
      {(title || subtitle || headerAction) && (
        <div className="flex justify-between items-center mb-3">
          <div>
            {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
            {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div className="text-gray-400">{headerAction}</div>}
        </div>
      )}

      {/* Filter Content - No fixed height */}
      <div className="w-full">{children}</div>
    </div>
  )
}

export default FilterBox
