"use client"
import BarChat from "./BarChart"
import DonutChart from "./DonutChart"
import ChartBox from "./ChartBox"
import FilterBox from "./FilterBox"
import { Filter } from "lucide-react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { reportAPI } from "../../api/api"
import { useSettings } from "../../context/useSettings"

const categoryColors = ["#4ADE80", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#10B981"]
const typeColors     = ["#4ADE80", "#EF4444"]
const paymentColors  = ["#4ADE80", "#3B82F6", "#F59E0B", "#EF4444"]

// ── Time period → { from_date, to_date } ─────────────────────
function getDateRange(period) {
  const today = new Date()
  const to    = today.toISOString().split("T")[0]
  const from  = (() => {
    switch (period) {
      case "30d": { const d = new Date(today); d.setDate(d.getDate() - 29);   return d.toISOString().split("T")[0] }
      case "3m":  { const d = new Date(today); d.setMonth(d.getMonth() - 3);  return d.toISOString().split("T")[0] }
      case "6m":  { const d = new Date(today); d.setMonth(d.getMonth() - 6);  return d.toISOString().split("T")[0] }
      default:    { const d = new Date(today); d.setMonth(d.getMonth() - 11); d.setDate(1); return d.toISOString().split("T")[0] }
    }
  })()
  return { from_date: from, to_date: to }
}

// ── Build 12 rolling month slots ─────────────────────────────
function buildMonthSlots() {
  const now = new Date()
  return Array.from({ length: 12 }, (_, i) => {
    const d     = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1)
    const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const label = d.toLocaleString("en-US", { month: "short", year: "numeric" })
    return { month_key: key, month: label, income: 0, expenses: 0 }
  })
}

