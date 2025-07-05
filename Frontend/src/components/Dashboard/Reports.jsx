"use client"

import BarChat from "./BarChart"
import DonutChart from "./DonutChart"
import ChartBox from "./ChartBox"
import FilterBox from "./FilterBox"
import { Calendar, TrendingUp, PieChart, CreditCard, Filter } from "lucide-react"
import { useState, useMemo } from "react"

// Enhanced data with dates and categories
const allTransactionData = [
  // January
  {
    month: "Jan",
    income: 120000,
    expenses: 0,
    category: "Income",
    paymentMode: "Bank Transfer",
    date: "2024-01-01",
    type: "income",
  },
  {
    month: "Jan",
    income: 0,
    expenses: 90000,
    category: "Bills",
    paymentMode: "Credit Card",
    date: "2024-01-10",
    type: "expense",
  },

  // February
  {
    month: "Feb",
    income: 115000,
    expenses: 0,
    category: "Income",
    paymentMode: "Bank Transfer",
    date: "2024-02-01",
    type: "income",
  },
  {
    month: "Feb",
    income: 0,
    expenses: 85000,
    category: "Food",
    paymentMode: "Debit Card",
    date: "2024-02-12",
    type: "expense",
  },

  // March
  {
    month: "Mar",
    income: 125000,
    expenses: 0,
    category: "Income",
    paymentMode: "Cash",
    date: "2024-03-01",
    type: "income",
  },
  {
    month: "Mar",
    income: 0,
    expenses: 95000,
    category: "Shopping",
    paymentMode: "Credit Card",
    date: "2024-03-18",
    type: "expense",
  },

  // April
  {
    month: "Apr",
    income: 130000,
    expenses: 0,
    category: "Income",
    paymentMode: "Bank Transfer",
    date: "2024-04-01",
    type: "income",
  },
  {
    month: "Apr",
    income: 0,
    expenses: 92000,
    category: "Rent",
    paymentMode: "Bank Transfer",
    date: "2024-04-08",
    type: "expense",
  },

  // May
  {
    month: "May",
    income: 128000,
    expenses: 0,
    category: "Income",
    paymentMode: "Cash",
    date: "2024-05-01",
    type: "income",
  },
  {
    month: "May",
    income: 0,
    expenses: 96000,
    category: "Bills",
    paymentMode: "Credit Card",
    date: "2024-05-10",
    type: "expense",
  },

  // June
  {
    month: "Jun",
    income: 123000,
    expenses: 0,
    category: "Income",
    paymentMode: "Bank Transfer",
    date: "2024-06-01",
    type: "income",
  },
  {
    month: "Jun",
    income: 0,
    expenses: 91000,
    category: "Transport",
    paymentMode: "Cash",
    date: "2024-06-09",
    type: "expense",
  },

  // July
  {
    month: "Jul",
    income: 135000,
    expenses: 0,
    category: "Income",
    paymentMode: "Bank Transfer",
    date: "2024-07-01",
    type: "income",
  },
  {
    month: "Jul",
    income: 0,
    expenses: 99000,
    category: "Food",
    paymentMode: "Debit Card",
    date: "2024-07-11",
    type: "expense",
  },

  // August
  {
    month: "Aug",
    income: 132000,
    expenses: 0,
    category: "Income",
    paymentMode: "Cash",
    date: "2024-08-01",
    type: "income",
  },
  {
    month: "Aug",
    income: 0,
    expenses: 97000,
    category: "Entertainment",
    paymentMode: "Credit Card",
    date: "2024-08-14",
    type: "expense",
  },

  // September
  {
    month: "Sep",
    income: 129000,
    expenses: 0,
    category: "Income",
    paymentMode: "Bank Transfer",
    date: "2024-09-01",
    type: "income",
  },
  {
    month: "Sep",
    income: 0,
    expenses: 94000,
    category: "Shopping",
    paymentMode: "Bank Transfer",
    date: "2024-09-20",
    type: "expense",
  },

  // October
  {
    month: "Oct",
    income: 140000,
    expenses: 0,
    category: "Income",
    paymentMode: "Cash",
    date: "2024-10-01",
    type: "income",
  },
  {
    month: "Oct",
    income: 0,
    expenses: 100000,
    category: "Bills",
    paymentMode: "Credit Card",
    date: "2024-10-15",
    type: "expense",
  },

  // November
  {
    month: "Nov",
    income: 138000,
    expenses: 0,
    category: "Income",
    paymentMode: "Bank Transfer",
    date: "2024-11-01",
    type: "income",
  },
  {
    month: "Nov",
    income: 0,
    expenses: 98000,
    category: "Rent",
    paymentMode: "Bank Transfer",
    date: "2024-11-10",
    type: "expense",
  },

  // December
  {
    month: "Dec",
    income: 145000,
    expenses: 0,
    category: "Income",
    paymentMode: "Cash",
    date: "2024-12-01",
    type: "income",
  },
  {
    month: "Dec",
    income: 0,
    expenses: 102000,
    category: "Entertainment",
    paymentMode: "Debit Card",
    date: "2024-12-28",
    type: "expense",
  }
];


