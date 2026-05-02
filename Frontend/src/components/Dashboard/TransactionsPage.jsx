"use client"
import { useState, useEffect } from "react"
import { Clock, TrendingUp, TrendingDown, BarChart3, History } from "lucide-react"
import ListBox from "./ListBox"
import Box from "./Box"
import SummaryRow from "./Summary_Row"
import { transactionAPI, dashboardAPI } from "../../api/api"

function TransactionsPage({ onNavigate, onAddTransaction }) {

  // ===== STATE =====
  const [recentTransactions, setRecentTransactions] = useState([])
  const [summaryData, setSummaryData] = useState([])
  const [loading, setLoading] = useState(true)

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, dashRes] = await Promise.all([
          transactionAPI.getRecent(6),
          dashboardAPI.getSummary(),
        ])

        // ===== TRANSACTIONS =====
        const mappedTx = (txRes?.data?.transactions || []).map((t) => ({
          id: t.transaction_id,
          description: t.title,
          amount: t.type === "Income" ? +t.amount : -t.amount,
          time: new Date(t.transaction_date).toLocaleDateString(),
          category: t.category,
        }))

        setRecentTransactions(mappedTx)

        // ===== SUMMARY =====
        const stats = dashRes?.data?.stats || {}
        const symbol = stats.currency_symbol || "$"

        setSummaryData([
          {
            label: "Total Income",
            value: `${symbol}${stats.monthly_income || 0}`,
            bg: "bg-green-900/20",
            textColor: "text-green-400",
          },
          {
            label: "Total Expenses",
            value: `${symbol}${stats.monthly_expenses || 0}`,
            bg: "bg-red-900/20",
            textColor: "text-red-400",
          },
          {
            label: "Last Month Remaining Balance",
            value: `${symbol}${stats.previous_balance || 0}`,
            bg: "bg-blue-900/20",
            textColor: "text-blue-400",
          },
        ])
      } catch (err) {
        console.error("TransactionsPage API error:", err?.message || err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // ===== QUICK ACTIONS =====
  const quickActions = [
    {
      name: "Add Expense",
      color: "bg-red-600 hover:bg-red-700",
      icon: TrendingDown,
      action: () => onAddTransaction("expense"),
    },
    {
      name: "Add Income",
      color: "bg-green-600 hover:bg-green-700",
      icon: TrendingUp,
      action: () => onAddTransaction("income"),
    },
    {
      name: "View Reports",
      color: "bg-purple-600 hover:bg-purple-700",
      icon: BarChart3,
      action: () => onNavigate("Reports"),
    },
    {
      name: "View History",
      color: "bg-blue-600 hover:bg-blue-700",
      icon: History,
      action: () => onNavigate("History"),
    },
  ]

  // ===== NAV HANDLER =====
  const handleViewAllTransactions = () => {
    onNavigate("History")
  }

  // ===== RENDER ITEM =====
  const renderTransactionItem = (transaction) => (
    <div className="flex justify-between border-b border-gray-700 pb-3 hover:bg-gray-800/30 px-2 py-1 rounded transition cursor-pointer">
      <div>
        <p className="text-sm font-medium text-white">
          {transaction.description}
        </p>
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

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading transactions...
      </div>
    )
  }

  // ===== UI =====
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-black text-white space-y-8">

      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-gray-300 text-sm lg:text-base">
          Manage your financial transactions and quick actions.
        </p>
      </div>

      {/* QUICK ACTIONS */}
      <Box title="Quick Actions" subtitle="Manage your finances" className="shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white px-4 py-4 rounded-lg text-sm font-medium flex flex-col items-center gap-2 hover:scale-105 transition`}
            >
              <action.icon className="w-5 h-5" />
              {action.name}
            </button>
          ))}

        </div>
      </Box>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* RECENT TRANSACTIONS */}
        <ListBox
          title="Recent Transactions"
          subtitle={`${recentTransactions.length} total transactions`}
          items={recentTransactions}
          maxItems={4}
          showViewAll={true}
          onViewAll={handleViewAllTransactions}
          viewAllText="View Transaction History"
          renderItem={renderTransactionItem}
          emptyMessage="No transactions found"
          icon={Clock}
          iconBgColor="bg-gray-700"
          iconColor="text-gray-400"
          className="shadow-lg"
        />

        {/* SUMMARY */}
        <Box title="Transaction Summary" subtitle="This month overview" className="shadow-lg">
          <div className="space-y-4">

            {summaryData.map((item, index) => (
              <SummaryRow key={index} {...item} />
            ))}

            <div className="pt-2 border-t border-gray-700 flex justify-between">
              <span className="text-gray-300 text-sm">Total Transactions</span>
              <span className="text-green-400 font-bold">
                {recentTransactions.length}
              </span>
            </div>

          </div>
        </Box>

      </div>
    </div>
  )
}

export default TransactionsPage