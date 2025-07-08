"use client"
import { useState, useEffect, useRef } from "react"
import { Trash2, LogOut, UserX, Save, X, ChevronDown, Clock, KeyRound } from "lucide-react"
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
  const [showDeleteDataDialog, setShowDeleteDataDialog] = useState(false) // New state for delete data dialog
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)
  const currencyDropdownRef = useRef(null)

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
      for (let m = 0; m <= 30&&h<13; m += 30) {
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

  // Handle currency selection from dropdown
  const handleCurrencySelect = (selectedCurrency) => {
    setCurrency(selectedCurrency.code)
    setCurrencySearch(`${selectedCurrency.code} (${selectedCurrency.symbol}) - ${selectedCurrency.name}`)
    setShowCurrencyDropdown(false)
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
      setShowDeleteDataDialog(false) // Close the dialog
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
      // Placeholder for actual validation
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
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-black text-white space-y-8">
      {/* ===== HEADER SECTION ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-300 text-sm">Manage your application preferences and account settings</p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* ===== CURRENCY SELECTION ===== */}
        <Box title="Currency Preference" subtitle="Choose your preferred currency" className="shadow-lg">
          <div className="relative" ref={currencyDropdownRef}>
            <label htmlFor="currency-search" className="block text-sm font-medium text-gray-300 mb-2">
              Select Currency
            </label>
            <div className="relative">
              <InputField
                id="currency-search"
                type="text"
                placeholder="Search currency..."
                value={currencySearch}
                onChange={(e) => {
                  setCurrencySearch(e.target.value)
                  setShowCurrencyDropdown(true)
                }}
                onFocus={() => setShowCurrencyDropdown(true)}
                className="pr-10"
              />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
            {showCurrencyDropdown && (
              <div className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                {filteredCurrencies.length > 0 ? (
                  filteredCurrencies.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleCurrencySelect(c)}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                    >
                      {c.code} ({c.symbol}) - {c.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-400">No currencies found.</div>
                )}
              </div>
            )}
          </div>
        </Box>

        {/* ===== TIMEZONE SELECTION ===== */}
        <Box title="Timezone Preference" subtitle="Set your local timezone and view current time" className="shadow-lg">
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-2">
              Select Timezone
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-3 bg-white text-black rounded-lg border-0 focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none"
            >
              {timezoneOptions.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2 mt-3 text-gray-300 text-sm">
              <Clock className="w-4 h-4" />
              <span>Current time in selected timezone: {currentTimeInTimezone}</span>
            </div>
          </div>
        </Box>

        {/* ===== BUDGET LIMIT SETUP ===== */}
        <Box title="Budget Limit Setup" subtitle="Set your monthly spending target" className="shadow-lg">
          <div>
            <InputField
              label="Monthly Budget Limit"
              type="number"
              id="budgetLimit"
              placeholder="e.g., 1000.00"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(e.target.value)}
              min="0"
              step="0.01"
            />
            {errors.budgetLimit && <p className="text-red-400 text-sm mt-1">{errors.budgetLimit}</p>}
            <p className="text-xs text-gray-400 mt-2">
              This limit will be used to track your expenses and provide insights.
            </p>
          </div>
        </Box>


        {/* ===== ACTION BUTTONS ===== */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-[#4ADE80] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#3BC470] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => onNavigate("Dashboard")}
            className="flex items-center justify-center gap-2 bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </form>


        {/* ===== PASSWORD MANAGEMENT ===== */}
        <Box title="Password Management" subtitle="Change your account password" className="shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold text-white">Change Password</h3>
              <p className="text-sm text-gray-300">Update your account password securely.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-700 text-white hover:bg-gray-600 h-10 px-4 py-2"
              onClick={() => setShowPasswordModal(true)}
            >
              <KeyRound className="w-4 h-4 mr-2" />
              Change Password
            </button>
          </div>
        </Box>

        {/* ===== DANGER ZONE ACTIONS ===== */}
        <Box title="Danger Zone" subtitle="Irreversible actions" className="shadow-lg border-red-500/20">
          <div className="space-y-4">
            {/* Delete All Previous Data */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-red-900/10 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-red-400">Delete All Previous Data</h3>
                <p className="text-sm text-red-300">Permanently remove all your transaction history and data.</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 hover:bg-red-700 text-white h-10 px-4 py-2"
                onClick={() => setShowDeleteDataDialog(true)} // Open confirmation dialog
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All Data
              </button>
            </div>

            {/* Delete Account */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-red-900/10 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-red-400">Delete Account</h3>
                <p className="text-sm text-red-300">Permanently delete your account and all associated data.</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 hover:bg-red-700 text-white h-10 px-4 py-2"
                onClick={() => setShowDeleteAccountDialog(true)}
                disabled={isLoading}
              >
                <UserX className="w-4 h-4 mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </Box>

        
      {/* Custom Delete Account Confirmation Dialog */}
      {showDeleteAccountDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-lg border border-gray-700 bg-gray-800 p-6 text-white shadow-lg">
            <h3 className="text-xl font-semibold text-red-400 mb-4">Are you absolutely sure?</h3>
            <p className="text-gray-300 mb-6">
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </p>
            <div className="flex flex-col sm:flex-row-reverse gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 hover:bg-red-700 text-white h-10 px-4 py-2"
                onClick={handleDeleteAccount}
                disabled={isLoading}
              >
                Delete My Account
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-gray-700 text-white hover:bg-gray-600 h-10 px-4 py-2"
                onClick={() => setShowDeleteAccountDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete All Data Confirmation Dialog (New) */}
      {showDeleteDataDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-lg border border-gray-700 bg-gray-800 p-6 text-white shadow-lg">
            <h3 className="text-xl font-semibold text-red-400 mb-4">Confirm Data Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete ALL your previous transaction data? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row-reverse gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 hover:bg-red-700 text-white h-10 px-4 py-2"
                onClick={confirmDeleteAllData}
                disabled={isLoading}
              >
                Delete All Data
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-gray-700 text-white hover:bg-gray-600 h-10 px-4 py-2"
                onClick={() => setShowDeleteDataDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-lg border border-gray-700 bg-gray-800 p-6 text-white shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Change Password</h3>
            <div className="space-y-4">
              <InputField
                label="Existing Password"
                type="password"
                id="currentPasswordModal"
                placeholder="Enter your current password"
                value={currentPasswordModal}
                onChange={(e) => {
                  setCurrentPasswordModal(e.target.value)
                  setPasswordModalErrors((prev) => ({ ...prev, currentPassword: "" }))
                }}
              />
              {passwordModalErrors.currentPassword && (
                <p className="text-red-400 text-sm mt-1">{passwordModalErrors.currentPassword}</p>
              )}

              <InputField
                label="New Password"
                type="password"
                id="newPasswordModal"
                placeholder="Enter new password"
                value={newPasswordModal}
                onChange={(e) => {
                  setNewPasswordModal(e.target.value)
                  setPasswordModalErrors((prev) => ({ ...prev, newPassword: "" }))
                }}
              />
              {passwordModalErrors.newPassword && (
                <p className="text-red-400 text-sm mt-1">{passwordModalErrors.newPassword}</p>
              )}

              <InputField
                label="Retype New Password"
                type="password"
                id="retypeNewPasswordModal"
                placeholder="Retype new password"
                value={retypeNewPasswordModal}
                onChange={(e) => {
                  setRetypeNewPasswordModal(e.target.value)
                  setPasswordModalErrors((prev) => ({ ...prev, retypeNewPassword: "" }))
                }}
              />
              {passwordModalErrors.retypeNewPassword && (
                <p className="text-red-400 text-sm mt-1">{passwordModalErrors.retypeNewPassword}</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row-reverse gap-3 mt-6">
              <button
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#4ADE80] text-black hover:bg-[#3BC470] h-10 px-4 py-2"
                onClick={handleChangePassword}
                disabled={isPasswordChanging}
              >
                {isPasswordChanging ? "Changing..." : "Change Password"}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-gray-700 text-white hover:bg-gray-600 h-10 px-4 py-2"
                onClick={() => {
                  setShowPasswordModal(false)
                  setCurrentPasswordModal("")
                  setNewPasswordModal("")
                  setRetypeNewPasswordModal("")
                  setPasswordModalErrors({})
                }}
              >
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
