"use client"
import NavBar from "./navbar"
import Top5Expenses from "./BarChart"
import StatBox from "./StatBox"
import ChartBox from "./ChartBox"
import ListBox from "./ListBox"
import Box from "./Box"
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Calendar, Clock } from "lucide-react"
import { useState } from "react"

function Dashboard() {
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

  // Transactions data with state for dynamic updates
  const [recentTransactions] = useState([
    {
      id: 1,
      description: "Grocery Store",
      amount: -85.5,
      time: "2 hours ago",
      category: "Food",
    },
    {
      id: 2,
      description: "Salary Deposit",
      amount: 2500.0,
      time: "1 day ago",
      category: "Income",
    },
    {
      id: 3,
      description: "Gas Station",
      amount: -45.2,
      time: "2 days ago",
      category: "Transport",
    },
    {
      id: 4,
      description: "Netflix",
      amount: -15.99,
      time: "3 days ago",
      category: "Entertainment",
    },
    {
      id: 5,
      description: "Electric Bill",
      amount: -120.0,
      time: "5 days ago",
      category: "Utilities",
    },
    {
      id: 6,
      description: "Coffee Shop",
      amount: -12.5,
      time: "1 week ago",
      category: "Food",
    },
  ])

  // Budget data for additional insights
  const budgetData = [
    { category: "Food", spent: 400, budget: 500, color: "bg-green-500" },
    { category: "Transport", spent: 300, budget: 350, color: "bg-yellow-500" },
    { category: "Entertainment", spent: 200, budget: 250, color: "bg-blue-500" },
  ]

  // Quick actions data
  const quickActions = [
    { name: "Add Expense", color: "bg-red-600 hover:bg-red-700" },
    { name: "Add Income", color: "bg-green-600 hover:bg-green-700" },
    { name: "Set Budget", color: "bg-blue-600 hover:bg-blue-700" },
    { name: "View Reports", color: "bg-purple-600 hover:bg-purple-700" },
  ]

  // ===== EVENT HANDLERS =====

  // Handle stat box clicks
  const handleStatClick = (stat) => {
    console.log(`Clicked on ${stat.title}:`, stat)
    // Add your navigation or modal logic here
  }

  // Handle view all transactions
  const handleViewAllTransactions = () => {
    console.log("View all transactions clicked")
    // Add navigation to transactions page
  }

  // Handle quick actions
  const handleQuickAction = (actionName) => {
    console.log(`${actionName} clicked`)
    // Add specific action logic here
  }

  // ===== RENDER FUNCTIONS =====

  // Render transaction item with enhanced styling
  const renderTransactionItem = (transaction) => (
    <div className="flex justify-between border-b border-gray-700 pb-3 hover:bg-gray-800/30 px-2 py-1 rounded transition-colors cursor-pointer">
      <div>
        <p className="text-sm font-medium text-white">{transaction.description}</p>
        <p className="text-xs text-gray-400">{transaction.time}</p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${transaction.amount > 0 ? "text-green-400" : "text-red-400"}`}>
          {transaction.amount > 0 ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
        </p>
        <p className="text-xs text-gray-400">{transaction.category}</p>
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen bg-black">
      {/* ===== SIDEBAR SECTION ===== */}
      <div className="grid lg:grid-cols-1">
        <NavBar />
      </div>

      {/* ===== MAIN CONTENT SECTION ===== */}
      <main className="transition-all duration-300 bg-black min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 bg-[#1C2C26] border-b border-gray-700 flex items-center px-4">
          <div className="ml-12">
            <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          </div>
        </div>

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

          {/* ===== CHARTS AND TRANSACTIONS SECTION ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
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

            {/* Recent Transactions */}
            <ListBox
              title="Recent Transactions"
              subtitle={`${recentTransactions.length} total transactions`}
              items={recentTransactions}
              maxItems={5}
              showViewAll={true}
              onViewAll={handleViewAllTransactions}
              viewAllText="View All Transactions"
              renderItem={renderTransactionItem}
              emptyMessage="No transactions found"
              className="shadow-lg"
              icon={Clock}
              iconBgColor="bg-gray-700"
              iconColor="text-gray-400"
            />
          </div>

          {/* ===== ADDITIONAL INSIGHTS SECTION ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <p className="text-xs text-gray-400">
                      {Math.round((item.spent / item.budget) * 100)}% of budget used
                    </p>
                  </div>
                ))}
              </div>
            </Box>

            {/* Quick Actions */}
            <Box title="Quick Actions" subtitle="Manage your finances" className="shadow-lg">
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className={`${action.color} text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200`}
                    onClick={() => handleQuickAction(action.name)}
                  >
                    {action.name}
                  </button>
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
      </main>
    </div>
  )
}

export default Dashboard
