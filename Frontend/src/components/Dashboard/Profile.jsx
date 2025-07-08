"use client"
import { useState } from "react"
import {
  Edit,
  Mail,
  Phone,
  Calendar,
  Shield,
  LogOut,
  Clock,
  DollarSign,
  BarChart2,
  Target,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import Box from "./Box"
import StatBox from "./StatBox"
import profileimage from "../../assets/pic1.png" // Importing the user profile image

function Profile({ onNavigate }) {
  // User profile data - this would typically come from your auth/database system
  const [userProfile] = useState({
    name: "Chris Flores",
    email: "lucia.rodriguez@example.com",
    phone: "+1 (555) 123-4567",
    joinDate: "January 2023",
    avatar: profileimage,
    isOnline: true,
    bio: "Financial enthusiast focused on smart budgeting and investment strategies. Love tracking expenses and optimizing savings.",
    accountBalance: 12450,
    avgTransactionsPerMonth: 350,
    lastMonthSavings: {
      value: 2050,
      percentageChange: 15.3,
      trend: "up",
    },
    budgetLimit: 1000,
    accountCreated: "Jan 15, 2023",
    currency: "USD",
    timezone: "PST",
    emailVerified: true,
    phoneVerified: true,
  })

  // Financial goals data (kept as is)
  const [financialGoals] = useState([
    { name: "Emergency Fund", target: 10000, current: 7500, color: "bg-green-500" },
    { name: "Vacation Savings", target: 5000, current: 2800, color: "bg-blue-500" },
    { name: "Investment Goal", target: 15000, current: 12000, color: "bg-purple-500" },
  ])

  const handleEditProfile = () => {
    onNavigate("EditProfile")
  }

  const handleLogout = () => {
    alert("Logged out successfully!") // Simulate logout
    onNavigate("Dashboard") // Navigate to dashboard or login page after logout
  }

  // Profile stats data - UPDATED
  const profileStats = [
    {
      id: 1,
      title: "Account Balance",
      value: `$${userProfile.accountBalance.toLocaleString()}`,
      icon: DollarSign,
      iconBgColor: "bg-green-900",
      iconColor: "text-green-400",
      trend: userProfile.lastMonthSavings.trend,
      trendValue: `+12.5%`,
      trendLabel: "vs last month",
    },
    {
      id: 2,
      title: "Avg. Monthly Transactions",
      value: `$${userProfile.avgTransactionsPerMonth.toLocaleString()}`,
      icon: BarChart2,
      iconBgColor: "bg-blue-900",
      iconColor: "text-blue-400",
      trend: "up",
      trendValue: "+5%",
      trendLabel: "vs last month",
    },
    {
      id: 3,
      title: "Last Month Savings",
      value: `$${userProfile.lastMonthSavings.value.toLocaleString()}`,
      icon: userProfile.lastMonthSavings.trend === "up" ? TrendingUp : TrendingDown,
      iconBgColor: "bg-purple-900",
      iconColor: "text-purple-400",
      trend: userProfile.lastMonthSavings.trend,
      trendValue: `${userProfile.lastMonthSavings.trend === "up" ? "+" : "-"}${userProfile.lastMonthSavings.percentageChange}%`,
      trendLabel: "vs previous month",
    },
    {
      id: 4,
      title: "Budget Limit",
      value: userProfile.budgetLimit > 0 ? `$${userProfile.budgetLimit.toLocaleString()}` : "Not Set",
      icon: Target,
      iconBgColor: "bg-yellow-900",
      iconColor: "text-yellow-400",
      trend: "",
      trendValue: "",
      trendLabel: "",
    },
  ]

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-black text-white space-y-8">
      {/* ===== HEADER SECTION ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-gray-300 text-sm">View and manage your personal and financial overview</p>
        </div>
        <div className="flex gap-3">
          {/* Replaced Settings button with Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
          <button
            onClick={handleEditProfile}
            className="flex items-center gap-2 px-4 py-2 bg-[#4ADE80] text-black rounded-lg hover:bg-[#3BC470] transition-colors duration-200 font-medium"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* ===== PROFILE OVERVIEW SECTION ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Box title="Profile Information" className="lg:col-span-1 shadow-lg">
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img
                  src={userProfile.avatar || "/placeholder.svg?height=120&width=120"}
                  alt={`${userProfile.name}'s profile`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-600"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=120&width=120"
                  }}
                />
                {/* Online Status */}
                {userProfile.isOnline && (
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-[#1C2C26] rounded-full"></div>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-white">{userProfile.name}</h2>
                <p className="text-sm text-gray-400">{userProfile.role}</p>
              </div>
            </div>

            {/* Bio */}
            {userProfile.bio && (
              <div className="p-4 bg-gray-800/30 rounded-lg">
                <h3 className="text-sm font-medium text-gray-300 mb-2">About</h3>
                <p className="text-sm text-white leading-relaxed">{userProfile.bio}</p>
              </div>
            )}
          </div>
        </Box>

        {/* Contact & Account Info */}
        <Box title="Account Details" className="lg:col-span-2 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Email */}
            <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg">
              <div className="h-10 w-10 flex items-center justify-center bg-blue-900 rounded-lg">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                <p className="text-sm font-medium text-white">{userProfile.email}</p>
                {userProfile.emailVerified && (
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Verified
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg">
              <div className="h-10 w-10 flex items-center justify-center bg-green-900 rounded-lg">
                <Phone className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Phone</p>
                <p className="text-sm font-medium text-white">{userProfile.phone}</p>
                {userProfile.phoneVerified && (
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Verified
                  </p>
                )}
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg">
              <div className="h-10 w-10 flex items-center justify-center bg-orange-900 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Member Since</p>
                <p className="text-sm font-medium text-white">{userProfile.joinDate}</p>
              </div>
            </div>
          </div>
        </Box>
      </div>

      {/* ===== ACCOUNT STATISTICS ===== */}
      <div>
        <h2 className="text-xl font-bold  text-white mb-4">Account Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {profileStats.map((stat) => (
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
              maxWidth="max-w-full"
              className="shadow-lg"
            />
          ))}
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Preferences - UPDATED */}
        <Box title="Preferences" subtitle="Customize your experience" className="shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-white">Currency</p>
                  <p className="text-xs text-gray-400">Default currency for transactions</p>
                </div>
              </div>
              <span className="text-sm text-gray-300">{userProfile.currency}</span>
            </div>

            {/* Budget Limit Setup - ADDED */}
            <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm font-medium text-white">Budget Limit</p>
                  <p className="text-xs text-gray-400">Your monthly spending target</p>
                </div>
              </div>
              <span className="text-sm text-gray-300">
                {userProfile.budgetLimit > 0 ? `$${userProfile.budgetLimit.toLocaleString()}` : "Not Set"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-white">Timezone</p>
                  <p className="text-xs text-gray-400">Your local timezone</p>
                </div>
              </div>
              <span className="text-sm text-gray-300">{userProfile.timezone}</span>
            </div>

            <button
              onClick={() => onNavigate("Settings")}
              className="w-full text-sm text-[#4ADE80] hover:text-[#3BC470] font-medium transition py-2 hover:bg-gray-800 rounded-lg"
            >
              All Preferences
            </button>
          </div>
        </Box>
      </div>
    </div>
  )
}

export default Profile
