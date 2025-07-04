import NavBar from "./navbar"
import Top5Expenses from "./BarChart"
import TransactionsHistory from "./T_History"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

function Dashboard() {
  const listOfData = [
    { category: "Food", expense: 400 },
    { category: "Transport", expense: 300 },
    { category: "Entertainment", expense: 200 },
    { category: "Utilities", expense: 150 },
    { category: "Others", expense: 100 },
  ]

  const recentTransactions = [
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
  ]

  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen bg-black">
      {/* Sidebar */}
      <div className="grid lg:grid-cols-1">
        <NavBar />
      </div>

      {/* Main Content */}
      <main className="transition-all duration-300 bg-black min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 bg-[#1C2C26] border-b border-gray-700 flex items-center px-4">
          <div className="ml-12">
            <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-black text-white space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white hidden lg:block">Dashboard</h1>
            <p className="text-gray-300 text-sm lg:text-base">Welcome back! Here's your financial overview.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Balance */}
            <div className="bg-[#1C2C26] p-6 rounded-xl shadow border border-gray-700 min-h-[140px]">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-300">Total Balance</p>
                  <p className="text-2xl font-bold text-white">$12,450</p>
                </div>
                <div className="h-12 w-12 flex items-center justify-center bg-green-900 rounded-lg">
                  <DollarSign className="text-green-400 w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center mt-3 text-green-400 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span className="ml-1">+12.5%</span>
                <span className="ml-2 text-gray-400">vs last month</span>
              </div>
            </div>

            {/* Monthly Income */}
            <div className="bg-[#1C2C26] p-6 rounded-xl shadow border border-gray-700 min-h-[140px]">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-300">Monthly Income</p>
                  <p className="text-2xl font-bold text-white">$5,200</p>
                </div>
                <div className="h-12 w-12 flex items-center justify-center bg-blue-900 rounded-lg">
                  <TrendingUp className="text-blue-400 w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center mt-3 text-green-400 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span className="ml-1">+8.2%</span>
                <span className="ml-2 text-gray-400">vs last month</span>
              </div>
            </div>

            {/* Monthly Expenses */}
            <div className="bg-[#1C2C26] p-6 rounded-xl shadow border border-gray-700 min-h-[140px]">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-300">Monthly Expenses</p>
                  <p className="text-2xl font-bold text-white">$3,150</p>
                </div>
                <div className="h-12 w-12 flex items-center justify-center bg-red-900 rounded-lg">
                  <TrendingDown className="text-red-400 w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center mt-3 text-red-400 text-sm">
                <ArrowDownRight className="w-4 h-4" />
                <span className="ml-1">-3.1%</span>
                <span className="ml-2 text-gray-400">vs last month</span>
              </div>
            </div>

            {/* Savings */}
            <div className="bg-[#1C2C26] p-6 rounded-xl shadow border border-gray-700 min-h-[140px]">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-300">Savings</p>
                  <p className="text-2xl font-bold text-white">$2,050</p>
                </div>
                <div className="h-12 w-12 flex items-center justify-center bg-purple-900 rounded-lg">
                  <CreditCard className="text-purple-400 w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center mt-3 text-green-400 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span className="ml-1">+15.3%</span>
                <span className="ml-2 text-gray-400">vs last month</span>
              </div>
            </div>
          </div>

          {/* Charts and Transactions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
            {/* Bar Chart */}
            <div className="bg-[#1C2C26] rounded-xl p-6 border border-gray-700 shadow-lg">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Top 5 Expenses</h2>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>This Month</span>
                </div>
              </div>
              <div className="h-80 w-full [&_.recharts-bar]:hover:fill-current [&_.recharts-bar]:hover:opacity-80">
                <Top5Expenses data={listOfData} />
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-[#1C2C26] rounded-xl p-6 border border-gray-700 shadow-lg">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <TransactionsHistory transactions={recentTransactions} transactionCount={recentTransactions.length} />
              <button className="w-full mt-4 text-sm text-[#4ADE80] hover:text-[#2D5A4A] font-medium transition py-2 hover:bg-gray-800 rounded-lg">
                View All Transactions
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
