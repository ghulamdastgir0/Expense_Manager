import { useState, useEffect, useMemo } from "react"
import { Search, Download, Eye } from "lucide-react"
import Box from "./Box"
import { transactionAPI } from "../../api/api"

function History({ onNavigate }) {

  // ===== STATE =====
  const [allTransactions, setAllTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  // ===== FETCH HISTORY =====
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await transactionAPI.getHistory()

        const mapped = (res?.data?.transactions || []).map((t) => ({
          id: t.transaction_id,
          description: t.title,
          amount: t.type === "Income" ? +t.amount : -t.amount,
          date: t.transaction_date?.split("T")[0],
          time: new Date(t.transaction_date).toLocaleTimeString(),
          category: t.category || "N/A",
          mode: t.payment_method || "N/A",
        }))

        setAllTransactions(mapped)

      } catch (err) {
        console.error("History API error:", err?.message || err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  // ===== FILTER + SORT =====
  const filteredTransactions = useMemo(() => {
    return allTransactions
      .filter((t) => {
        const matchesSearch = t.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

        const matchesCategory =
          selectedCategory === "all" ||
          t.category.toLowerCase() === selectedCategory.toLowerCase()

        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        let aValue, bValue

        if (sortBy === "amount") {
          aValue = Math.abs(a.amount)
          bValue = Math.abs(b.amount)
        } else if (sortBy === "date") {
          aValue = new Date(a.date + " " + a.time)
          bValue = new Date(b.date + " " + b.time)
        } else if (sortBy === "category") {
          aValue = a.category
          bValue = b.category
        } else {
          aValue = a.description
          bValue = b.description
        }

        return sortOrder === "asc"
          ? aValue > bValue ? 1 : -1
          : aValue < bValue ? 1 : -1
      })
  }, [allTransactions, searchTerm, selectedCategory, sortBy, sortOrder])

  // ===== CATEGORIES =====
  const categories = ["all", "food", "transport", "entertainment", "utilities", "income", "shopping"]

  // ===== EXPORT =====
  const handleExport = () => {
    console.log("Exporting history...")
  }

  // ===== LOADING =====
  if (loading) {
    return <div className="p-6 text-white">Loading history...</div>
  }

  // ===== SUMMARY =====
  const incomeTotal = filteredTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const expenseTotal = filteredTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const net = incomeTotal + expenseTotal

  // ===== UI =====
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-black text-white space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-gray-300 text-sm">
            Complete history of your financial transactions
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onNavigate("Transactions")}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-[#4ADE80] text-black rounded-lg hover:bg-[#3BC470] flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Box title="Total Income">
          <div className="text-2xl text-green-400 font-bold">
            +${incomeTotal.toFixed(2)}
          </div>
        </Box>

        <Box title="Total Expenses">
          <div className="text-2xl text-red-400 font-bold">
            -${Math.abs(expenseTotal).toFixed(2)}
          </div>
        </Box>

        <Box title="Net Amount">
          <div className="text-2xl text-blue-400 font-bold">
            ${net.toFixed(2)}
          </div>
        </Box>

      </div>

      {/* FILTERS */}
      <Box title="Filters & Search">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input
              className="w-full pl-10 p-3 bg-gray-800 rounded text-white"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* CATEGORY */}
          <select
            className="bg-gray-800 p-3 rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* SORT */}
          <div className="flex gap-2">
            <select
              className="flex-1 bg-gray-800 p-3 rounded"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
              <option value="description">Description</option>
            </select>

            <button
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="px-3 bg-gray-700 rounded"
            >
              ⇅
            </button>
          </div>

        </div>

      </Box>

      {/* TABLE */}
      <Box title={`Transactions (${filteredTransactions.length})`}>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b border-gray-700 text-left text-gray-400">
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Mode</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="border-b border-gray-800">
                  <td>{t.description}</td>
                  <td>{t.category}</td>
                  <td>{t.date}</td>
                  <td>{t.mode}</td>
                  <td className={`text-right ${t.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                    {t.amount > 0 ? "+" : "-"}${Math.abs(t.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-6 text-gray-400">
            No transactions found
          </div>
        )}

      </Box>

    </div>
  )
}

export default History