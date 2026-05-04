"use client"
import { useState, useEffect, useRef } from "react"
import {
  Trash2, Save, SettingsIcon, KeyRound, X,
  ChevronDown, Globe, DollarSign, Clock, CreditCard,
  AlertTriangle, UserX, Shield, Calendar,
} from "lucide-react"
import Box from "./Box"
import { settingsAPI, authAPI, userAPI, referenceAPI, transactionAPI, clearTokens } from "../../api/api"
import { useSettings } from "../../context/useSettings"

function Settings({ onNavigate, onSettingsSaved }) {
  const [currencyId,  setCurrencyId]  = useState("")
  const [timezoneId,  setTimezoneId]  = useState("")
  const [budgetLimit, setBudgetLimit] = useState("")

  const [currencyLabel, setCurrencyLabel] = useState("")
  const [timezoneLabel, setTimezoneLabel] = useState("")

  const [currencies, setCurrencies] = useState([])
  const [timezones,  setTimezones]  = useState([])
  const [refLoading, setRefLoading] = useState(true)

  const [showCurrencyDD, setShowCurrencyDD] = useState(false)
  const [showTimezoneDD, setShowTimezoneDD] = useState(false)
  const [currencySearch, setCurrencySearch] = useState("")
  const [timezoneSearch, setTimezoneSearch] = useState("")
  const currencyRef = useRef(null)
  const timezoneRef = useRef(null)

  const [loading,     setLoading]     = useState(false)
  const [saveSuccess, setSaveSuccess] = useState("")
  const [saveError,   setSaveError]   = useState("")

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword,   setCurrentPassword]   = useState("")
  const [newPassword,       setNewPassword]       = useState("")
  const [confirmPassword,   setConfirmPassword]   = useState("")
  const [passErrors,        setPassErrors]        = useState({})
  const [passSuccess,       setPassSuccess]       = useState("")
  const [passLoading,       setPassLoading]       = useState(false)

  const [showDeleteConfirm,     setShowDeleteConfirm]     = useState(false)
  const [showDeleteDataConfirm, setShowDeleteDataConfirm] = useState(false)

  const { liveTime, utcOffset } = useSettings()

  useEffect(() => {
    const h = (e) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target)) setShowCurrencyDD(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  useEffect(() => {
    const h = (e) => {
      if (timezoneRef.current && !timezoneRef.current.contains(e.target)) setShowTimezoneDD(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        setRefLoading(true)
        const [curRes, tzRes, settingsRes] = await Promise.all([
          referenceAPI.currencies(),
          referenceAPI.timezones(),
          settingsAPI.get().catch(() => null),
        ])

        const curs = curRes?.data?.currencies || curRes?.data || curRes || []
        const tzs  = tzRes?.data?.timezones  || tzRes?.data  || tzRes  || []

        const safeCurs = Array.isArray(curs) ? curs : []
        const safeTzs  = Array.isArray(tzs)  ? tzs  : []

        setCurrencies(safeCurs)
        setTimezones(safeTzs)

        const s = settingsRes?.data?.settings
        if (s) {
          setCurrencyId(s.currency_id  || "")
          setTimezoneId(s.time_zone_id || "")
          setBudgetLimit(s.budget_limit != null ? String(s.budget_limit) : "")

          const cur = safeCurs.find((c) => c.currency_id === s.currency_id)
          if (cur) setCurrencyLabel(`${cur.name} (${cur.symbol})`)

          const tz = safeTzs.find((t) => t.time_zone_id === s.time_zone_id)
          if (tz) setTimezoneLabel(`${tz.country_name} (${tz.utc_offset})`)
        }
      } catch (err) {
        console.error("Settings load error:", err)
      } finally {
        setRefLoading(false)
      }
    }
    load()
  }, [])

  const filteredCurrencies = currencies.filter((c) =>
    `${c.name} ${c.symbol}`.toLowerCase().includes(currencySearch.toLowerCase())
  )
  const filteredTimezones = timezones.filter((t) =>
    `${t.country_name} ${t.utc_offset}`.toLowerCase().includes(timezoneSearch.toLowerCase())
  )

  const handleCurrencySelect = (c) => {
    setCurrencyId(c.currency_id)
    setCurrencyLabel(`${c.name} (${c.symbol})`)
    setShowCurrencyDD(false)
    setCurrencySearch("")
  }

  const handleTimezoneSelect = (tz) => {
    setTimezoneId(tz.time_zone_id)
    setTimezoneLabel(`${tz.country_name} (${tz.utc_offset})`)
    setShowTimezoneDD(false)
    setTimezoneSearch("")
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaveSuccess("")
    setSaveError("")

    if (!currencyId) { setSaveError("Please select a currency."); return }
    if (!timezoneId) { setSaveError("Please select a timezone."); return }
    if (budgetLimit && (isNaN(parseFloat(budgetLimit)) || parseFloat(budgetLimit) < 0)) {
      setSaveError("Budget limit must be a non-negative number.")
      return
    }

    setLoading(true)
    try {
      await settingsAPI.update({
        currency_id:  currencyId,
        time_zone_id: timezoneId,
        budget_limit: parseFloat(budgetLimit) || 0,
      })
      setSaveSuccess("Settings saved successfully!")
      if (onSettingsSaved) onSettingsSaved()
    } catch (err) {
      setSaveError(err.message || "Error saving settings.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    const errors = {}
    if (!currentPassword)                errors.current = "Current password is required."
    if (newPassword.length < 6)          errors.new     = "New password must be at least 6 characters."
    if (newPassword !== confirmPassword) errors.match   = "Passwords do not match."
    if (newPassword === currentPassword && newPassword) errors.new = "New password must differ from current."
    setPassErrors(errors)
    if (Object.keys(errors).length > 0) return

    setPassLoading(true)
    setPassSuccess("")
    try {
      await authAPI.changePassword({ currentPassword, newPassword })
      setPassSuccess("Password updated successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => { setShowPasswordModal(false); setPassSuccess("") }, 1500)
    } catch (err) {
      setPassErrors({ api: err.message || "Failed to update password." })
    } finally {
      setPassLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowPasswordModal(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setPassErrors({})
    setPassSuccess("")
  }

  const handleDeleteAllData = async () => {
    try {
      await transactionAPI.deleteAll()
      setShowDeleteDataConfirm(false)
      alert("All transaction data deleted and balance reset.")
      if (onSettingsSaved) onSettingsSaved()
      onNavigate("Dashboard")
    } catch (err) {
      alert(err.message || "Failed to delete data.")
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await userAPI.deleteAccount()
      clearTokens()
      window.location.href = "/"
    } catch (err) {
      alert(err.message || "Failed to delete account.")
    }
  }

  if (refLoading) return (
    <div className="p-6 text-white flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#4ADE80] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400">Loading settings…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-black text-white">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-gray-800 rounded-xl">
            <SettingsIcon className="w-8 h-8 text-[#4ADE80]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 text-lg">Manage your application preferences</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">

          {/* CURRENCY */}
          <Box title="Currency Preference" subtitle="Choose your preferred currency for transactions" className="shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#4ADE80]/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-[#4ADE80]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Currency Settings</h3>
                  <p className="text-gray-400">Affects all amount displays across the app</p>
                </div>
              </div>

              <div className="relative" ref={currencyRef}>
                <label className="block text-sm font-medium text-gray-300 mb-3">Select Currency</label>
                <button
                  type="button"
                  onClick={() => setShowCurrencyDD(!showCurrencyDD)}
                  className="w-full px-4 py-4 bg-white text-black rounded-xl text-lg font-medium text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span>{currencyLabel || "Select a currency…"}</span>
                  <ChevronDown className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${showCurrencyDD ? "rotate-180" : ""}`} />
                </button>

                {showCurrencyDD && (
                  <div className="absolute z-20 w-full bg-gray-800 border border-gray-600 rounded-xl mt-2 max-h-64 overflow-hidden shadow-2xl">
                    <div className="p-3 border-b border-gray-700">
                      <input
                        type="text"
                        placeholder="Search currencies…"
                        value={currencySearch}
                        onChange={(e) => setCurrencySearch(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none placeholder-gray-400"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredCurrencies.length > 0 ? filteredCurrencies.map((c) => (
                        <button
                          key={c.currency_id}
                          type="button"
                          onClick={() => handleCurrencySelect(c)}
                          className="block w-full text-left px-6 py-4 text-white hover:bg-gray-700 transition-colors border-b border-gray-700/50 last:border-b-0 group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-[#4ADE80] font-bold text-lg min-w-[3rem]">{c.symbol}</span>
                              <span className="font-semibold group-hover:text-[#4ADE80] transition-colors">{c.name}</span>
                            </div>
                            {currencyId === c.currency_id && <div className="w-2 h-2 bg-[#4ADE80] rounded-full" />}
                          </div>
                        </button>
                      )) : (
                        <div className="px-6 py-8 text-center text-gray-400">No currencies found</div>
                      )}
                    </div>
                  </div>
                )}

                {currencyId && (() => {
                  const sel = currencies.find((c) => c.currency_id === currencyId)
                  return sel ? (
                    <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700 flex items-center gap-3">
                      <div className="p-2 bg-[#4ADE80]/10 rounded-lg">
                        <span className="font-mono text-[#4ADE80] font-bold text-xl">{sel.symbol}</span>
                      </div>
                      <p className="text-white font-semibold">Selected: {sel.name}</p>
                    </div>
                  ) : null
                })()}
              </div>
            </div>
          </Box>

          {/* TIMEZONE */}
          <Box title="Timezone Preference" subtitle="All transaction times will display in this timezone" className="shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#4ADE80]/10 rounded-lg">
                  <Globe className="w-6 h-6 text-[#4ADE80]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Timezone Settings</h3>
                  <p className="text-gray-400">Transaction dates & times update immediately on all pages</p>
                </div>
              </div>

              <div className="relative" ref={timezoneRef}>
                <label className="block text-sm font-medium text-gray-300 mb-3">Select Timezone</label>
                <button
                  type="button"
                  onClick={() => setShowTimezoneDD(!showTimezoneDD)}
                  className="w-full px-4 py-4 bg-white text-black rounded-xl text-lg font-medium text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span>{timezoneLabel || "Select a timezone…"}</span>
                  <ChevronDown className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${showTimezoneDD ? "rotate-180" : ""}`} />
                </button>

                {showTimezoneDD && (
                  <div className="absolute z-20 w-full bg-gray-800 border border-gray-600 rounded-xl mt-2 max-h-64 overflow-hidden shadow-2xl">
                    <div className="p-3 border-b border-gray-700">
                      <input
                        type="text"
                        placeholder="Search timezones…"
                        value={timezoneSearch}
                        onChange={(e) => setTimezoneSearch(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none placeholder-gray-400"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredTimezones.length > 0 ? filteredTimezones.map((tz) => (
                        <button
                          key={tz.time_zone_id}
                          type="button"
                          onClick={() => handleTimezoneSelect(tz)}
                          className="block w-full text-left px-6 py-4 text-white hover:bg-gray-700 transition-colors border-b border-gray-700/50 last:border-b-0 group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Globe className="w-5 h-5 text-[#4ADE80]" />
                              <span className="font-semibold group-hover:text-[#4ADE80] transition-colors">
                                {tz.country_name} ({tz.utc_offset})
                              </span>
                            </div>
                            {timezoneId === tz.time_zone_id && <div className="w-2 h-2 bg-[#4ADE80] rounded-full" />}
                          </div>
                        </button>
                      )) : (
                        <div className="px-6 py-8 text-center text-gray-400">No timezones found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mt-6 p-4 bg-gray-800/50 rounded-xl">
                <Clock className="w-5 h-5 text-[#4ADE80]" />
                <span className="text-gray-300 text-lg">Current time in your timezone:</span>
                <span className="font-mono text-xl text-[#4ADE80] font-bold">{liveTime}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 pl-1">
                Offset: {utcOffset} — All transaction timestamps on History, Transactions, and Reports pages reflect this timezone.
              </p>
            </div>
          </Box>

          {/* BUDGET LIMIT */}
          <Box title="Budget Management" subtitle="Set your monthly spending target" className="shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#4ADE80]/10 rounded-lg">
                  <CreditCard className="w-6 h-6 text-[#4ADE80]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Budget Limit</h3>
                  <p className="text-gray-400">Dashboard and Add Transaction will show your progress</p>
                </div>
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 1000"
                className="w-full p-4 bg-gray-800 rounded-xl text-white text-lg border border-gray-700 focus:border-[#4ADE80] focus:outline-none"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
              />
              <div className="flex items-start gap-3 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30 mt-4">
                <Calendar className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-300">
                  You'll receive a warning on the Dashboard when you reach 80% of this limit, and an alert when you exceed it.
                </p>
              </div>
            </div>
          </Box>

          {/* Feedback */}
          {saveSuccess && <p className="text-green-400 text-sm bg-green-900/20 border border-green-700 rounded-lg px-4 py-2">✓ {saveSuccess}</p>}
          {saveError   && <p className="text-red-400   text-sm bg-red-900/20   border border-red-700   rounded-lg px-4 py-2">{saveError}</p>}

          {/* SAVE */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-3 bg-[#4ADE80] text-black font-bold py-4 px-8 rounded-xl hover:bg-[#3BC470] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
            >
              {loading
                ? <><div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />Saving…</>
                : <><Save className="w-6 h-6" />Save All Changes</>
              }
            </button>
            <button
              type="button"
              onClick={() => onNavigate("Dashboard")}
              className="flex items-center justify-center gap-3 bg-gray-700 text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-600 transition-all duration-200 text-lg"
            >
              <X className="w-6 h-6" />Cancel
            </button>
          </div>
        </form>

        {/* SECURITY */}
        <Box title="Security Settings" subtitle="Manage your account password" className="shadow-2xl">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#4ADE80]/10 rounded-lg"><Shield className="w-6 h-6 text-[#4ADE80]" /></div>
              <h3 className="text-xl font-semibold text-white">Password Management</h3>
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 bg-gray-800/30 rounded-xl border border-gray-700">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-700 rounded-lg"><KeyRound className="w-6 h-6 text-[#4ADE80]" /></div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Change Password</h4>
                  <p className="text-sm text-gray-300">Update your account password securely</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="inline-flex items-center gap-3 bg-gray-700 text-white hover:bg-gray-600 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                <KeyRound className="w-5 h-5" />Change Password
              </button>
            </div>
          </div>
        </Box>

        {/* DANGER ZONE */}
        <Box title="Danger Zone" subtitle="Irreversible actions — proceed with caution" className="shadow-2xl border-red-500/30">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10 rounded-lg"><AlertTriangle className="w-6 h-6 text-red-400" /></div>
              <div>
                <h3 className="text-xl font-semibold text-red-400">Danger Zone</h3>
                <p className="text-red-300 text-sm">These actions cannot be undone.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 bg-red-900/10 rounded-xl border border-red-500/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/20 rounded-lg"><Trash2 className="w-6 h-6 text-red-400" /></div>
                  <div>
                    <h4 className="text-lg font-semibold text-red-400">Delete All Transaction Data</h4>
                    <p className="text-sm text-red-300">Removes all history and resets balance to zero</p>
                  </div>
                </div>
                {!showDeleteDataConfirm
                  ? <button type="button" onClick={() => setShowDeleteDataConfirm(true)} className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg">
                      <Trash2 className="w-5 h-5" />Delete All Data
                    </button>
                  : <div className="flex gap-3">
                      <button type="button" onClick={handleDeleteAllData} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"><Trash2 className="w-4 h-4" />Confirm</button>
                      <button type="button" onClick={() => setShowDeleteDataConfirm(false)} className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"><X className="w-4 h-4" />Cancel</button>
                    </div>
                }
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 bg-red-900/10 rounded-xl border border-red-500/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/20 rounded-lg"><UserX className="w-6 h-6 text-red-400" /></div>
                  <div>
                    <h4 className="text-lg font-semibold text-red-400">Delete Account</h4>
                    <p className="text-sm text-red-300">Permanently deletes your account and all data</p>
                  </div>
                </div>
                {!showDeleteConfirm
                  ? <button type="button" onClick={() => setShowDeleteConfirm(true)} className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg">
                      <UserX className="w-5 h-5" />Delete Account
                    </button>
                  : <div className="flex gap-3">
                      <button type="button" onClick={handleDeleteAccount} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"><UserX className="w-4 h-4" />Confirm</button>
                      <button type="button" onClick={() => setShowDeleteConfirm(false)} className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"><X className="w-4 h-4" />Cancel</button>
                    </div>
                }
              </div>
            </div>
          </div>
        </Box>
      </div>

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl w-full max-w-md shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#4ADE80]/20 rounded-xl"><KeyRound className="w-6 h-6 text-[#4ADE80]" /></div>
                <div>
                  <h2 className="text-xl font-bold text-white">Change Password</h2>
                  <p className="text-gray-400 text-sm">Update your account security</p>
                </div>
              </div>
              <button type="button" onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: "Current Password", val: currentPassword, set: setCurrentPassword, key: "current" },
                { label: "New Password",     val: newPassword,     set: setNewPassword,     key: "new"     },
                { label: "Confirm New",      val: confirmPassword, set: setConfirmPassword,  key: "match"   },
              ].map(({ label, val, set, key }) => (
                <div key={key}>
                  <label className="block text-sm text-gray-400 mb-1">{label}</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:border-[#4ADE80] focus:outline-none"
                    value={val}
                    onChange={(e) => { set(e.target.value); setPassErrors((p) => ({ ...p, [key]: "" })) }}
                  />
                  {passErrors[key] && <p className="text-red-400 text-xs mt-1">{passErrors[key]}</p>}
                </div>
              ))}
            </div>

            {passErrors.api && <p className="text-red-400 text-sm bg-red-900/20 border border-red-700 rounded-lg px-3 py-2">{passErrors.api}</p>}
            {passSuccess    && <p className="text-green-400 text-sm bg-green-900/20 border border-green-700 rounded-lg px-3 py-2">✓ {passSuccess}</p>}

            <button
              type="button"
              onClick={handlePasswordChange}
              disabled={passLoading}
              className="w-full bg-[#4ADE80] text-black font-semibold py-3 rounded-lg hover:bg-[#3BC470] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {passLoading ? "Updating…" : "Update Password"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings