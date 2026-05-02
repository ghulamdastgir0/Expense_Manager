"use client"

import { useState, useEffect } from "react"
import {
  Tag,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Utensils,
  Car,
  Shirt,
  Heart,
  Building,
  Plane,
  Briefcase,
  Gamepad2,
  User,
  MoreHorizontal,
  Banknote,
  Smartphone,
  FileText,
  Save,
  X,
} from "lucide-react"

import InputField from "../auth/inputField"
import Box from "./Box"

function AddTransaction({ preSelectedType = "expense" }) {
  const API = "http://localhost:5000/api"

  // ===== STATE =====
  const [formData, setFormData] = useState({
    title: "",
    type: preSelectedType,
    amount: "",
    date: "",
    time: "",
    category: "",
    mode: "",
  })

  const [loading, setLoading] = useState(false)

  // budget (static for now — can be API later)
  const budgetLimit = 1000
  const baseMonthExpenses = 750

  // sync type
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      type: preSelectedType,
    }))
  }, [preSelectedType])

  // optional API (safe)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API}/settings`)
        const data = await res.json()
        // optional override if backend sends it
        if (data?.budgetLimit) {
          // no state needed (kept simple)
        }
      } catch {
        // silent fail
      }
    }

    fetchSettings()
  }, [])

  // ===== CALCULATIONS =====
  const currentAmount =
    formData.type === "expense" && formData.amount
      ? Number(formData.amount)
      : 0

  const totalExpense = baseMonthExpenses + currentAmount
  const budgetPercentage =
    budgetLimit > 0 ? (totalExpense / budgetLimit) * 100 : 0

  // ===== HANDLERS =====
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch(`${API}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      alert("Transaction added successfully!")

      setFormData({
        title: "",
        type: preSelectedType,
        amount: "",
        date: "",
        time: "",
        category: "",
        mode: "",
      })
    } catch {
      alert("Failed to add transaction")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      title: "",
      type: preSelectedType,
      amount: "",
      date: "",
      time: "",
      category: "",
      mode: "",
    })
  }

  const getCurrentDateTime = () => {
    const now = new Date()

    setFormData((prev) => ({
      ...prev,
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().slice(0, 5),
    }))
  }

  // ===== DATA =====
  const transactionTypes = [
    { value: "expense", label: "Expense", icon: TrendingDown, color: "text-red-500" },
    { value: "income", label: "Income", icon: TrendingUp, color: "text-green-400" },
  ]

  const categories = [
    { value: "food", label: "Food", icon: Utensils },
    { value: "fuel", label: "Fuel", icon: Car },
    { value: "clothing", label: "Clothing", icon: Shirt },
    { value: "medical", label: "Medical", icon: Heart },
    { value: "loan", label: "Loan", icon: Building },
    { value: "transport", label: "Transport", icon: Plane },
    { value: "salary", label: "Salary", icon: Briefcase },
    { value: "fun", label: "Fun", icon: Gamepad2 },
    { value: "personal", label: "Personal", icon: User },
    { value: "other", label: "Other", icon: MoreHorizontal },
  ]

  const paymentModes = [
    { value: "cash", label: "Cash", icon: Banknote },
    { value: "card", label: "Card", icon: CreditCard },
    { value: "netbanking", label: "Net Banking", icon: Smartphone },
    { value: "cheque", label: "Cheque", icon: FileText },
  ]

  // ===== UI =====
  return (
    <div className="min-h-screen bg-black p-4 md:p-8 text-white">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Add {formData.type === "income" ? "Income" : "Expense"}
          </h1>
        </div>

        <Box>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TYPE */}
            <div className="grid grid-cols-2 gap-4">
              {transactionTypes.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => handleInputChange("type", t.value)}
                  className="p-3 bg-gray-800 rounded flex items-center gap-2"
                >
                  <t.icon size={18} />
                  {t.label}
                </button>
              ))}
            </div>

            {/* TITLE */}
            <InputField
              label="Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />

            {/* AMOUNT */}
            <InputField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
            />

            {/* DATE */}
            <InputField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
            />

            {/* TIME */}
            <InputField
              label="Time"
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
            />

            <button
              type="button"
              onClick={getCurrentDateTime}
              className="bg-gray-700 px-3 py-2 rounded"
            >
              Use Current Time
            </button>

            {/* CATEGORY */}
            <div className="grid grid-cols-3 gap-2">
              {categories.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => handleInputChange("category", c.value)}
                  className="p-2 bg-gray-800 rounded flex items-center gap-2"
                >
                  <c.icon size={16} />
                  {c.label}
                </button>
              ))}
            </div>

            {/* MODE */}
            <div className="grid grid-cols-2 gap-2">
              {paymentModes.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => handleInputChange("mode", m.value)}
                  className="p-2 bg-gray-800 rounded flex items-center gap-2"
                >
                  <m.icon size={16} />
                  {m.label}
                </button>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 text-black px-4 py-2 rounded flex items-center gap-2"
              >
                <Save size={18} />
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-700 px-4 py-2 rounded flex items-center gap-2"
              >
                <X size={18} />
                Reset
              </button>
            </div>

          </form>
        </Box>

        {/* BUDGET */}
        {formData.type === "expense" && (
          <Box>
            <p>Budget Limit: {budgetLimit}</p>
            <p>Spent: {totalExpense}</p>
            <p>{Math.round(budgetPercentage)}% used</p>
          </Box>
        )}

      </div>
    </div>
  )
}

export default AddTransaction