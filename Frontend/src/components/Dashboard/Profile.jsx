"use client"
import { useState } from "react"
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Activity,
  Settings,
  Clock,
  Globe,
  DollarSign,
  PieChart
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
    location: "San Francisco, CA",
    joinDate: "January 2023",
    avatar: profileimage,
    isOnline: true,
    bio: "Financial enthusiast focused on smart budgeting and investment strategies. Love tracking expenses and optimizing savings.",
    // Account stats
    totalTransactions: 1247,
    accountBalance: 12450,
    monthlySavings: 2050,
    categoriesUsed: 8,
    // Additional profile data
    lastLogin: "2 hours ago",
    accountCreated: "Jan 15, 2023",
    currency: "USD",
    language: "English",
    timezone: "PST",
    emailVerified: true,
    phoneVerified: true,
  })

  // Financial goals data
  const [financialGoals] = useState([
    { name: "Emergency Fund", target: 10000, current: 7500, color: "bg-green-500" },
    { name: "Vacation Savings", target: 5000, current: 2800, color: "bg-blue-500" },
    { name: "Investment Goal", target: 15000, current: 12000, color: "bg-purple-500" },
  ])

 

  const handleEditProfile = () => {
    onNavigate("EditProfile")
  }

  // Profile stats data
  const profileStats = [
    {
      id: 1,
      title: "Total Transactions",
      value: userProfile.totalTransactions.toLocaleString(),
      icon: Activity,
      iconBgColor: "bg-blue-900",
      iconColor: "text-blue-400",
      trend: "up",
      trendValue: "+23",
      trendLabel: "this month",
    },
    {
      id: 2,
      title: "Account Balance",
      value: `$${userProfile.accountBalance.toLocaleString()}`,
      icon: Shield,
      iconBgColor: "bg-green-900",
      iconColor: "text-green-400",
      trend: "up",
      trendValue: "+12.5%",
      trendLabel: "vs last month",
    },
    {
      id: 3,
      title: "Monthly Savings",
      value: `$${userProfile.monthlySavings.toLocaleString()}`,
      icon: Calendar,
      iconBgColor: "bg-purple-900",
      iconColor: "text-purple-400",
      trend: "up",
      trendValue: "+8.2%",
      trendLabel: "vs last month",
    },
     {
      id: 4,
      title: "Categories Used",
      value: `${userProfile.categoriesUsed}/10`,
      icon: PieChart,
      iconBgColor: "bg-indigo-900",
      iconColor: "text-indigo-400",
      trend: "up",
      trendValue: "+2",
      trendLabel: "new categories",
    },
  ]

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-black text-white space-y-8">
      {/* ===== HEADER SECTION ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-gray-300 text-sm">Manage your account information and preferences</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate("Settings")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
          >
            <Settings className="w-4 h-4" />
            Settings
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Location */}
            <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg">
              <div className="h-10 w-10 flex items-center justify-center bg-purple-900 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Location</p>
                <p className="text-sm font-medium text-white">{userProfile.location}</p>
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

            {/* Last Login */}
            <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg">
              <div className="h-10 w-10 flex items-center justify-center bg-indigo-900 rounded-lg">
                <Clock className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Last Login</p>
                <p className="text-sm font-medium text-white">{userProfile.lastLogin}</p>
              </div>
            </div>

            
          </div>
        </Box>
      </div>

      {/* ===== ACCOUNT STATISTICS ===== */}
      <div>
        <h2 className="text-xl font-bold  text-white mb-4">Account Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* ===== FINANCIAL GOALS & RECENT ACTIVITY ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Goals */}
        <Box title="Financial Goals" subtitle="Track your savings progress" className="shadow-lg">
          <div className="space-y-4">
            {financialGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white font-medium">{goal.name}</span>
                  <span className="text-gray-400">
                    ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className={`${goal.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400">
                  {Math.round((goal.current / goal.target) * 100)}% complete • $
                  {(goal.target - goal.current).toLocaleString()} remaining
                </p>
              </div>
            ))}
            <button
              onClick={() => onNavigate("Goals")}
              className="w-full mt-4 text-sm text-[#4ADE80] hover:text-[#3BC470] font-medium transition py-2 hover:bg-gray-800 rounded-lg"
            >
              Manage Goals
            </button>
          </div>
        </Box>

       

        {/* Preferences */}
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

            <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white">Language</p>
                  <p className="text-xs text-gray-400">Interface language</p>
                </div>
              </div>
              <span className="text-sm text-gray-300">{userProfile.language}</span>
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
