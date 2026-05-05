"use client"
import { useEffect, useState } from "react"
import { Edit, LogOut, DollarSign, BarChart2, Target, TrendingUp } from "lucide-react"
import Box from "./Box"
import StatBox from "./StatBox"
import { userAPI, dashboardAPI, clearTokens } from "../../api/api"
import { useSettings } from "../../Context/useSettings"
import { useNavigate } from "react-router-dom"


function Profile({ onNavigate }) {
  const [userProfile,    setUserProfile]    = useState(null)
  const [financialGoals, setFinancialGoals] = useState([])
  const [stats,          setStats]          = useState([])
  const [loading,        setLoading]        = useState(true)

  // ✅ Currency + formatters from global context
  const { formatAmount, currencySymbol } = useSettings()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRes = await userAPI.getProfile()
        const user    = userRes.data.user
        const account = userRes.data.account
        const balance = userRes.data.balance

        let dashStats = {}
        try {
          const dashRes = await dashboardAPI.getStats()
          dashStats = dashRes.data.stats || {}
          setFinancialGoals(dashRes.data.goals || [])
        } catch {
          console.warn("Dashboard stats API not available")
        }

        setUserProfile({
          name:      `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.name || "User",
          email:     user.email,
          joinDate:  user.join_date || user.created_at,
          // ✅ No hardcoded image — show empty circle if null
          avatar:    user.image_url || user.profile_image || null,

          accountBalance:           balance?.balance || 0,
          avgTransactionsPerMonth:  dashStats.avg_transactions || 0,
          lastMonthSavings: {
            value:             dashStats.savings        || 0,
            percentageChange:  dashStats.savings_change || 0,
            trend:             (dashStats.savings_change || 0) >= 0 ? "up" : "down",
          },
          budgetLimit: account?.budget_limit || 0,
          currency:    account?.currency_symbol || currencySymbol,
          timezone:    account?.timezone_country || "UTC",
        })

        // ✅ Stats use formatAmount so they update when currency changes
        setStats([
          {
            id: 1, title: "Account Balance",
            value: formatAmount(balance?.balance || 0),
            icon: DollarSign, iconBgColor: "bg-green-900",  iconColor: "text-green-400",
            trend: "up", trendValue: "", trendLabel: "current balance",
          },
          {
            id: 2, title: "Avg Transactions",
            value: String(dashStats.avg_transactions || 0),
            icon: BarChart2,  iconBgColor: "bg-blue-900",   iconColor: "text-blue-400",
            trend: "up", trendValue: "", trendLabel: "per month",
          },
          {
            id: 3, title: "Savings",
            value: formatAmount(dashStats.savings || 0),
            icon: TrendingUp, iconBgColor: "bg-purple-900", iconColor: "text-purple-400",
            trend: (dashStats.savings_change || 0) >= 0 ? "up" : "down",
            trendValue: `${dashStats.savings_change || 0}%`,
            trendLabel: "vs previous month",
          },
          {
            id: 4, title: "Budget Limit",
            value: formatAmount(account?.budget_limit || 0),
            icon: Target,     iconBgColor: "bg-yellow-900", iconColor: "text-yellow-400",
            trend: "", trendValue: "", trendLabel: "monthly limit",
          },
        ])
      } catch (err) {
        console.error("Profile API error:", err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-compute stats when currency symbol changes (user saves settings)
  useEffect(() => {
    if (!userProfile) return
    setStats((prev) =>
      prev.map((s) => {
        if (s.id === 1) return { ...s, value: formatAmount(userProfile.accountBalance) }
        if (s.id === 3) return { ...s, value: formatAmount(userProfile.lastMonthSavings.value) }
        if (s.id === 4) return { ...s, value: formatAmount(userProfile.budgetLimit) }
        return s
      })
    )
  }, [formatAmount, currencySymbol]) // eslint-disable-line

  const navigate = useNavigate()
  const handleLogout = () => {
    clearTokens()
    navigate("/signin")
  }

  if (loading || !userProfile) {
    return (
      <div className="p-6 text-white bg-black min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#4ADE80] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading profile…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-black text-white space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-gray-400 text-sm">Manage your account</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />Logout
          </button>
          <button
            onClick={() => onNavigate("EditProfile")}
            className="px-4 py-2 bg-[#4ADE80] text-black hover:bg-[#3BC470] rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <Edit className="w-4 h-4" />Edit
          </button>
        </div>
      </div>

      {/* PROFILE CARD */}
      <Box title="Profile">
        {/* ✅ No hardcoded image — show avatar if it exists, otherwise an empty circle */}
        {userProfile.avatar ? (
          <img
            src={userProfile.avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-gray-600"
            onError={(e) => { e.target.style.display = "none" }}
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
            <span className="text-3xl text-gray-400 font-bold select-none">
              {userProfile.name?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
        )}
        <h2 className="text-center mt-3 font-bold text-xl">{userProfile.name}</h2>
        <p className="text-center text-gray-400 text-sm">{userProfile.email}</p>
        {userProfile.joinDate && (
          <p className="text-center text-gray-500 text-xs mt-1">
            Member since {new Date(userProfile.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
          </p>
        )}
      </Box>

      {/* STATS — ✅ amounts use formatAmount (currency-aware) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatBox key={s.id} {...s} />
        ))}
      </div>

      {/* PREFERENCES */}
      <Box title="Preferences">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Currency</p>
            {/* ✅ Shows the live currencySymbol from context, not the stale API value */}
            <p className="text-white font-medium">{currencySymbol} ({userProfile.currency})</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Timezone</p>
            <p className="text-white font-medium">{userProfile.timezone}</p>
          </div>
        </div>
      </Box>

      {/* GOALS */}
      <Box title="Financial Goals">
        <div className="space-y-4">
          {financialGoals.length === 0 ? (
            <p className="text-gray-400 text-sm">No financial goals set yet.</p>
          ) : (
            financialGoals.map((g, i) => {
              const percent = Math.min((g.current / g.target) * 100, 100)
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{g.name}</span>
                    <span className="text-gray-400">{formatAmount(g.current)} / {formatAmount(g.target)}</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#4ADE80] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-right text-gray-500">{percent.toFixed(0)}% complete</p>
                </div>
              )
            })
          )}
        </div>
      </Box>

    </div>
  )
}

export default Profile