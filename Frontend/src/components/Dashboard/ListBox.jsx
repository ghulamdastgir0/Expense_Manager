"use client"
import Box from "./Box"

function ListBox({
  title,
  subtitle,
  items = [],
  renderItem,
  emptyMessage = "No items to display",
  showViewAll = false,
  onViewAll,
  viewAllText = "View All",
  maxItems,
  className = "",
  ...props
}) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items

  return (
    <Box title={title} subtitle={subtitle} className={className} {...props}>
      <div className="space-y-4">
        {displayItems.length > 0 ? (
          displayItems.map((item, index) => (
            <div key={item.id || index}>
              {renderItem ? renderItem(item, index) : <div className="text-white">{JSON.stringify(item)}</div>}
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-center py-8">{emptyMessage}</div>
        )}

        {/* View All Button */}
        {showViewAll && items.length > 0 && (
          <button
            onClick={onViewAll}
            className="w-full mt-4 text-sm text-[#4ADE80] hover:text-[#2D5A4A] font-medium transition py-2 hover:bg-gray-800 rounded-lg"
          >
            {viewAllText}
          </button>
        )}
      </div>
    </Box>
  )
}

export default ListBox
