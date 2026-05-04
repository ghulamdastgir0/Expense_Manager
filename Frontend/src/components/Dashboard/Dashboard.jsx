"use client";
import { useState, useEffect, useCallback } from "react";
import NavBar from "./NavBar";
import BarChat from "./BarChart";
import StatBox from "./StatBox";
import ChartBox from "./ChartBox";
import Box from "./Box";
import AddTransaction from "./Addtransaction";
import Reports from "./Reports";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard
} from "lucide-react";
import TransactionsPage from "./TransactionsPage";
import History from "./History";
import SummaryRow from "./Summary_Row";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import Settings from "./Settings";
import { dashboardAPI } from "../../api/api";
import { SettingsProvider } from "../../context/SettingsProvider";
import { useSettings } from "../../context/useSettings";
import { useRef } from "react";

function DashboardInner() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [transactionType, setTransactionType] = useState("expense");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { formatAmount, refreshSettings } = useSettings();

  const isFetchingRef = useRef(false);

  const fetchDashboard = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      setLoading(true);
      const [res, alertRes] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.getBudgetAlert()
      ]);
      setDashboardData({ ...res.data, alert: alertRes.data });
    } catch (err) {
      console.error("Dashboard API error:", err.message);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (currentPage === "Dashboard") fetchDashboard();
  }, [currentPage, fetchDashboard]);

  const handleNavigation = (page) => setCurrentPage(page);
  const handleAddTransaction = (type = "expense") => {
    setTransactionType(type);
    setCurrentPage("AddTransaction");
  };

  const statsData = dashboardData
    ? [
        {
          id: 1,
          title: "Total Balance",
          value: formatAmount(dashboardData.stats.total_balance),
          icon: DollarSign,
          iconBgColor: "bg-green-900",
          iconColor: "text-green-400",
          trend: dashboardData.stats.balance_trend >= 0 ? "up" : "down",
          trendValue: `${dashboardData.stats.balance_trend}%`,
          trendLabel: "vs last month"
        },
        {
          id: 2,
          title: "Monthly Income",
          value: formatAmount(dashboardData.stats.monthly_income),
          icon: TrendingUp,
          iconBgColor: "bg-blue-900",
          iconColor: "text-blue-400",
          trend: "up",
          trendValue: "",
          trendLabel: "this month"
        },
        {
          id: 3,
          title: "Monthly Expenses",
          value: formatAmount(dashboardData.stats.monthly_expenses),
          icon: TrendingDown,
          iconBgColor: "bg-red-900",
          iconColor: "text-red-400",
          trend: "down",
          trendValue: "",
          trendLabel: "this month"
        },
        {
          id: 4,
          title: "Last Month Balance",
          value: formatAmount(dashboardData.stats.previous_balance),
          icon: CreditCard,
          iconBgColor: "bg-purple-900",
          iconColor: "text-purple-400",
          trend: "up",
          trendValue: "",
          trendLabel: "previous"
        }
      ]
    : [];

  const listOfData = dashboardData
    ? dashboardData.top_expenses.map((i) => ({
        category:
          i.category_name ||
          i.category ||
          i.name ||
          i.title ||
          i.label ||
          Object.values(i)[0] ||
          "Unknown",
        expense: parseFloat(
          i.expenses || i.expense || i.amount || i.total || i.total_spent || 0
        )
      }))
    : [];

  const summaryData = dashboardData
    ? [
        {
          label: "Total Income",
          value: formatAmount(dashboardData.stats.monthly_income),
          bg: "bg-green-900/20",
          textColor: "text-green-400"
        },
        {
          label: "Total Expenses",
          value: formatAmount(dashboardData.stats.monthly_expenses),
          bg: "bg-red-900/20",
          textColor: "text-red-400"
        },
        {
          label: "Last Month Balance",
          value: formatAmount(dashboardData.stats.previous_balance),
          bg: "bg-blue-900/20",
          textColor: "text-blue-400"
        }
      ]
    : [];

  const renderDashboard = () => {
    if (loading)
      return (
        <div className="p-6 text-white flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#4ADE80] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-400">Loading dashboard…</p>
          </div>
        </div>
      );

    if (!dashboardData)
      return (
        <div className="p-6 text-red-400">
          Failed to load.{" "}
          <button onClick={fetchDashboard} className="underline">
            Retry
          </button>
        </div>
      );

    const { budget, alert } = dashboardData;

    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-black text-white space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-300 text-sm lg:text-base">
            Welcome back! Here's your financial overview.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((s) => (
            <StatBox
              key={s.id}
              {...s}
              className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            />
          ))}
        </div>

        <ChartBox
          title="Top 5 Expenses"
          headerAction={
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>This Month</span>
            </div>
          }
        >
          {listOfData.length > 0 ? (
            <BarChat data={listOfData} dataKey="expense" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No expense data this month
            </div>
          )}
        </ChartBox>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Box
            title="Budget Progress"
            subtitle="Monthly spending against your budget"
          >
            <div className="space-y-4">
              <SummaryRow
                label="Monthly Budget Limit"
                value={formatAmount(budget.limit)}
                bg="bg-green-900/20"
                textColor="text-green-400"
              />
              <SummaryRow
                label="Remaining Budget"
                value={formatAmount(budget.remaining)}
                bg="bg-red-900/20"
                textColor={
                  budget.is_exceeded ? "text-red-400" : "text-green-400"
                }
              />
              <SummaryRow
                label="Budget Usage"
                value={`${budget.percentage.toFixed(1)}%`}
                bg="bg-blue-900/20"
                textColor="text-blue-400"
              />

              {budget.limit > 0 && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${budget.percentage >= 100 ? "bg-red-500" : budget.percentage >= 80 ? "bg-orange-500" : "bg-[#4ADE80]"}`}
                    style={{ width: `${Math.min(100, budget.percentage)}%` }}
                  />
                </div>
              )}

              {alert?.alert_level === "exceeded" && (
                <p className="text-red-400 text-xs bg-red-900/20 border border-red-700 rounded-lg px-3 py-2">
                  ⚠️ {alert.message}
                </p>
              )}
              {alert?.alert_level === "warning" && (
                <p className="text-yellow-400 text-xs bg-yellow-900/20 border border-yellow-700 rounded-lg px-3 py-2">
                  ⚠️ {alert.message}
                </p>
              )}

              <div className="pt-4 text-center">
                <button
                  onClick={() => handleNavigation("Settings")}
                  className="px-6 py-3 bg-[#4ADE80] text-black font-semibold rounded-lg hover:bg-[#3BC470] transition-colors"
                >
                  Manage Budget Settings
                </button>
              </div>
            </div>
          </Box>

          <Box title="Financial Summary" subtitle="This month overview">
            <div className="space-y-4">
              {summaryData.map((item, i) => (
                <SummaryRow key={i} {...item} />
              ))}
              {dashboardData.recent_transactions?.length > 0 && (
                <div className="pt-2 border-t border-gray-700 space-y-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Recent Activity
                  </p>
                  {dashboardData.recent_transactions.slice(0, 3).map((tx) => (
                    <div
                      key={tx.transaction_id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-300 truncate max-w-[60%]">
                        {tx.title}
                      </span>
                      <span
                        className={
                          tx.type === "Income"
                            ? "text-green-400 font-medium"
                            : "text-red-400 font-medium"
                        }
                      >
                        {tx.type === "Income" ? "+" : "-"}
                        {formatAmount(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Box>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <NavBar currentPage={currentPage} onNavigate={handleNavigation} />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="lg:hidden h-16 bg-[#1C2C26] border-b border-gray-700 flex items-center px-4 sticky top-0 z-30">
          <div className="ml-12 text-white font-semibold">{currentPage}</div>
        </div>
        {currentPage === "Dashboard" && renderDashboard()}
        {currentPage === "Transactions" && (
          <TransactionsPage
            onNavigate={handleNavigation}
            onAddTransaction={handleAddTransaction}
          />
        )}
        {currentPage === "AddTransaction" && (
          <AddTransaction
            preSelectedType={transactionType}
            onSuccess={() => {
              handleNavigation("Transactions");
              fetchDashboard();
            }}
          />
        )}
        {currentPage === "History" && <History onNavigate={handleNavigation} />}
        {currentPage === "Reports" && <Reports onNavigate={handleNavigation} />}
        {currentPage === "Profile" && <Profile onNavigate={handleNavigation} />}
        {currentPage === "EditProfile" && (
          <EditProfile onNavigate={handleNavigation} />
        )}
        {currentPage === "Settings" && (
          <Settings
            onNavigate={handleNavigation}
            onSettingsSaved={() => {
              refreshSettings();
              fetchDashboard();
            }}
          />
        )}
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <SettingsProvider>
      <DashboardInner />
    </SettingsProvider>
  );
}

export default Dashboard;
