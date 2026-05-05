"use client"
import { useState, useEffect, useCallback } from "react"
import { Clock, TrendingUp, TrendingDown, BarChart3, HistoryIcon } from "lucide-react"
import ListBox from "./ListBox"
import Box from "./Box"
import SummaryRow from "./Summary_Row"
import { transactionAPI, dashboardAPI } from "../../api/api"
import { useSettings } from "../../context/useSettings"

function TransactionsPage({ onNavigate, onAddTransaction }) {
  const [recentTransactions, setRecentTransactions] = useState([])
  const [summaryData, setSummaryData]               = useState([])
  const [loading, setLoading]                       = useState(true)

  const { formatAmount, formatDate } = useSettings()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [txRes, dashRes] = await Promise.all([
        transactionAPI.getRecent(6),
        dashboardAPI.getSummary(),
      ])

      const txs = (txRes?.data?.transactions || []).map((t) => ({
        id:          t.transaction_id,
        description: t.title,
        // ✅ Use case-insensitive check so "Income"/"income" both work
        amount:      t.type?.toLowerCase() === "income" ? +t.amount : -t.amount,
        rawDate:     t.transaction_date,
        rawTime:     t.transaction_time,
        category:    t.category,
        type:        t.type,
      }))
      setRecentTransactions(txs)

      const stats = dashRes?.data?.stats || {}
      setSummaryData([
        { label: "Total Income",       rawValue: stats.monthly_income,   bg: "bg-green-900/20", textColor: "text-green-400" },
        { label: "Total Expenses",     rawValue: stats.monthly_expenses,  bg: "bg-red-900/20",   textColor: "text-red-400"   },
        { label: "Last Month Balance", rawValue: stats.previous_balance,  bg: "bg-blue-900/20",  textColor: "text-blue-400"  },
      ])
    } catch (err) {
      console.error("TransactionsPage API error:", err?.message || err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const quickActions = [
    { name: "Add Expense",  color: "bg-red-600 hover:bg-red-700",     icon: TrendingDown, action: () => onAddTransaction("expense") },
    { name: "Add Income",   color: "bg-green-600 hover:bg-green-700", icon: TrendingUp,   action: () => onAddTransaction("income")  },
    { name: "View Reports", color: "bg-purple-600 hover:bg-purple-700",icon: BarChart3,    action: () => onNavigate("Reports")       },
    { name: "View History", color: "bg-blue-600 hover:bg-blue-700",   icon: HistoryIcon,  action: () => onNavigate("History")       },
  ]

  const renderTransactionItem = (t) => (
    <div className="flex justify-between border-b border-gray-700 pb-3 hover:bg-gray-800/30 px-2 py-1 rounded transition cursor-pointer">
      <div>
        <p className="text-sm font-medium text-white">{t.description}</p>
        {/* ✅ formatDate now uses safeParseDatetime — no more "Invalid Date" */}
        <p className="text-xs text-gray-400">{formatDate(t.rawDate, t.rawTime)}</p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${t.amount > 0 ? "text-green-400" : "text-red-400"}`}>
          {t.amount > 0 ? "+" : "-"}{formatAmount(Math.abs(t.amount))}
        </p>
        <p className="text-xs text-gray-400">{t.category}</p>
      </div>
    </div>
  )

  if (loading) return (
    <div className="p-6 text-white flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#4ADE80] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400">Loading transactions…</p>
      </div>
    </div>
  )

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-black text-white space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-gray-300 text-sm lg:text-base">Manage your financial transactions and quick actions.</p>
      </div>

      <Box title="Quick Actions" subtitle="Manage your finances" className="shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((a, i) => (
            <button key={i} onClick={a.action} className={`${a.color} text-white px-4 py-4 rounded-lg text-sm font-medium flex flex-col items-center gap-2 hover:scale-105 transition`}>
              <a.icon className="w-5 h-5" />{a.name}
            </button>
          ))}
        </div>
      </Box>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ListBox
          title="Recent Transactions"
          subtitle={`${recentTransactions.length} recent transactions`}
          items={recentTransactions}
          maxItems={4}
          showViewAll={true}
          onViewAll={() => onNavigate("History")}
          viewAllText="View Transaction History"
          renderItem={renderTransactionItem}
          emptyMessage="No transactions yet. Add your first one!"
          icon={Clock}
          iconBgColor="bg-gray-700"
          iconColor="text-gray-400"
          className="shadow-lg"
        />

        <Box title="Transaction Summary" subtitle="This month overview" className="shadow-lg">
          <div className="space-y-4">
            {summaryData.map((item, i) => (
              <SummaryRow
                key={i}
                label={item.label}
                value={formatAmount(item.rawValue || 0)}
                bg={item.bg}
                textColor={item.textColor}
              />
            ))}
            <div className="pt-2 border-t border-gray-700 flex justify-between">
              <span className="text-gray-300 text-sm">Recent Transactions Loaded</span>
              <span className="text-green-400 font-bold">{recentTransactions.length}</span>
            </div>
          </div>
        </Box>
      </div>
    </div>
  )
}

export default TransactionsPage