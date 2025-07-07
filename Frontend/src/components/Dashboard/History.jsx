import { useState } from "react"
import { Search, Download, ArrowUpDown, Eye } from "lucide-react"
import Box from "./Box"

function History({ onNavigate }) {
  // Extended transactions data
  const [allTransactions] = useState([
    {
      id: 1,
      description: "Grocery Store",
      amount: -85.5,
      date: "2024-01-15",
      time: "14:30",
      category: "Food",
      mode: "Card",
      status: "Completed",
    },
    {
      id: 2,
      description: "Salary Deposit",
      amount: 2500.0,
      date: "2024-01-14",
      time: "09:00",
      category: "Income",
      mode: "Bank Transfer",
      status: "Completed",
    },
    {
      id: 3,
      description: "Gas Station",
      amount: -45.2,
      date: "2024-01-13",
      time: "18:45",
      category: "Transport",
      mode: "Card",
      status: "Completed",
    },
    {
      id: 4,
      description: "Netflix Subscription",
      amount: -15.99,
      date: "2024-01-12",
      time: "12:00",
      category: "Entertainment",
      mode: "Card",
      status: "Completed",
    },
    {
      id: 5,
      description: "Electric Bill",
      amount: -120.0,
      date: "2024-01-10",
      time: "16:20",
      category: "Utilities",
      mode: "Net Banking",
      status: "Completed",
    },
    {
      id: 6,
      description: "Coffee Shop",
      amount: -12.5,
      date: "2024-01-08",
      time: "08:15",
      category: "Food",
      mode: "Cash",
      status: "Completed",
    },
    {
      id: 7,
      description: "Freelance Payment",
      amount: 800.0,
      date: "2024-01-07",
      time: "11:30",
      category: "Income",
      mode: "Bank Transfer",
      status: "Completed",
    },
    {
      id: 8,
      description: "Restaurant Dinner",
      amount: -65.0,
      date: "2024-01-06",
      time: "19:45",
      category: "Food",
      mode: "Card",
      status: "Completed",
    },
    {
      id: 9,
      description: "Uber Ride",
      amount: -18.5,
      date: "2024-01-05",
      time: "22:10",
      category: "Transport",
      mode: "Card",
      status: "Completed",
    },
    {
      id: 10,
      description: "Online Shopping",
      amount: -89.99,
      date: "2024-01-04",
      time: "15:20",
      category: "Shopping",
      mode: "Card",
      status: "Completed",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  // Filter and sort transactions
  const filteredTransactions = allTransactions
    .filter((transaction) => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === "all" || transaction.category.toLowerCase() === selectedCategory.toLowerCase()
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case "amount":
          aValue = Math.abs(a.amount)
          bValue = Math.abs(b.amount)
          break
        case "date":
          aValue = new Date(a.date + " " + a.time)
          bValue = new Date(b.date + " " + b.time)
          break
        case "category":
          aValue = a.category
          bValue = b.category
          break
        default:
          aValue = a.description
          bValue = b.description
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const categories = ["all", "food", "transport", "entertainment", "utilities", "income", "shopping"]

  const handleExport = () => {
    console.log("Exporting transaction history...")
    // Add export logic here
  }

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-black text-white space-y-6">
      {/* ===== HEADER SECTION ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Transaction History</h1>
          <p className="text-gray-300 text-sm">Complete history of your financial transactions</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate("Transactions")}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Back to Transactions
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-[#4ADE80] text-black rounded-lg hover:bg-[#3BC470] transition-colors duration-200 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      
      {/* ===== SUMMARY SECTION ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Box title="Total Income" className="shadow-lg">
          <div className="text-2xl font-bold text-green-400">
            +$
            {filteredTransactions
              .filter((t) => t.amount > 0)
              .reduce((sum, t) => sum + t.amount, 0)
              .toFixed(2)}
          </div>
        </Box>
        <Box title="Total Expenses" className="shadow-lg">
          <div className="text-2xl font-bold text-red-400">
            -$
            {Math.abs(filteredTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)).toFixed(
              2,
            )}
          </div>
        </Box>
        <Box title="Net Amount" className="shadow-lg">
          <div className="text-2xl font-bold text-blue-400">
            ${filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
          </div>
        </Box>
      </div>

      {/* ===== FILTERS SECTION ===== */}
      <Box title="Filters & Search" className="shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none capitalize"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>

          {/* Sort Options */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="category">Sort by Category</option>
              <option value="description">Sort by Description</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Box>

      {/* ===== TRANSACTIONS TABLE ===== */}
      <Box title={`Transaction History (${filteredTransactions.length})`} className="shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th
                  className="text-left py-3 px-2 text-gray-300 font-medium cursor-pointer hover:text-white"
                  onClick={() => toggleSort("description")}
                >
                  Description
                </th>
                <th
                  className="text-left py-3 px-2 text-gray-300 font-medium cursor-pointer hover:text-white"
                  onClick={() => toggleSort("category")}
                >
                  Category
                </th>
                <th
                  className="text-left py-3 px-2 text-gray-300 font-medium cursor-pointer hover:text-white"
                  onClick={() => toggleSort("date")}
                >
                  Date & Time
                </th>
                <th className="text-left py-3 px-2 text-gray-300 font-medium">Mode</th>
                <th
                  className="text-right py-3 px-2 text-gray-300 font-medium cursor-pointer hover:text-white"
                  onClick={() => toggleSort("amount")}
                >
                  Amount
                </th>
                <th className="text-center py-3 px-2 text-gray-300 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                  <td className="py-4 px-2">
                    <div className="font-medium text-white">{transaction.description}</div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs capitalize">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-gray-300 text-sm">
                    <div>{transaction.date}</div>
                    <div className="text-xs text-gray-400">{transaction.time}</div>
                  </td>
                  <td className="py-4 px-2 text-gray-300 text-sm">{transaction.mode}</td>
                  <td className="py-4 px-2 text-right">
                    <span className={`font-semibold ${transaction.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                      {transaction.amount > 0 ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-400">No transactions found matching your criteria.</div>
          )}
        </div>
      </Box>

    </div>
  )
}

export default History
