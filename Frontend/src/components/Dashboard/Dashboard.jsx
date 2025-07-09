"use client"
import { useState } from "react"
import NavBar from "./NavBar"
import BarChat from "./BarChart"
import StatBox from "./StatBox"
import ChartBox from "./ChartBox"
import Box from "./Box"
import AddTransaction from "./Addtransaction"
import Reports from "./Reports"
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Calendar } from "lucide-react" // Added CalendarCheck
import TransactionsPage from "./TransactionsPage"
import History from "./History"
import SummaryRow from "./Summary_Row"
import Profile from "./Profile"
import EditProfile from "./EditProfile"
import Settings from "./Settings"

function Dashboard() {
  // ===== NAVIGATION STATE =====
  const [currentPage, setCurrentPage] = useState("Dashboard")
  const [transactionType, setTransactionType] = useState("expense") // Track transaction type

  // ===== DATA SECTION =====

  // Placeholder for overall budget and expenses (can be fetched from settings/transactions)
  const overallBudgetLimit = 1000
  const currentOverallExpenses = 750 // This would be an aggregation of all expenses for the current month

  // Stats data for efficient mapping
  const statsData = [
    {
      id: 1,
      title: "Total Balance",
      value: "$12,450",
      icon: DollarSign,
      iconBgColor: "bg-green-900",
      iconColor: "text-green-400",
      trend: "up",
      trendValue: "+12.5%",
      trendLabel: "vs last month",
    },
    {
      id: 2,
      title: "Monthly Income",
      value: "$5,200",
      icon: TrendingUp,
      iconBgColor: "bg-blue-900",
      iconColor: "text-blue-400",
      trend: "up",
      trendValue: "+8.2%",
      trendLabel: "vs last month",
    },
    {
      id: 3,
      title: "Monthly Expenses",
      value: "$3,150",
      icon: TrendingDown,
      iconBgColor: "bg-red-900",
      iconColor: "text-red-400",
      trend: "down",
      trendValue: "-3.1%",
      trendLabel: "vs last month",
    },
    {
      id: 4,
      title: "Last Month Remaining Balance", // Updated title
      value: "$2,050", // Placeholder value
      icon: CreditCard,
      iconBgColor: "bg-purple-900",
      iconColor: "text-purple-400",
      trend: "up",
      trendValue: "+15.3%",
      trendLabel: "vs last month",
    },
  ]

  // Chart data
  const listOfData = [
    { category: "Food", expense: 400 },
    { category: "Transport", expense: 300 },
    { category: "Entertainment", expense: 200 },
    { category: "Utilities", expense: 150 },
    { category: "Others", expense: 100 },
  ]

  // Financial summary data for additional insights
  const summaryData = [
    {
      label: "Total Income",
      value: "$5,200",
      bg: "bg-green-900/20",
      textColor: "text-green-400",
    },
    {
      label: "Total Expenses",
      value: "$3,150",
      bg: "bg-red-900/20",
      textColor: "text-red-400",
    },
    {
      label: "Last Month Remaining Balance", // Updated label
      value: "$2,050", // Placeholder value
      bg: "bg-blue-900/20",
      textColor: "text-blue-400",
    },
  ]

  // Upcoming payments data
  const upcomingPayments = [
    { id: 1, name: "Rent", amount: 1200, dueDate: "2025-07-01", status: "due" },
    { id: 2, name: "Electricity Bill", amount: 85, dueDate: "2025-07-10", status: "due" },
    { id: 3, name: "Internet Bill", amount: 60, dueDate: "2025-07-15", status: "due" },
    { id: 4, name: "Car Loan", amount: 350, dueDate: "2025-07-20", status: "due" },
    { id: 5, name: "Gym Membership", amount: 45, dueDate: "2025-07-25", status: "due" },
  ]

  // ===== EVENT HANDLERS =====

  // Handle navigation
  const handleNavigation = (page) => {
    setCurrentPage(page)
  }

  // Handle add transaction with type
  const handleAddTransaction = (type = "expense") => {
    setTransactionType(type)
    setCurrentPage("AddTransaction")
  }

  // Handle stat box clicks
  const handleStatClick = (stat) => {
    console.log(`Clicked on ${stat.title}:`, stat)
    // Add your navigation or modal logic here
  }

  // ===== RENDER FUNCTIONS =====

  // Render Dashboard Content
  const renderDashboardContent = () => {
    const overallBudgetPercentage = overallBudgetLimit > 0 ? (currentOverallExpenses / overallBudgetLimit) * 100 : 0
    const budgetRemaining = overallBudgetLimit - currentOverallExpenses
    const budgetStatusText =
      overallBudgetLimit > 0
        ? overallBudgetPercentage > 100
          ? `Exceeded by $${Math.abs(budgetRemaining).toFixed(2)}`
          : overallBudgetPercentage === 100
            ? "Budget Reached"
            : `$${budgetRemaining.toFixed(2)} Remaining`
        : "No budget set"

    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-black text-white space-y-8">
        {/* ===== HEADER SECTION ===== */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-300 text-sm lg:text-base">Welcome back! Here's your financial overview.</p>
        </div>

        {/* ===== STATS CARDS SECTION ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat) => (
            <StatBox
              key={stat.id}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconBgColor={stat.iconBgColor}
              iconColor={stat.iconColor}
              trend={stat.trend}
              trendValue={stat.trendValue}
              trendLabel={stat.trendLabel}
              onClick={() => handleStatClick(stat)}
              className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            />
          ))}
        </div>

        {/* ===== CHARTS SECTION ===== */}
        <div className="grid grid-cols-1 gap-4">
          {/* Bar Chart */}
          <ChartBox
            title="Top 5 Expenses"
            headerAction={
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>This Month</span>
              </div>
            }
            className="shadow-lg"
          >
            <BarChat data={listOfData} dataKey="expense" />
          </ChartBox>
        </div>

        {/* ===== ADDITIONAL INSIGHTS SECTION ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget Progress - Consolidated */}
          <Box title="Budget Progress" subtitle="Monthly spending against your budget" className="shadow-lg">
            <div className="space-y-4">
              {/* Budget Limit */}
              <SummaryRow
                label="Monthly Budget Limit"
                value={`$${overallBudgetLimit.toFixed(2)}`}
                bg="bg-green-900/20"
                textColor="text-green-400"
              />

              {/* Remaining Budget */}
              <SummaryRow
                label="Remaining Budget"
                value={`$${budgetRemaining.toFixed(2)}`}
                bg={"bg-red-900/20"}
                textColor={"text-red-400"}
              />

              {/* Usage Percentage */}
              <SummaryRow
                label="Budget Usage"
                value={`${overallBudgetPercentage.toFixed(1)}%`}
                bg={"bg-blue-900/20"}
                textColor={"text-blue-400"}
              />

              {/* Action to manage budgets */}
              <div className="pt-4 text-center">
                <button
                  onClick={() => handleNavigation("Settings")}
                  className="px-6 py-3 bg-[#4ADE80] text-black font-semibold rounded-lg hover:bg-[#3BC470] transition-colors duration-200"
                >
                  Manage Budget Settings
                </button>
              </div>
            </div>
          </Box>

          {/* Financial Summary */}
          <Box title="Financial Summary" subtitle="This month overview" className="shadow-lg">
            <div className="space-y-4">
              {summaryData.map((item, index) => (
                <SummaryRow key={index} {...item} />
              ))}

            
            </div>
          </Box>
        </div>
      </div>
    )
  }

  // ===== MAIN RENDER =====
  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* ===== STATIC SIDEBAR SECTION ===== */}
      <div className="flex-shrink-0">
        <NavBar currentPage={currentPage} onNavigate={handleNavigation} />
      </div>

      {/* ===== SCROLLABLE MAIN CONTENT SECTION ===== */}
      <main className="flex-1 h-screen overflow-y-auto bg-black lg:ml-64">
        {/* Mobile Header - Sticky */}
        <div className="lg:hidden h-16 bg-[#1C2C26] border-b border-gray-700 flex items-center px-4 sticky top-0 z-30">
          <div className="ml-12">
            <h1 className="text-lg font-semibold text-white">
              {currentPage === "AddTransaction"
                ? `Add ${transactionType === "income" ? "Income" : "Expense"}`
                : currentPage === "History"
                  ? "Transaction History"
                  : currentPage}
            </h1>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="h-full">
          {/* Conditional Content Rendering */}
          {currentPage === "Dashboard" && renderDashboardContent()}
          {currentPage === "Transactions" && (
            <TransactionsPage onNavigate={handleNavigation} onAddTransaction={handleAddTransaction} />
          )}
          {currentPage === "AddTransaction" && <AddTransaction preSelectedType={transactionType} />}
          {currentPage === "History" && <History onNavigate={handleNavigation} />}
          {currentPage === "Reports" && <Reports onNavigate={handleNavigation} />}
          {currentPage === "Profile" && <Profile onNavigate={handleNavigation} />}
          {currentPage === "EditProfile" && <EditProfile onNavigate={handleNavigation} />}
          {currentPage === "Settings" && <Settings onNavigate={handleNavigation} />}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
