"use client";
import { useState } from "react";
import {
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  HistoryIcon
} from "lucide-react";
import ListBox from "./ListBox";
import Box from "./Box";
import SummaryRow from "./Summary_Row";

function TransactionsPage({ onNavigate, onAddTransaction }) {
  // Transactions data
  const [recentTransactions] = useState([
    {
      id: 1,
      description: "Grocery Store",
      amount: -85.5,
      time: "2 hours ago",
      category: "Food"
    },
    {
      id: 2,
      description: "Salary Deposit",
      amount: 2500.0,
      time: "1 day ago",
      category: "Income"
    },
    {
      id: 3,
      description: "Gas Station",
      amount: -45.2,
      time: "2 days ago",
      category: "Transport"
    },
    {
      id: 4,
      description: "Netflix",
      amount: -15.99,
      time: "3 days ago",
      category: "Entertainment"
    },
    {
      id: 5,
      description: "Electric Bill",
      amount: -120.0,
      time: "5 days ago",
      category: "Utilities"
    },
    {
      id: 6,
      description: "Coffee Shop",
      amount: -12.5,
      time: "1 week ago",
      category: "Food"
    }
  ]);

  // Quick actions data with navigation
  const quickActions = [
    {
      name: "Add Expense",
      color: "bg-red-600 hover:bg-red-700",
      icon: TrendingDown,
      action: () => onAddTransaction()
    },
    {
      name: "Add Income",
      color: "bg-green-600 hover:bg-green-700",
      icon: TrendingUp,
      action: () => onAddTransaction()
    },
    {
      name: "View Reports",
      color: "bg-purple-600 hover:bg-purple-700",
      icon: BarChart3,
      action: () => onNavigate("Reports")
    },
    {
      name: "View History",
      color: "bg-blue-600 hover:bg-blue-700",
      icon: HistoryIcon,
      action: () => onNavigate("History")
    }
  ];

  const summaryData = [
    {
      label: "Total Income",
      value: "$5,200",
      bg: "bg-green-900/20",
      textColor: "text-green-400"
    },
    {
      label: "Total Expenses",
      value: "$3,150",
      bg: "bg-red-900/20",
      textColor: "text-red-400"
    },
    {
      label: "Net Amount",
      value: "$2,050",
      bg: "bg-blue-900/20",
      textColor: "text-blue-400"
    }
  ];

  // Handle view all transactions - now goes to History
  const handleViewAllTransactions = () => {
    onNavigate("History");
  };

  // Render transaction item with enhanced styling
  const renderTransactionItem = (transaction) => (
    <div className="flex justify-between border-b border-gray-700 pb-3 hover:bg-gray-800/30 px-2 py-1 rounded transition-colors cursor-pointer">
      <div>
        <p className="text-sm font-medium text-white">
          {transaction.description}
        </p>
        <p className="text-xs text-gray-400">{transaction.time}</p>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-semibold ${
            transaction.amount > 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {transaction.amount > 0 ? "+" : "-"}$
          {Math.abs(transaction.amount).toFixed(2)}
        </p>
        <p className="text-xs text-gray-400">{transaction.category}</p>
      </div>
    </div>
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-black text-white space-y-8">
      {/* ===== HEADER SECTION ===== */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white">Transactions</h1>
        <p className="text-gray-300 text-sm lg:text-base">
          Manage your financial transactions and quick actions.
        </p>
      </div>

      {/* ===== QUICK ACTIONS SECTION ===== */}
      <Box
        title="Quick Actions"
        subtitle="Manage your finances"
        className="shadow-lg max-w-full"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`${action.color} text-white px-4 py-4 rounded-lg text-sm font-medium transition-all duration-200 flex flex-col items-center gap-2 hover:scale-105 transform`}
              onClick={action.action}
            >
              <action.icon className="w-5 h-5" />
              {action.name}
            </button>
          ))}
        </div>
      </Box>

      {/* ===== RECENT TRANSACTIONS SECTION ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          className="shadow-lg"
          icon={Clock}
          iconBgColor="bg-gray-700"
          iconColor="text-gray-400"
        />

        {/* ===== TRANSACTION SUMMARY ===== */}
        <Box
          title="Transaction Summary"
          subtitle="This month overview"
          className="shadow-lg"
        >
          <div className="space-y-4">
            {summaryData.map((item, index) => (
              <SummaryRow key={index} {...item} />
            ))}
            <div className="pt-2 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">
                  Total Transactions
                </span>
                <span className="text-[#4ADE80] font-bold">
                  {recentTransactions.length}
                </span>
              </div>
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
}

export default TransactionsPage;
