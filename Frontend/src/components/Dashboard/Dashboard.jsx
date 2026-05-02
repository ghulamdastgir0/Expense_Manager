"use client"
import { useState, useEffect } from "react"
import NavBar from "./NavBar"
import BarChat from "./BarChart"
import StatBox from "./StatBox"
import ChartBox from "./ChartBox"
import Box from "./Box"
import AddTransaction from "./Addtransaction"
import Reports from "./Reports"
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Calendar } from "lucide-react"
import TransactionsPage from "./TransactionsPage"
import History from "./History"
import SummaryRow from "./Summary_Row"
import Profile from "./Profile"
import EditProfile from "./EditProfile"
import Settings from "./Settings"
import { dashboardAPI } from "../../api/api"

function Dashboard() {
  // ===== NAVIGATION STATE =====
  const [currentPage, setCurrentPage] = useState("Dashboard")
  const [transactionType, setTransactionType] = useState("expense")

  // ===== API STATE =====
  const [dashboardData, setDashboardData] = useState(null)
  const [_budgetAlert, setBudgetAlert] = useState(null)
  const [loading, setLoading] = useState(true)

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardAPI.getSummary()
        const alertRes = await dashboardAPI.getBudgetAlert()

        setDashboardData(res.data)
        setBudgetAlert(alertRes.data)
      } catch (err) {
        console.error("Dashboard API error:", err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  // ===== EVENT HANDLERS =====
  const handleNavigation = (page) => setCurrentPage(page)

  const handleAddTransaction = (type = "expense") => {
    setTransactionType(type)
    setCurrentPage("AddTransaction")
  }

  const handleStatClick = (stat) => {
    console.log(`Clicked on ${stat.title}:`, stat)
  }

  // ===== DERIVED DATA =====
  const statsData = dashboardData
    ? [
        {
          id: 1,
          title: "Total Balance",
          value: `${dashboardData.stats.currency_symbol}${dashboardData.stats.total_balance}`,
          icon: DollarSign,
          iconBgColor: "bg-green-900",
          iconColor: "text-green-400",
          trend: dashboardData.stats.balance_trend >= 0 ? "up" : "down",
          trendValue: `${dashboardData.stats.balance_trend}%`,
          trendLabel: "vs last month",
        },
        {
          id: 2,
          title: "Monthly Income",
          value: `${dashboardData.stats.currency_symbol}${dashboardData.stats.monthly_income}`,
          icon: TrendingUp,
          iconBgColor: "bg-blue-900",
          iconColor: "text-blue-400",
          trend: "up",
          trendValue: "",
          trendLabel: "this month",
        },
        {
          id: 3,
          title: "Monthly Expenses",
          value: `${dashboardData.stats.currency_symbol}${dashboardData.stats.monthly_expenses}`,
          icon: TrendingDown,
          iconBgColor: "bg-red-900",
          iconColor: "text-red-400",
          trend: "down",
          trendValue: "",
          trendLabel: "this month",
        },
        {
          id: 4,
          title: "Last Month Remaining Balance",
          value: `${dashboardData.stats.currency_symbol}${dashboardData.stats.previous_balance}`,
          icon: CreditCard,
          iconBgColor: "bg-purple-900",
          iconColor: "text-purple-400",
          trend: "up",
          trendValue: "",
          trendLabel: "previous",
        },
      ]
    : []

  const listOfData = dashboardData
    ? dashboardData.top_expenses.map((item) => ({
        category: item.category,
        expense: item.expenses,
      }))
    : []

  const summaryData = dashboardData
    ? [
        {
          label: "Total Income",
          value: `${dashboardData.stats.currency_symbol}${dashboardData.stats.monthly_income}`,
          bg: "bg-green-900/20",
          textColor: "text-green-400",
        },
        {
          label: "Total Expenses",
          value: `${dashboardData.stats.currency_symbol}${dashboardData.stats.monthly_expenses}`,
          bg: "bg-red-900/20",
          textColor: "text-red-400",
        },
        {
          label: "Last Month Remaining Balance",
          value: `${dashboardData.stats.currency_symbol}${dashboardData.stats.previous_balance}`,
          bg: "bg-blue-900/20",
          textColor: "text-blue-400",
        },
      ]
    : []

  // ===== RENDER DASHBOARD =====
  const renderDashboardContent = () => {
    if (loading) {
      return <div className="p-6 text-white">Loading dashboard...</div>
    }

    const overallBudgetLimit = dashboardData?.budget.limit || 0
    const currentOverallExpenses = dashboardData?.budget.spent || 0

    const overallBudgetPercentage =
      overallBudgetLimit > 0 ? (currentOverallExpenses / overallBudgetLimit) * 100 : 0

    const budgetRemaining = dashboardData?.budget.remaining || 0

    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-black text-white space-y-8">
        {/* HEADER */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-300 text-sm lg:text-base">
            Welcome back! Here's your financial overview.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat) => (
            <StatBox
              key={stat.id}
              {...stat}
              onClick={() => handleStatClick(stat)}
              className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            />
          ))}
        </div>

        {/* CHART */}
        <ChartBox
          title="Top 5 Expenses"
          headerAction={
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>This Month</span>
            </div>
          }
        >
          <BarChat data={listOfData} dataKey="expense" />
        </ChartBox>

        {/* INSIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget */}
          <Box title="Budget Progress" subtitle="Monthly spending against your budget">
            <div className="space-y-4">
              <SummaryRow
                label="Monthly Budget Limit"
                value={`$${overallBudgetLimit}`}
                bg="bg-green-900/20"
                textColor="text-green-400"
              />
              <SummaryRow
                label="Remaining Budget"
                value={`$${budgetRemaining}`}
                bg="bg-red-900/20"
                textColor="text-red-400"
              />
              <SummaryRow
                label="Budget Usage"
                value={`${overallBudgetPercentage.toFixed(1)}%`}
                bg="bg-blue-900/20"
                textColor="text-blue-400"
              />

              <div className="pt-4 text-center">
                <button
                  onClick={() => handleNavigation("Settings")}
                  className="px-6 py-3 bg-[#4ADE80] text-black font-semibold rounded-lg hover:bg-[#3BC470]"
                >
                  Manage Budget Settings
                </button>
              </div>
            </div>
          </Box>

          {/* Summary */}
          <Box title="Financial Summary" subtitle="This month overview">
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

  // ===== MAIN =====
  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <NavBar currentPage={currentPage} onNavigate={handleNavigation} />

      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="lg:hidden h-16 bg-[#1C2C26] border-b flex items-center px-4 sticky top-0">
          <div className="ml-12 text-white font-semibold">{currentPage}</div>
        </div>

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
      </main>
    </div>
  )
}

export default Dashboard