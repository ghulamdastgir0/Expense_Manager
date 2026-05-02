"use client"
import BarChat from "./BarChart"
import DonutChart from "./DonutChart"
import ChartBox from "./ChartBox"
import FilterBox from "./FilterBox"
import { Calendar, TrendingUp, PieChart, CreditCard, Filter } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { reportAPI } from "../../api/api"

const categoryColors = ["#4ADE80", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#10B981"]
const typeColors = ["#4ADE80", "#EF4444"]
const paymentColors = ["#4ADE80", "#3B82F6", "#F59E0B", "#EF4444"]

function Reports() {

  // ===== API DATA STATE =====
  const [reportData, setReportData] = useState({
    monthly: [],
    topCategories: [],
    paymentModes: [],
    incomeVsExpense: { income: 0, expenses: 0 },
  })

  const [loading, setLoading] = useState(true)

  // ===== FILTER STATE =====
  const [selectedExpenseType, setSelectedExpenseType] = useState("all")
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("all")

  // ===== FETCH REPORT DATA =====
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [monthlyRes, topRes, paymentRes, incomeRes] = await Promise.all([
          reportAPI.getYearlyComparison(),
          reportAPI.getTopCategories(),
          reportAPI.getPaymentModes(),
          reportAPI.getIncomeVsExpense(),
        ])

        setReportData({
          monthly: monthlyRes?.data?.monthly_comparison || [],
          topCategories: topRes?.data?.top_categories || [],
          paymentModes: paymentRes?.data?.payment_modes || [],
          incomeVsExpense: incomeRes?.data || { income: 0, expenses: 0 },
        })

      } catch (err) {
        console.error("Reports API error:", err?.message || err)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  // ===== FILTERED DATA =====
  const filteredData = useMemo(() => {

    let monthlyData = [...reportData.monthly]

    const expenseData = reportData.topCategories.map(c => ({
      category: c.category,
      expenses: c.total_spent
    }))

    const categoryData = reportData.topCategories.map(c => ({
      name: c.category,
      value: c.total_spent
    }))

    const typeData = [
      { name: "Income", value: reportData.incomeVsExpense.income },
      { name: "Expenses", value: reportData.incomeVsExpense.expenses }
    ]

    const paymentData = reportData.paymentModes.map(p => ({
      name: p.name,
      value: p.value
    }))

    return {
      monthlyData,
      expenseData,
      categoryData,
      typeData,
      paymentData,
      totalTransactions:
        reportData.monthly.length +
        reportData.topCategories.length,
    }
  }, [reportData])

  // ===== FILTER OPTIONS =====
  const expenseTypes = ["all", "income", "expense"]
  const paymentModes = ["all", "Credit Card", "Debit Card", "Cash", "Bank Transfer"]
  const timePeriods = [
    { value: "all", label: "All Time" },
    { value: "this_month", label: "This Month" },
    { value: "this_year", label: "This Year" },
  ]

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading reports...
      </div>
    )
  }

  // ===== UI =====
  return (
    <div className="p-6 bg-black text-white min-h-screen">

      {/* HEADER */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">Financial Reports</h1>
        <p className="text-gray-300 text-sm">
          Comprehensive analysis of your financial data
        </p>
      </div>

      {/* FILTERS */}
      <FilterBox
        title="Filters"
        subtitle="Live API-based analytics"
        headerAction={
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Filter className="w-4 h-4" />
            Active
          </div>
        }
        className="shadow-lg"
      >

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <select
            className="bg-gray-800 p-3 rounded text-white"
            value={selectedTimePeriod}
            onChange={(e) => setSelectedTimePeriod(e.target.value)}
          >
            {timePeriods.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          <select
            className="bg-gray-800 p-3 rounded text-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
          </select>

          <select
            className="bg-gray-800 p-3 rounded text-white"
            value={selectedExpenseType}
            onChange={(e) => setSelectedExpenseType(e.target.value)}
          >
            {expenseTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            className="bg-gray-800 p-3 rounded text-white"
            value={selectedPaymentMode}
            onChange={(e) => setSelectedPaymentMode(e.target.value)}
          >
            {paymentModes.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

        </div>

      </FilterBox>

      {/* CHARTS */}
      <div className="space-y-4 mt-4">

        {/* BAR CHART */}
        {filteredData.monthlyData.length > 0 && (
          <ChartBox title="Income vs Expense">
            <BarChat data={filteredData.monthlyData} />
          </ChartBox>
        )}

        {/* TOP EXPENSES */}
        {filteredData.expenseData.length > 0 && (
          <ChartBox title="Top Categories">
            <BarChat data={filteredData.expenseData} dataKey="expenses" />
          </ChartBox>
        )}

        {/* DONUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

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

      </div>

    </div>
  )
}

export default Reports