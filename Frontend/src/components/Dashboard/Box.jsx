"use client"

function Box({
  children,
  title,
  subtitle,
  icon: Icon,
  iconBgColor = "bg-green-900",
  iconColor = "text-green-400",
  className = "",
  padding = "p-6",
  showBorder = true,
  onClick,
  ...props
}) {
  const baseClasses = `
    bg-[#1C2C26] 
    rounded-xl 
    shadow-lg 
    transition-all 
    duration-200 
    ${showBorder ? "border border-gray-700" : ""} 
    ${onClick ? "cursor-pointer hover:shadow-xl hover:scale-[1.02]" : ""} 
    ${padding} 
    ${className}
  `

  return (
    <div className={baseClasses.trim()} onClick={onClick} {...props}>
      {/* Header Section */}
      {(title || subtitle || Icon) && (
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {title && <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-300">{subtitle}</p>}
          </div>
          {Icon && (
            <div className={`h-12 w-12 flex items-center justify-center ${iconBgColor} rounded-lg ml-4`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="text-white">{children}</div>
    </div>
  )
}

export default Box
