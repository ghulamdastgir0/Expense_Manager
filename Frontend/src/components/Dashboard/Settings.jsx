"use client"

import { useState, useEffect, useRef } from "react"
import {
  Trash2,
  UserX,
  Save,
  X,
  ChevronDown,
  Clock,
  KeyRound,
  SettingsIcon,
  DollarSign,
  Globe,
  Shield,
  AlertTriangle,
  CreditCard,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react"
import Box from "./Box"
import InputField from "../auth/inputField"

function Settings({ onNavigate }) {
  const [currency, setCurrency] = useState("USD")
  const [currencySearch, setCurrencySearch] = useState("USD ($) - US Dollar")
  const [budgetLimit, setBudgetLimit] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [timezone, setTimezone] = useState("GMT+00:00")
  const [currentTimeInTimezone, setCurrentTimeInTimezone] = useState("")
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false)
  const [showDeleteDataDialog, setShowDeleteDataDialog] = useState(false)
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)
  const currencyDropdownRef = useRef(null)

  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false)
  const [timezoneSearch, setTimezoneSearch] = useState("")
  const timezoneDropdownRef = useRef(null)

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showRetypePassword, setShowRetypePassword] = useState(false)

  // State for the password change modal
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPasswordModal, setCurrentPasswordModal] = useState("")
  const [newPasswordModal, setNewPasswordModal] = useState("")
  const [retypeNewPasswordModal, setRetypeNewPasswordModal] = useState("")
  const [passwordModalErrors, setPasswordModalErrors] = useState({})
  const [isPasswordChanging, setIsPasswordChanging] = useState(false)

  // Comprehensive list of currencies including PKR
  const currencyOptions = [
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "BRL", symbol: "R$", name: "Brazilian Real" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
    { code: "DKK", symbol: "kr", name: "Danish Krone" },
    { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
    { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "KRW", symbol: "₩", name: "South Korean Won" },
    { code: "MXN", symbol: "Mex$", name: "Mexican Peso" },
    { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
    { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
    { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
    { code: "PHP", symbol: "₱", name: "Philippine Peso" },
    { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
    { code: "PLN", symbol: "zł", name: "Polish Złoty" },
    { code: "RUB", symbol: "₽", name: "Russian Ruble" },
    { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
    { code: "SEK", symbol: "kr", name: "Swedish Krona" },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
    { code: "THB", symbol: "฿", name: "Thai Baht" },
    { code: "TRY", symbol: "₺", name: "Turkish Lira" },
    { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "ZAR", symbol: "R", name: "South African Rand" },
  ].sort((a, b) => a.name.localeCompare(b.name))

  // Generate all GMT +/- timezones with 0:30 interval
  const generateAllTimezoneOffsets = () => {
    const offsets = []
    for (let h = -12; h <= 12; h++) {
      for (let m = 0; m <= 30 && h < 13; m += 30) {
        const sign = h < 0 ? "-" : "+"
        const absH = Math.abs(h)
        const hourStr = String(absH).padStart(2, "0")
        const minuteStr = String(m).padStart(2, "0")
        offsets.push(`GMT${sign}${hourStr}:${minuteStr}`)
      }
    }
    const uniqueOffsets = Array.from(new Set(offsets))

    uniqueOffsets.sort((a, b) => {
      const parseOffset = (offsetStr) => {
        const [_, sign, hours, minutes] = offsetStr.match(/GMT([+-])(\d{2}):(\d{2})/)
        const totalMinutes = Number.parseInt(hours, 10) * 60 + Number.parseInt(minutes, 10)
        return sign === "-" ? -totalMinutes : totalMinutes
      }
      return parseOffset(a) - parseOffset(b)
    })

    return uniqueOffsets
  }

  const timezoneOptions = generateAllTimezoneOffsets()

  // Function to display current time based on GMT offset
  const displayTimeInTimezone = (gmtOffsetString) => {
    const now = new Date()
    const utcHours = now.getUTCHours()
    const utcMinutes = now.getUTCMinutes()

    const match = gmtOffsetString.match(/GMT([+-])(\d{2}):(\d{2})/)
    if (!match) return "Invalid Timezone"

    const sign = match[1] === "+" ? 1 : -1
    const offsetHours = Number.parseInt(match[2], 10)
    const offsetMinutes = Number.parseInt(match[3], 10)

    let targetHours = utcHours + sign * offsetHours
    let targetMinutes = utcMinutes + sign * offsetMinutes

    if (targetMinutes >= 60) {
      targetHours += Math.floor(targetMinutes / 60)
      targetMinutes %= 60
    } else if (targetMinutes < 0) {
      targetHours += Math.floor(targetMinutes / 60)
      targetMinutes = ((targetMinutes % 60) + 60) % 60
    }

    targetHours = ((targetHours % 24) + 24) % 24

    const formattedHours = String(targetHours).padStart(2, "0")
    const formattedMinutes = String(targetMinutes).padStart(2, "0")

    return `${formattedHours}:${formattedMinutes}`
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimeInTimezone(displayTimeInTimezone(timezone))
    }, 1000)
    return () => clearInterval(interval)
  }, [timezone])

  // Filtered currencies based on search input
  const filteredCurrencies = currencyOptions.filter((c) =>
    `${c.code} (${c.symbol}) - ${c.name}`.toLowerCase().includes(currencySearch.toLowerCase()),
  )

  // Filtered timezones based on search input
  const filteredTimezones = timezoneOptions.filter((tz) => tz.toLowerCase().includes(timezoneSearch.toLowerCase()))

  // Handle currency selection from dropdown
  const handleCurrencySelect = (selectedCurrency) => {
    setCurrency(selectedCurrency.code)
    setCurrencySearch(`${selectedCurrency.code} (${selectedCurrency.symbol}) - ${selectedCurrency.name}`)
    setShowCurrencyDropdown(false)
  }

  // Handle timezone selection from dropdown
  const handleTimezoneSelect = (selectedTimezone) => {
    setTimezone(selectedTimezone)
    setShowTimezoneDropdown(false)
    setTimezoneSearch("")
  }

  // Close currency dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
        setShowCurrencyDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close timezone dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timezoneDropdownRef.current && !timezoneDropdownRef.current.contains(event.target)) {
        setShowTimezoneDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    const newErrors = {}

    if (budgetLimit && (isNaN(Number.parseFloat(budgetLimit)) || Number.parseFloat(budgetLimit) <= 0)) {
      newErrors.budgetLimit = "Please enter a valid positive number for budget limit."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Settings saved:", { currency, budgetLimit, timezone })
      alert("Settings updated successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Failed to save settings. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDeleteAllData = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("All data deleted.")
      alert("All previous data has been deleted successfully.")
      onNavigate("Dashboard")
    } catch (error) {
      console.error("Error deleting data:", error)
      alert("Failed to delete data. Please try again.")
    } finally {
      setIsLoading(false)
      setShowDeleteDataDialog(false)
    }
  }

  const handleLogout = () => {
    alert("Logged out successfully!")
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Account deleted.")
      alert("Your account has been successfully deleted.")
    } catch (error) {
      console.error("Error deleting account:", error)
      alert("Failed to delete account. Please try again.")
    } finally {
      setIsLoading(false)
      setShowDeleteAccountDialog(false)
    }
  }

  // Password Change Modal Logic
  const validatePasswordChange = () => {
    const newModalErrors = {}
    if (currentPasswordModal !== "password123") {
      newModalErrors.currentPassword = "Existing password is incorrect."
    }
    if (!newPasswordModal) {
      newModalErrors.newPassword = "New password is required."
    } else if (newPasswordModal.length < 6) {
      newModalErrors.newPassword = "New password must be at least 6 characters."
    }
    if (newPasswordModal !== retypeNewPasswordModal) {
      newModalErrors.retypeNewPassword = "New passwords do not match."
    }
    if (newPasswordModal && newPasswordModal === currentPasswordModal) {
      newModalErrors.newPassword = "New password cannot be the same as the existing password."
    }
    setPasswordModalErrors(newModalErrors)
    return Object.keys(newModalErrors).length === 0
  }

  const handleChangePassword = async () => {
    if (!validatePasswordChange()) {
      return
    }

    setIsPasswordChanging(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Password changed successfully!")
      alert("Password changed successfully!")
      setShowPasswordModal(false)
      setCurrentPasswordModal("")
      setNewPasswordModal("")
      setRetypeNewPasswordModal("")
      setPasswordModalErrors({})
    } catch (error) {
      console.error("Error changing password:", error)
      alert("Failed to change password. Please try again.")
    } finally {
      setIsPasswordChanging(false)
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-black text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ===== HEADER SECTION ===== */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-800 rounded-xl">
              <SettingsIcon className="w-8 h-8 text-[#4ADE80]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-400 text-lg">Manage your application preferences and account settings</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-8">
          {/* ===== CURRENCY SELECTION ===== */}
          <Box
            title="Currency Preference"
            subtitle="Choose your preferred currency for transactions"
            className="shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#4ADE80]/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-[#4ADE80]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Currency Settings</h3>
                  <p className="text-gray-400">Select your default currency for all transactions</p>
                </div>
              </div>

              <div className="relative" ref={currencyDropdownRef}>
                <label htmlFor="currency-search" className="block text-sm font-medium text-gray-300 mb-3">
                  Select Currency
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                    className="w-full px-4 py-4 bg-white text-black rounded-xl border-0 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none text-lg font-medium text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span>{currencySearch}</span>
                    <ChevronDown
                      className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${showCurrencyDropdown ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {showCurrencyDropdown && (
                  <div className="absolute z-20 w-full bg-gray-800 border border-gray-600 rounded-xl mt-2 max-h-64 overflow-hidden shadow-2xl">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-700">
                      <input
                        type="text"
                        placeholder="Search currencies..."
                        value={currencySearch.includes(" - ") ? "" : currencySearch}
                        onChange={(e) => setCurrencySearch(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none placeholder-gray-400"
                        autoFocus
                      />
                    </div>

                    {/* Currency Options */}
                    <div className="max-h-48 overflow-y-auto">
                      {filteredCurrencies.length > 0 ? (
                        filteredCurrencies.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => handleCurrencySelect(c)}
                            className="block w-full text-left px-6 py-4 text-white hover:bg-gray-700 transition-colors border-b border-gray-700/50 last:border-b-0 group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-[#4ADE80] font-bold text-lg min-w-[3rem]">
                                  {c.symbol}
                                </span>
                                <div>
                                  <span className="font-semibold text-white group-hover:text-[#4ADE80] transition-colors">
                                    {c.code}
                                  </span>
                                  <span className="text-gray-300 ml-2">- {c.name}</span>
                                </div>
                              </div>
                              {currency === c.code && <div className="w-2 h-2 bg-[#4ADE80] rounded-full"></div>}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-6 py-8 text-center">
                          <DollarSign className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                          <p className="text-gray-400">No currencies found</p>
                          <p className="text-gray-500 text-sm">Try a different search term</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Selected Currency Display */}
                <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#4ADE80]/10 rounded-lg">
                      <span className="font-mono text-[#4ADE80] font-bold text-xl">
                        {currencyOptions.find((c) => c.code === currency)?.symbol || "$"}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Selected Currency: {currency}</p>
                      <p className="text-gray-400 text-sm">
                        {currencyOptions.find((c) => c.code === currency)?.name || "US Dollar"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>

          {/* ===== TIMEZONE SELECTION ===== */}
          <Box
            title="Timezone Preference"
            subtitle="Set your local timezone and view current time"
            className="shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#4ADE80]/10 rounded-lg">
                  <Globe className="w-6 h-6 text-[#4ADE80]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Timezone Settings</h3>
                  <p className="text-gray-400">Configure your local timezone for accurate time display</p>
                </div>
              </div>

              <div className="space-y-4">
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-3">
                  Select Timezone
                </label>

                <div className="relative" ref={timezoneDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
                    className="w-full px-4 py-4 bg-white text-black rounded-xl border-0 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none text-lg font-medium text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span>{timezone}</span>
                    <ChevronDown
                      className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${showTimezoneDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showTimezoneDropdown && (
                    <div className="absolute z-20 w-full bg-gray-800 border border-gray-600 rounded-xl mt-2 max-h-64 overflow-hidden shadow-2xl">
                      {/* Search Input */}
                      <div className="p-3 border-b border-gray-700">
                        <input
                          type="text"
                          placeholder="Search timezones..."
                          value={timezoneSearch}
                          onChange={(e) => setTimezoneSearch(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none placeholder-gray-400"
                          autoFocus
                        />
                      </div>

                      {/* Timezone Options */}
                      <div className="max-h-48 overflow-y-auto">
                        {filteredTimezones.length > 0 ? (
                          filteredTimezones.map((tz) => (
                            <button
                              key={tz}
                              type="button"
                              onClick={() => handleTimezoneSelect(tz)}
                              className="block w-full text-left px-6 py-4 text-white hover:bg-gray-700 transition-colors border-b border-gray-700/50 last:border-b-0 group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Globe className="w-5 h-5 text-[#4ADE80]" />
                                  <span className="font-semibold text-white group-hover:text-[#4ADE80] transition-colors">
                                    {tz}
                                  </span>
                                </div>
                                {timezone === tz && <div className="w-2 h-2 bg-[#4ADE80] rounded-full"></div>}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-6 py-8 text-center">
                            <Globe className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                            <p className="text-gray-400">No timezones found</p>
                            <p className="text-gray-500 text-sm">Try a different search term</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Selected Timezone Display */}
                  <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#4ADE80]/10 rounded-lg">
                        <Globe className="w-6 h-6 text-[#4ADE80]" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Selected Timezone: {timezone}</p>
                        <p className="text-gray-400 text-sm">Current local time: {currentTimeInTimezone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6 p-4 bg-gray-800/50 rounded-xl">
                  <Clock className="w-5 h-5 text-[#4ADE80]" />
                  <span className="text-gray-300 text-lg">Current time in selected timezone:</span>
                  <span className="font-mono text-xl text-[#4ADE80] font-bold">{currentTimeInTimezone}</span>
                </div>
              </div>
            </div>
          </Box>

          {/* ===== BUDGET LIMIT SETUP ===== */}
          <Box title="Budget Management" subtitle="Set your monthly spending target and limits" className="shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#4ADE80]/10 rounded-lg">
                  <CreditCard className="w-6 h-6 text-[#4ADE80]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Budget Limit Setup</h3>
                  <p className="text-gray-400">Set monthly spending targets to track your expenses</p>
                </div>
              </div>

              <div className="space-y-4">
                <InputField
                  label="Monthly Budget Limit"
                  type="number"
                  id="budgetLimit"
                  placeholder="e.g., 1000.00"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  min="0"
                  step="0.01"
                  className="h-12 text-lg"
                />
                {errors.budgetLimit && <p className="text-red-400 text-sm mt-2">{errors.budgetLimit}</p>}
                <div className="flex items-start gap-3 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                  <Calendar className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-300">
                    This limit will be used to track your expenses and provide insights. You'll receive notifications
                    when approaching your limit.
                  </p>
                </div>
              </div>
            </div>
          </Box>

          {/* ===== ACTION BUTTONS ===== */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-3 bg-[#4ADE80] text-black font-bold py-4 px-8 rounded-xl hover:bg-[#3BC470] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Save className="w-6 h-6" />
              {isLoading ? "Saving Changes..." : "Save All Changes"}
            </button>

            <button
              type="button"
              onClick={() => onNavigate("Dashboard")}
              className="flex items-center justify-center gap-3 bg-gray-700 text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-600 transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <X className="w-6 h-6" />
              Cancel Changes
            </button>
          </div>
        </form>

        {/* ===== PASSWORD MANAGEMENT ===== */}
        <Box
          title="Security Settings"
          subtitle="Manage your account password and security preferences"
          className="shadow-2xl"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#4ADE80]/10 rounded-lg">
                <Shield className="w-6 h-6 text-[#4ADE80]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Password Management</h3>
                <p className="text-gray-400">Keep your account secure with a strong password</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 bg-gray-800/30 rounded-xl border border-gray-700">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <KeyRound className="w-6 h-6 text-[#4ADE80]" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Change Password</h4>
                  <p className="text-sm text-gray-300">Update your account password securely</p>
                  <p className="text-xs text-gray-400 mt-1">Last changed: Never</p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-3 bg-gray-700 text-white hover:bg-gray-600 font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                onClick={() => setShowPasswordModal(true)}
              >
                <KeyRound className="w-5 h-5" />
                Change Password
              </button>
            </div>
          </div>
        </Box>

        {/* ===== DANGER ZONE ACTIONS ===== */}
        <Box
          title="Danger Zone"
          subtitle="Irreversible actions that permanently affect your account"
          className="shadow-2xl border-red-500/30"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-red-400">Danger Zone</h3>
                <p className="text-red-300">These actions cannot be undone. Please proceed with caution.</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Delete All Previous Data */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 bg-red-900/10 rounded-xl border border-red-500/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/20 rounded-lg">
                    <Trash2 className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-red-400">Delete All Previous Data</h4>
                    <p className="text-sm text-red-300">Permanently remove all your transaction history and data</p>
                    <p className="text-xs text-red-400 mt-1">This will not delete your account, only your data</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={() => setShowDeleteDataDialog(true)}
                  disabled={isLoading}
                >
                  <Trash2 className="w-5 h-5" />
                  Delete All Data
                </button>
              </div>

              {/* Delete Account */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 bg-red-900/10 rounded-xl border border-red-500/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/20 rounded-lg">
                    <UserX className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-red-400">Delete Account</h4>
                    <p className="text-sm text-red-300">Permanently delete your account and all associated data</p>
                    <p className="text-xs text-red-400 mt-1">This action is irreversible and immediate</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={() => setShowDeleteAccountDialog(true)}
                  disabled={isLoading}
                >
                  <UserX className="w-5 h-5" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </Box>
      </div>

      {/* Custom Delete Account Confirmation Dialog */}
      {showDeleteAccountDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-gray-600 bg-gray-800 p-8 text-white shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-400">Delete Account</h3>
                <p className="text-gray-300">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-8 p-4 bg-red-900/20 rounded-xl border border-red-500/30">
              <p className="text-red-300 mb-3 font-medium">
                This will permanently delete your account and remove all your data from our servers, including:
              </p>
              <ul className="text-red-200 text-sm space-y-1 ml-4">
                <li>• All transaction history</li>
                <li>• Personal settings and preferences</li>
                <li>• Account information</li>
                <li>• All associated data</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row-reverse gap-4">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg"
                onClick={handleDeleteAccount}
                disabled={isLoading}
              >
                <UserX className="w-5 h-5" />
                {isLoading ? "Deleting..." : "Delete My Account"}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-3 border border-gray-600 bg-gray-700 text-white hover:bg-gray-600 font-semibold py-4 px-6 rounded-xl transition-all duration-200"
                onClick={() => setShowDeleteAccountDialog(false)}
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete All Data Confirmation Dialog */}
      {showDeleteDataDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-gray-600 bg-gray-800 p-8 text-white shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-400">Delete All Data</h3>
                <p className="text-gray-300">This will clear your transaction history</p>
              </div>
            </div>

            <div className="mb-8 p-4 bg-red-900/20 rounded-xl border border-red-500/30">
              <p className="text-red-300 font-medium mb-2">
                Are you sure you want to delete ALL your previous transaction data?
              </p>
              <p className="text-red-200 text-sm">This action cannot be undone, but your account will remain active.</p>
            </div>

            <div className="flex flex-col sm:flex-row-reverse gap-4">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg"
                onClick={confirmDeleteAllData}
                disabled={isLoading}
              >
                <Trash2 className="w-5 h-5" />
                {isLoading ? "Deleting..." : "Delete All Data"}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-3 border border-gray-600 bg-gray-700 text-white hover:bg-gray-600 font-semibold py-4 px-6 rounded-xl transition-all duration-200"
                onClick={() => setShowDeleteDataDialog(false)}
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-gray-600 bg-gray-800 p-8 text-white shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#4ADE80]/20 rounded-xl">
                <KeyRound className="w-8 h-8 text-[#4ADE80]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Change Password</h3>
                <p className="text-gray-300">Update your account security</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <InputField
                  label="Current Password"
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPasswordModal"
                  placeholder="Enter your current password"
                  value={currentPasswordModal}
                  onChange={(e) => {
                    setCurrentPasswordModal(e.target.value)
                    setPasswordModalErrors((prev) => ({ ...prev, currentPassword: "" }))
                  }}
                  className="pr-12 h-12"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {passwordModalErrors.currentPassword && (
                  <p className="text-red-400 text-sm mt-2">{passwordModalErrors.currentPassword}</p>
                )}
              </div>

              <div className="relative">
                <InputField
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  id="newPasswordModal"
                  placeholder="Enter new password"
                  value={newPasswordModal}
                  onChange={(e) => {
                    setNewPasswordModal(e.target.value)
                    setPasswordModalErrors((prev) => ({ ...prev, newPassword: "" }))
                  }}
                  className="pr-12 h-12"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {passwordModalErrors.newPassword && (
                  <p className="text-red-400 text-sm mt-2">{passwordModalErrors.newPassword}</p>
                )}
              </div>

              <div className="relative">
                <InputField
                  label="Confirm New Password"
                  type={showRetypePassword ? "text" : "password"}
                  id="retypeNewPasswordModal"
                  placeholder="Retype new password"
                  value={retypeNewPasswordModal}
                  onChange={(e) => {
                    setRetypeNewPasswordModal(e.target.value)
                    setPasswordModalErrors((prev) => ({ ...prev, retypeNewPassword: "" }))
                  }}
                  className="pr-12 h-12"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowRetypePassword(!showRetypePassword)}
                >
                  {showRetypePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {passwordModalErrors.retypeNewPassword && (
                  <p className="text-red-400 text-sm mt-2">{passwordModalErrors.retypeNewPassword}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row-reverse gap-4 mt-8">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-3 bg-[#4ADE80] text-black hover:bg-[#3BC470] font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg"
                onClick={handleChangePassword}
                disabled={isPasswordChanging}
              >
                <KeyRound className="w-5 h-5" />
                {isPasswordChanging ? "Changing..." : "Change Password"}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-3 border border-gray-600 bg-gray-700 text-white hover:bg-gray-600 font-semibold py-4 px-6 rounded-xl transition-all duration-200"
                onClick={() => {
                  setShowPasswordModal(false)
                  setCurrentPasswordModal("")
                  setNewPasswordModal("")
                  setRetypeNewPasswordModal("")
                  setPasswordModalErrors({})
                  setShowCurrentPassword(false)
                  setShowNewPassword(false)
                  setShowRetypePassword(false)
                }}
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
