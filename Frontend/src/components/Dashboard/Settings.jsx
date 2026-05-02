"use client"

import { useState, useEffect } from "react"
import {
  Trash2,
  UserX,
  Save,
  SettingsIcon,
} from "lucide-react"

import Box from "./Box"

function Settings({ onNavigate }) {
  // ===== STATE =====
  const [currency, setCurrency] = useState("USD")
  const [budgetLimit, setBudgetLimit] = useState("")
  const [timezone, setTimezone] = useState("GMT+00:00")

  const [loading, setLoading] = useState(false)

  // password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [passErrors, setPassErrors] = useState({})

  const API = "http://localhost:5000/api"

  // ===== LOAD SETTINGS =====
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API}/settings`)
        const data = await res.json()

        setCurrency(data.currency || "USD")
        setBudgetLimit(data.budgetLimit || "")
        setTimezone(data.timezone || "GMT+00:00")
      } catch (err) {
        console.error("Failed to load settings", err)
      }
    }

    fetchSettings()
  }, [])

  // ===== SAVE SETTINGS =====
  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch(`${API}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency, budgetLimit, timezone }),
      })

      alert("Settings updated")
    } catch (err) {
      console.error("Error saving settings", err)
      alert("Error saving settings")
    } finally {
      setLoading(false)
    }
  }

  // ===== PASSWORD CHANGE =====
  const handlePasswordChange = async () => {
    const errors = {}

    if (!currentPassword) errors.current = "Required"
    if (newPassword.length < 6) errors.new = "Min 6 chars"
    if (newPassword !== confirmPassword) errors.match = "Passwords not match"

    setPassErrors(errors)
    if (Object.keys(errors).length > 0) return

    try {
      await fetch(`${API}/user/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      alert("Password updated")
      setShowPasswordModal(false)
    } catch (err) {
      console.error("Password update error", err)
      alert("Failed password update")
    }
  }

  // ===== DELETE ACCOUNT =====
  const handleDeleteAccount = async () => {
    try {
      await fetch(`${API}/user/delete`, { method: "DELETE" })
      alert("Account deleted")
      onNavigate("Login")
    } catch (err) {
      console.error("Account deletion error", err)
      alert("Failed to delete account")
    }
  }

  return (
    <div className="min-h-screen p-6 bg-black text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="text-green-400" />
          Settings
        </h1>
      </div>

      {/* SETTINGS FORM */}
      <form onSubmit={handleSave} className="space-y-6">

        {/* CURRENCY */}
        <Box title="Currency">
          <select
            className="w-full p-3 bg-gray-800 rounded"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="PKR">PKR</option>
            <option value="EUR">EUR</option>
          </select>
        </Box>

        {/* BUDGET */}
        <Box title="Budget Limit">
          <input
            type="number"
            className="w-full p-3 bg-gray-800 rounded"
            value={budgetLimit}
            onChange={(e) => setBudgetLimit(e.target.value)}
          />
        </Box>

        {/* TIMEZONE */}
        <Box title="Timezone">
          <select
            className="w-full p-3 bg-gray-800 rounded"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option>GMT+00:00</option>
            <option>GMT+05:00</option>
            <option>GMT+03:00</option>
          </select>
        </Box>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-black px-6 py-3 rounded font-bold"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>

      {/* SECURITY */}
      <Box title="Security">
        <button
          onClick={() => setShowPasswordModal(true)}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          Change Password
        </button>
      </Box>

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded w-96 space-y-3">

            <input
              type="password"
              placeholder="Current Password"
              className="w-full p-2 bg-gray-800"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            {passErrors.current && <p className="text-red-500">{passErrors.current}</p>}

            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 bg-gray-800"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {passErrors.new && <p className="text-red-500">{passErrors.new}</p>}

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 bg-gray-800"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passErrors.match && <p className="text-red-500">{passErrors.match}</p>}

            <button
              onClick={handlePasswordChange}
              className="bg-green-500 text-black w-full py-2 rounded"
            >
              Update Password
            </button>

            <button
              onClick={() => setShowPasswordModal(false)}
              className="w-full mt-2 text-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT */}
      <Box title="Danger Zone">
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 px-4 py-2 rounded flex items-center gap-2"
        >
          <Trash2 size={18} />
          Delete Account
        </button>
      </Box>

    </div>
  )
}

export default Settings