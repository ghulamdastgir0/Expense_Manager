"use client"
import { useState } from "react"
import NavBar from "./navbar"
import Top5Expenses from "./BarChart"
import StatBox from "./StatBox"
import ChartBox from "./ChartBox"
import Box from "./Box"
import AddTransaction from "./Addtransaction"
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Calendar } from "lucide-react"
import TransactionsPage from "./TransactionsPage"
import History from "./History"

function Dashboard() {
  // ===== NAVIGATION STATE =====
  const [currentPage, setCurrentPage] = useState("Dashboard")

  // ===== DATA SECTION =====

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
      title: "Savings",
      value: "$2,050",
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

  // Budget data for additional insights
  const budgetData = [
    { category: "Food", spent: 400, budget: 500, color: "bg-green-500" },
    { category: "Transport", spent: 300, budget: 350, color: "bg-yellow-500" },
    { category: "Entertainment", spent: 200, budget: 250, color: "bg-blue-500" },
  ]

  // ===== EVENT HANDLERS =====

  // Handle navigation
  const handleNavigation = (page) => {
    setCurrentPage(page)
  }

  // Handle stat box clicks
  const handleStatClick = (stat) => {
    console.log(`Clicked on ${stat.title}:`, stat)
    // Add your navigation or modal logic here
  }

  // ===== RENDER FUNCTIONS =====

  // Render Dashboard Content
  const renderDashboardContent = () => (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-black text-white space-y-8">
      {/* ===== HEADER SECTION ===== */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white hidden lg:block">Dashboard</h1>
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
          <Top5Expenses data={listOfData} />
        </ChartBox>
      </div>

      {/* ===== ADDITIONAL INSIGHTS SECTION ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget Progress */}
        <Box title="Budget Progress" subtitle="Monthly budget tracking" className="shadow-lg">
          <div className="space-y-4">
            {budgetData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white">{item.category}</span>
                  <span className="text-gray-400">
                    ${item.spent}/${item.budget}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${(item.spent / item.budget) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400">{Math.round((item.spent / item.budget) * 100)}% of budget used</p>
              </div>
            ))}
          </div>
        </Box>

        {/* Financial Summary */}
        <Box title="Financial Summary" subtitle="This month overview" className="shadow-lg">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-900/20 rounded-lg">
              <span className="text-white text-sm">Total Income</span>
              <span className="text-green-400 font-bold">$5,200</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-900/20 rounded-lg">
              <span className="text-white text-sm">Total Expenses</span>
              <span className="text-red-400 font-bold">$3,150</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-900/20 rounded-lg">
              <span className="text-white text-sm">Net Savings</span>
              <span className="text-blue-400 font-bold">$2,050</span>
            </div>
            <div className="pt-2 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Savings Rate</span>
                <span className="text-[#4ADE80] font-bold">39.4%</span>
              </div>
            </div>
          </div>
        </Box>
      </div>

    </div>
  )

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
                ? "Add Transaction"
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
            <TransactionsPage
              onNavigate={handleNavigation}
              onAddTransaction={() => handleNavigation("AddTransaction")}
            />
          )}
          {currentPage === "AddTransaction" && <AddTransaction />}
          {currentPage === "History" && <History onNavigate={handleNavigation} />}
          {currentPage === "Reports" && (
            <div className="p-8 text-white">
              <h1 className="text-3xl font-bold mb-4">Reports</h1>
              <p className="text-gray-300">Reports page coming soon...</p>
            </div>
          )}
          {currentPage === "Profile" && (
            <div className="p-8 text-white">
              <h1 className="text-3xl font-bold mb-4">Profile</h1>
              <p className="text-gray-300">Profile page coming soon...</p>
            </div>
          )}
          {currentPage === "Settings" && (
            <div className="p-8 text-white">
              <h1 className="text-3xl font-bold mb-4">Settings</h1>
              <p className="text-gray-300">Settings page coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