function Reports() {
  // ✅ Currency formatter from global context — updates instantly on settings change
  const { formatAmount } = useSettings()

  const [reportData, setReportData] = useState({
    monthly:         [],
    topCategories:   [],
    paymentModes:    [],
    incomeVsExpense: { income: 0, expenses: 0 },
  })
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState("")

  const [timePeriod,       setTimePeriod]       = useState("12m")
  const [selectedType,     setSelectedType]     = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const fetchReports = useCallback(async (period) => {
    setLoading(true)
    setError("")
    const { from_date, to_date } = getDateRange(period)
    try {
      const [monthlyRes, topRes, paymentRes, incomeRes] = await Promise.all([
        reportAPI.getYearlyComparison(),
        reportAPI.getTopCategories(),
        reportAPI.getPaymentModes({ from_date, to_date }),
        reportAPI.getIncomeVsExpense({ from_date, to_date }),
      ])
      setReportData({
        monthly:         monthlyRes?.data?.monthly_comparison || [],
        topCategories:   topRes?.data?.top_categories         || [],
        paymentModes:    paymentRes?.data?.payment_modes       || [],
        incomeVsExpense: incomeRes?.data || { income: 0, expenses: 0 },
      })
    } catch (err) {
      console.error("Reports API error:", err?.message || err)
      setError("Failed to load report data.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchReports(timePeriod) }, [timePeriod, fetchReports])

  const filteredData = useMemo(() => {
    // Monthly bar
    const slots   = buildMonthSlots()
    const dataMap = Object.fromEntries(reportData.monthly.map((m) => [m.month_key, m]))
    const mergedMonthly = slots.map((slot) =>
      dataMap[slot.month_key]
        ? { ...slot, income: dataMap[slot.month_key].income, expenses: dataMap[slot.month_key].expenses }
        : slot
    )
    const monthlyData = mergedMonthly.map((m) => ({
      ...m,
      income:   selectedType === "expense" ? 0 : m.income,
      expenses: selectedType === "income"  ? 0 : m.expenses,
    }))

    // Category filter
    const filteredCategories = selectedCategory === "all"
      ? reportData.topCategories
      : reportData.topCategories.filter((c) => c.category === selectedCategory)

    const expenseData  = filteredCategories.map((c) => ({ category: c.category, expenses: c.total_spent }))
    const categoryData = filteredCategories.map((c) => ({ name: c.category, value: c.total_spent }))

    // Type donut
    const { income, expenses } = reportData.incomeVsExpense
    const typeData =
      selectedType === "income"  ? [{ name: "Income",   value: income   }]
      : selectedType === "expense" ? [{ name: "Expenses", value: expenses }]
      : [{ name: "Income", value: income }, { name: "Expenses", value: expenses }]

    const paymentData = reportData.paymentModes.map((p) => ({ name: p.name, value: p.value }))

    return { monthlyData, expenseData, categoryData, typeData, paymentData }
  }, [reportData, selectedType, selectedCategory])

  // ── Summary cards — ✅ amounts use formatAmount ──────────────
  const { income, expenses } = reportData.incomeVsExpense
  const net = income - expenses

  const timePeriods      = [
    { value: "30d", label: "Last 30 Days" }, { value: "3m", label: "Last 3 Months" },
    { value: "6m",  label: "Last 6 Months" }, { value: "12m", label: "Last 12 Months" },
  ]
  const transactionTypes = [
    { value: "all",     label: "All Transactions" },
    { value: "income",  label: "Income Only"       },
    { value: "expense", label: "Expense Only"      },
  ]
  const categoryOptions  = [
    { value: "all", label: "All Categories" },
    ...reportData.topCategories.map((c) => ({ value: c.category, label: c.category })),
  ]

  if (loading) return (
    <div className="p-6 text-white bg-black min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <svg className="animate-spin h-8 w-8 mx-auto text-[#4ADE80]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-gray-400">Loading reports…</p>
      </div>
    </div>
  )

  return (
    <div className="p-6 bg-black text-white min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Financial Reports</h1>
        <p className="text-gray-400 text-sm">Comprehensive analysis of your financial data</p>
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-700 rounded-lg px-4 py-2 mb-4">
          {error}
        </p>
      )}

      {/* ✅ SUMMARY CARDS — amounts use formatAmount from context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Total Income</p>
          <p className="text-green-400 text-2xl font-bold">{formatAmount(income)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Total Expenses</p>
          <p className="text-red-400 text-2xl font-bold">{formatAmount(expenses)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Net</p>
          <p className={`text-2xl font-bold ${net >= 0 ? "text-blue-400" : "text-red-400"}`}>
            {net < 0 ? "-" : ""}{formatAmount(Math.abs(net))}
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <FilterBox
        title="Filters"
        subtitle="Refine your report view"
        headerAction={
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Filter className="w-4 h-4" />Active
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-wide">Time Period</label>
            <select
              className="bg-gray-800 p-3 rounded-lg text-white border border-gray-700 focus:border-[#4ADE80] focus:outline-none"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
            >
              {timePeriods.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-wide">Transaction Type</label>
            <select
              className="bg-gray-800 p-3 rounded-lg text-white border border-gray-700 focus:border-[#4ADE80] focus:outline-none"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {transactionTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-wide">Category</label>
            <select
              className="bg-gray-800 p-3 rounded-lg text-white border border-gray-700 focus:border-[#4ADE80] focus:outline-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categoryOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>
      </FilterBox>

      {/* CHARTS */}
      <div className="space-y-6 mt-6">

        <ChartBox title="Monthly Income vs Expense (Last 12 Months)">
          <div style={{ height: 320 }}>
            <BarChat data={filteredData.monthlyData} dataKey="comparison" />
          </div>
        </ChartBox>

        {filteredData.expenseData.length > 0 && (
          <ChartBox title="Top Spending Categories">
            <div style={{ height: 320 }}>
              <BarChat data={filteredData.expenseData} dataKey="expenses" />
            </div>
          </ChartBox>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartBox title="Category Breakdown">
            <DonutChart data={filteredData.categoryData} colors={categoryColors} />
          </ChartBox>
          <ChartBox title="Income vs Expense">
            <DonutChart data={filteredData.typeData} colors={typeColors} />
          </ChartBox>
          <ChartBox title="Payment Methods">
            <DonutChart data={filteredData.paymentData} colors={paymentColors} />
          </ChartBox>
        </div>

        {filteredData.expenseData.length === 0 && filteredData.paymentData.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No report data available yet.</p>
            <p className="text-sm mt-2">Add some transactions to see your financial reports.</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Reports