// Color schemes for donut charts
const categoryColors = ["#4ADE80", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#10B981"]
const typeColors = ["#4ADE80", "#EF4444"]
const paymentColors = ["#4ADE80", "#3B82F6", "#F59E0B", "#EF4444"]

function Reports() {
  // Filter states
  const [selectedExpenseType, setSelectedExpenseType] = useState("all")
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("all")

  // Helper function to check if date falls within selected time period
  const isDateInPeriod = (dateString, period) => {
    const date = new Date(dateString)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    switch (period) {
      case "today":
        return date.toDateString() === today.toDateString()
      case "yesterday":
        return date.toDateString() === yesterday.toDateString()
      case "this_week":
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        return date >= weekStart && date <= now
      case "this_month":
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      case "this_year":
        return date.getFullYear() === now.getFullYear()
      default:
        return true
    }
  }

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    let filteredTransactions = [...allTransactionData]

    // Apply time period filter
    if (selectedTimePeriod !== "all") {
      filteredTransactions = filteredTransactions.filter((item) => isDateInPeriod(item.date, selectedTimePeriod))
    }

    // Apply expense type filter
    if (selectedExpenseType !== "all") {
      filteredTransactions = filteredTransactions.filter((item) => item.type === selectedExpenseType)
    }

    // Apply payment mode filter
    if (selectedPaymentMode !== "all") {
      filteredTransactions = filteredTransactions.filter((item) => item.paymentMode === selectedPaymentMode)
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filteredTransactions = filteredTransactions.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase(),
      )
    }

    // Process filtered data for charts
    const monthlyData = []
    const monthlyMap = new Map()

    // Initialize all months first
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    allMonths.forEach((month) => {
      monthlyMap.set(month, { month, income: 0, expenses: 0 })
    })

    // Then aggregate the filtered data
    filteredTransactions.forEach((item) => {
      const month = item.month
      const monthData = monthlyMap.get(month)
      if (monthData) {
        if (item.type === "income") {
          monthData.income += item.income
        } else if (item.type === "expense") {
          monthData.expenses += item.expenses
        }
      }
    })

    // Only include months that have data
    Array.from(monthlyMap.values()).forEach((monthData) => {
      if (monthData.income > 0 || monthData.expenses > 0) {
        monthlyData.push(monthData)
      }
    })

    // Process expense data by category
    const expenseMap = new Map()
    filteredTransactions
      .filter((item) => item.type === "expense")
      .forEach((item) => {
        const category = item.category
        if (!expenseMap.has(category)) {
          expenseMap.set(category, { category, expenses: 0 })
        }
        expenseMap.get(category).expenses += item.expenses
      })
    const expenseData = Array.from(expenseMap.values())

    // Process category distribution
    const categoryMap = new Map()
    filteredTransactions
      .filter((item) => item.type === "expense")
      .forEach((item) => {
        const category = item.category
        if (!categoryMap.has(category)) {
          categoryMap.set(category, { name: category, value: 0 })
        }
        categoryMap.get(category).value += item.expenses
      })
    const categoryData = Array.from(categoryMap.values())

    // Process type data
    const incomeTotal = filteredTransactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.income, 0)
    const expenseTotal = filteredTransactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.expenses, 0)
    const typeData = [
      { name: "Income", value: incomeTotal },
      { name: "Expenses", value: expenseTotal },
    ].filter((item) => item.value > 0)

    // Process payment mode data
    const paymentMap = new Map()
    filteredTransactions.forEach((item) => {
      const mode = item.paymentMode
      if (!paymentMap.has(mode)) {
        paymentMap.set(mode, { name: mode, value: 0 })
      }
      paymentMap.get(mode).value += item.expenses || item.income
    })
    const paymentData = Array.from(paymentMap.values())

    return {
      monthlyData,
      expenseData,
      categoryData,
      typeData,
      paymentData,
      totalTransactions: filteredTransactions.length,
    }
  }, [selectedExpenseType, selectedPaymentMode, selectedCategory, selectedTimePeriod])

  const expenseTypes = ["all", "income", "expense"]
  const paymentModes = ["all", "Credit Card", "Debit Card", "Cash", "Bank Transfer"]
  const categories = ["all", "Food", "Transport", "Shopping", "Bills", "Entertainment", "Income"]
  const timePeriods = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
    { value: "this_year", label: "This Year" },
  ]

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-2">Financial Reports</h1>
        <p className="text-gray-300 text-sm">Comprehensive analysis of your financial data</p>
      </div>

      {/* Filters Section - Using FilterBox instead of ChartBox */}
      <div className="mb-4">
        <FilterBox
          title="Filters"
          subtitle={`Showing ${filteredData.totalTransactions} transactions`}
          headerAction={
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Filter className="w-4 h-4" />
              <span>Active Filters</span>
            </div>
          }
          className="shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Time Period Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Time Period</label>
              <select
                value={selectedTimePeriod}
                onChange={(e) => setSelectedTimePeriod(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none"
              >
                {timePeriods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
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
            </div>

            {/* Expense Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Expense Type</label>
              <select
                value={selectedExpenseType}
                onChange={(e) => setSelectedExpenseType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none capitalize"
              >
                {expenseTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Mode Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Payment Mode</label>
              <select
                value={selectedPaymentMode}
                onChange={(e) => setSelectedPaymentMode(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none"
              >
                {paymentModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode === "all" ? "All Payment Modes" : mode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedTimePeriod !== "all" ||
            selectedCategory !== "all" ||
            selectedExpenseType !== "all" ||
            selectedPaymentMode !== "all") && (
            <div className="flex flex-wrap gap-2">
              {selectedTimePeriod !== "all" && (
                <span className="px-3 py-1 bg-[#4ADE80] text-black rounded-full text-sm">
                  {timePeriods.find((p) => p.value === selectedTimePeriod)?.label}
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="px-3 py-1 bg-[#3B82F6] text-white rounded-full text-sm">{selectedCategory}</span>
              )}
              {selectedExpenseType !== "all" && (
                <span className="px-3 py-1 bg-[#F59E0B] text-white rounded-full text-sm">{selectedExpenseType}</span>
              )}
              {selectedPaymentMode !== "all" && (
                <span className="px-3 py-1 bg-[#EF4444] text-white rounded-full text-sm">{selectedPaymentMode}</span>
              )}
            </div>
          )}
        </FilterBox>
      </div>

      {/* Charts Section with proper spacing */}
      <div className="space-y-4">
        {/* Income vs Expense Comparison Chart */}
        {filteredData.monthlyData.length > 0 && (
          <ChartBox
            title="Monthly Income vs Expense Comparison"
            subtitle="Compare your monthly income and expenses"
            headerAction={
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Filtered Data</span>
              </div>
            }
            className="shadow-lg"
          >
            <BarChat data={filteredData.monthlyData} dataKey="comparison" />
          </ChartBox>
        )}

        {/* Top Expenses Bar Chart */}
        {filteredData.expenseData.length > 0 && (
          <ChartBox
            title="Top Expenses by Category"
            subtitle="Your highest expense categories"
            headerAction={
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Filtered Data</span>
              </div>
            }
            className="shadow-lg"
          >
            <BarChat data={filteredData.expenseData} dataKey="expenses" />
          </ChartBox>
        )}

        {/* Donut Charts Grid with proper spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Category Distribution */}
          {filteredData.categoryData.length > 0 && (
            <ChartBox
              title="Expense by Category"
              subtitle="Distribution of expenses"
              headerAction={
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <PieChart className="w-4 h-4" />
                </div>
              }
              className="shadow-lg"
            >
              <DonutChart data={filteredData.categoryData} colors={categoryColors} />
            </ChartBox>
          )}

          {/* Income vs Expense Type */}
          {filteredData.typeData.length > 0 && (
            <ChartBox
              title="Income vs Expenses"
              subtitle="Overall financial breakdown"
              headerAction={
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                </div>
              }
              className="shadow-lg"
            >
              <DonutChart data={filteredData.typeData} colors={typeColors} />
            </ChartBox>
          )}

          {/* Payment Mode Distribution */}
          {filteredData.paymentData.length > 0 && (
            <ChartBox
              title="Payment Methods"
              subtitle="How you spend your money"
              headerAction={
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <CreditCard className="w-4 h-4" />
                </div>
              }
              className="shadow-lg"
            >
              <DonutChart data={filteredData.paymentData} colors={paymentColors} />
            </ChartBox>
          )}
        </div>

        {/* No Data Message */}
        {filteredData.totalTransactions === 0 && (
          <ChartBox className="shadow-lg">
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No data found for the selected filters</p>
              <p className="text-sm mt-2">Try adjusting your filter criteria</p>
            </div>
          </ChartBox>
        )}
      </div>
    </div>
  )
}

export default Reports
