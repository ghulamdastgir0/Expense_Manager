"use client"
import { useEffect, useState } from "react"
import {
  Edit,
  Mail,
  Phone,
  Calendar,
  Shield,
  LogOut,
  DollarSign,
  BarChart2,
  Target,
  TrendingUp,
} from "lucide-react"
import Box from "./Box"
import StatBox from "./StatBox"
import profileimage from "../../assets/pic1.png"
import { userAPI, dashboardAPI } from "../../api/api"

function Profile({ onNavigate }) {
  const [userProfile, setUserProfile] = useState(null)
  const [financialGoals, setFinancialGoals] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  // ================= FETCH API =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [userRes, dashRes] = await Promise.all([
          userAPI.getProfile(),
          dashboardAPI.getStats(),
        ])

        const user = userRes.data.user
        const s = dashRes.data.stats

        setUserProfile({
          name: user.name,
          email: user.email,
          phone: user.phone,
          joinDate: user.created_at,
          avatar: user.profile_image || profileimage,
          isOnline: true,
          bio: user.bio || "No bio added",
          accountBalance: s.balance,
          avgTransactionsPerMonth: s.avg_transactions,
          lastMonthSavings: {
            value: s.savings,
            percentageChange: s.savings_change,
            trend: s.savings_change >= 0 ? "up" : "down",
          },
          budgetLimit: s.budget_limit,
          currency: s.currency,
          timezone: s.timezone,
          emailVerified: user.email_verified,
          phoneVerified: user.phone_verified,
        })

        setFinancialGoals(dashRes.data.goals || [])

        setStats([
          {
            id: 1,
            title: "Account Balance",
            value: `$${s.balance}`,
            icon: DollarSign,
            iconBgColor: "bg-green-900",
            iconColor: "text-green-400",
            trend: "up",
            trendValue: "+12%",
            trendLabel: "vs last month",
          },
          {
            id: 2,
            title: "Avg Transactions",
            value: s.avg_transactions,
            icon: BarChart2,
            iconBgColor: "bg-blue-900",
            iconColor: "text-blue-400",
            trend: "up",
            trendValue: "+5%",
            trendLabel: "vs last month",
          },
          {
            id: 3,
            title: "Savings",
            value: `$${s.savings}`,
            icon: TrendingUp,
            iconBgColor: "bg-purple-900",
            iconColor: "text-purple-400",
            trend: "up",
            trendValue: `${s.savings_change}%`,
            trendLabel: "vs previous month",
          },
          {
            id: 4,
            title: "Budget Limit",
            value: `$${s.budget_limit}`,
            icon: Target,
            iconBgColor: "bg-yellow-900",
            iconColor: "text-yellow-400",
            trend: "",
            trendValue: "",
            trendLabel: "",
          },
        ])
      } catch (err) {
        console.error("Profile API error:", err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // ================= ACTIONS =================
  const handleEditProfile = () => onNavigate("EditProfile")

  const handleLogout = () => {
    alert("Logged out successfully")
    onNavigate("Dashboard")
  }

  // ================= LOADING =================
  if (loading || !userProfile) {
    return (
      <div className="p-6 text-white bg-black min-h-screen">
        Loading profile...
      </div>
    )
  }

  // ================= UI =================
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
            className="px-4 py-2 bg-red-600 rounded-lg flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

          <button
            onClick={handleEditProfile}
            className="px-4 py-2 bg-green-500 text-black rounded-lg flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      {/* PROFILE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Box title="Profile">
          <img
            src={userProfile.avatar}
            className="w-24 h-24 rounded-full mx-auto"
          />
          <h2 className="text-center mt-2 font-bold">{userProfile.name}</h2>
          <p className="text-center text-gray-400">{userProfile.email}</p>
        </Box>

        <Box title="Account Info" className="lg:col-span-2">
          <p className="text-gray-300">{userProfile.bio}</p>

          <div className="mt-4 space-y-2 text-sm text-gray-400">
            <p>📧 {userProfile.email}</p>
            <p>📞 {userProfile.phone}</p>
            <p>📅 {userProfile.joinDate}</p>
          </div>
        </Box>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatBox key={s.id} {...s} />
        ))}
      </div>

      {/* GOALS (API READY) */}
      <Box title="Financial Goals">
        <div className="space-y-4">
          {financialGoals.map((g, i) => {
            const percent = (g.current / g.target) * 100

            return (
              <div key={i}>
                <div className="flex justify-between text-sm">
                  <span>{g.name}</span>
                  <span>{percent.toFixed(0)}%</span>
                </div>

                <div className="w-full bg-gray-700 h-2 rounded">
                  <div
                    className="bg-green-500 h-2 rounded"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Box>

      {/* PREFS */}
      <Box title="Preferences">
        <div className="text-gray-300 space-y-2">
          <p>Currency: {userProfile.currency}</p>
          <p>Timezone: {userProfile.timezone}</p>
        </div>
      </Box>

    </div>
  )
}

export default Profile