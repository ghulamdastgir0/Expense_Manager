"use client"

import { useState, useEffect } from "react"
import {
  CreditCard, TrendingUp, TrendingDown, Utensils, Car, Shirt,
  Heart, Building, Plane, Briefcase, Gamepad2, User, MoreHorizontal,
  Banknote, Smartphone, FileText, Save, X, Clock,
} from "lucide-react"

import InputField from "../auth/inputField"
import Box from "./Box"
import { transactionAPI, settingsAPI, referenceAPI } from "../../api/api"
import { useSettings } from "../../context/useSettings"

function AddTransaction({ preSelectedType = "expense", onSuccess }) {
  // ✅ Currency symbol + timezone-aware helpers from global context
  const { formatAmount, userNow, liveTime, utcOffset } = useSettings()

  // ===== FORM STATE =====
  const [formData, setFormData] = useState({
    title: "",
    type: preSelectedType,
    amount: "",
    date: "",
    time: "",
    category_id: "",
    payment_method_id: "",
  })

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState("")
  const [success, setSuccess] = useState("")

  // Budget state
  const [budgetLimit,       setBudgetLimit]       = useState(0)
  const [baseMonthExpenses, setBaseMonthExpenses] = useState(0)

  // Reference data (from API, with static fallback)
  const [categoryList,      setCategoryList]      = useState([])
  const [paymentMethodList, setPaymentMethodList] = useState([])

  // Sync type when parent prop changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, type: preSelectedType }))
  }, [preSelectedType])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsAPI.get()
        const s = data?.data?.settings || data?.data || data || {}
        if (s.budget_limit           != null) setBudgetLimit(Number(s.budget_limit))
        if (s.current_month_expenses != null) setBaseMonthExpenses(Number(s.current_month_expenses))
      } catch { /* silent */ }
    }

    const fetchReference = async () => {
      try {
        const [catRes, payRes] = await Promise.all([
          referenceAPI.categories(),
          referenceAPI.paymentMethods(),
        ])
        if (Array.isArray(catRes?.data)) setCategoryList(catRes.data)
        if (Array.isArray(payRes?.data)) setPaymentMethodList(payRes.data)
      } catch { /* use static fallback */ }
    }

    fetchSettings()
    fetchReference()
  }, [])

  // ===== BUDGET CALCULATIONS =====
  const currentAmount    = formData.type === "expense" && formData.amount ? Number(formData.amount) : 0
  const totalExpense     = baseMonthExpenses + currentAmount
  const budgetPercentage = budgetLimit > 0 ? (totalExpense / budgetLimit) * 100 : 0
  const budgetRemaining  = budgetLimit - totalExpense
  const barColor         = budgetPercentage >= 100 ? "bg-red-500" : budgetPercentage >= 75 ? "bg-yellow-400" : "bg-[#4ADE80]"

  // ===== HANDLERS =====
  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.title.trim())                           return setError("Title is required.")
    if (!formData.amount || Number(formData.amount) <= 0) return setError("Enter a valid amount.")
    if (!formData.date)                                   return setError("Date is required.")
    if (!formData.category_id)                            return setError("Please select a category.")
    if (!formData.payment_method_id)                      return setError("Please select a payment mode.")

    setLoading(true)
    try {
      await transactionAPI.add(formData)
      setSuccess("Transaction added successfully!")
      setFormData({ title: "", type: preSelectedType, amount: "", date: "", time: "", category_id: "", payment_method_id: "" })
      if (onSuccess) setTimeout(onSuccess, 1200)
    } catch (err) {
      setError(err.message || "Failed to add transaction. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setError("")
    setSuccess("")
    setFormData({ title: "", type: preSelectedType, amount: "", date: "", time: "", category_id: "", payment_method_id: "" })
  }

  // ✅ "Use Current Date & Time" — uses the user's timezone from context
  const getCurrentDateTime = () => {
    const iso  = userNow.toISOString()
    const date = iso.slice(0, 10)
    const time = iso.slice(11, 16)
    setFormData((prev) => ({ ...prev, date, time }))
  }

  // ===== ICON MAPS & REFERENCE DATA =====
  const categoryIconMap = {
    food: Utensils, fuel: Car, clothing: Shirt, medical: Heart,
    loan: Building, transport: Plane, salary: Briefcase,
    fun: Gamepad2, personal: User, other: MoreHorizontal,
  }
  const paymentIconMap = {
    cash: Banknote, card: CreditCard, netbanking: Smartphone,
    "net banking": Smartphone, cheque: FileText,
  }

  const staticCategories = [
    { id: 1, name: "food" }, { id: 2, name: "fuel" }, { id: 3, name: "clothing" },
    { id: 4, name: "medical" }, { id: 5, name: "loan" }, { id: 6, name: "transport" },
    { id: 7, name: "salary" }, { id: 8, name: "fun" }, { id: 9, name: "personal" },
    { id: 10, name: "other" },
  ]
  const staticPaymentMethods = [
    { id: 1, name: "cash" }, { id: 2, name: "card" },
    { id: 3, name: "netbanking" }, { id: 4, name: "cheque" },
  ]

  const categories = (categoryList.length > 0 ? categoryList : staticCategories).map((c) => ({
    id:    c.id,
    label: c.name.charAt(0).toUpperCase() + c.name.slice(1),
    icon:  categoryIconMap[c.name.toLowerCase()] || MoreHorizontal,
  }))

  const paymentModes = (paymentMethodList.length > 0 ? paymentMethodList : staticPaymentMethods).map((p) => ({
    id:    p.id,
    label: p.name.charAt(0).toUpperCase() + p.name.slice(1),
    icon:  paymentIconMap[p.name.toLowerCase()] || CreditCard,
  }))

  const transactionTypes = [
    { value: "expense", label: "Expense", icon: TrendingDown, color: "text-red-500"   },
    { value: "income",  label: "Income",  icon: TrendingUp,   color: "text-green-400" },
  ]

  // ===== UI =====
  return (
    <div className="min-h-screen bg-black p-4 md:p-8 text-white">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">
            Add {formData.type === "income" ? "Income" : "Expense"}
          </h1>
          <p className="text-gray-400 text-sm">Fill in the details below to record your transaction.</p>
          {/* ✅ Live clock showing user's local time from context */}
          <p className="text-xs text-gray-500">
            Your time ({utcOffset}):&nbsp;
            <span className="text-[#4ADE80] font-mono tracking-wider">{liveTime}</span>
          </p>
        </div>

        <Box>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TRANSACTION TYPE */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Transaction Type</label>
              <div className="grid grid-cols-2 gap-4">
                {transactionTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => handleInputChange("type", t.value)}
                    className={`p-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200
                      ${formData.type === t.value
                        ? t.value === "expense"
                          ? "bg-red-600 text-white shadow-lg scale-[1.02]"
                          : "bg-[#4ADE80] text-black shadow-lg scale-[1.02]"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                  >
                    <t.icon size={18} className={formData.type === t.value ? "" : t.color} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TITLE */}
            <InputField
              label="Title"
              value={formData.title}
              placeholder="e.g. Grocery shopping"
              onChange={(e) => handleInputChange("title", e.target.value)}
            />

            {/* AMOUNT */}
            <InputField
              label="Amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
            />

            {/* DATE & TIME */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
              <InputField
                label="Time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
              />
            </div>

            {/* USE CURRENT DATE/TIME button — timezone-aware */}
            <button
              type="button"
              onClick={getCurrentDateTime}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
            >
              <Clock size={16} />
              Use Current Date &amp; Time ({utcOffset})
            </button>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
              <div className="grid grid-cols-5 gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleInputChange("category_id", c.id)}
                    className={`p-2 rounded-lg flex flex-col items-center gap-1 text-xs font-medium transition-all duration-200
                      ${formData.category_id === c.id
                        ? "bg-[#4ADE80] text-black shadow-md scale-[1.05]"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                      }`}
                  >
                    <c.icon size={18} />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* PAYMENT MODE */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Payment Mode</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {paymentModes.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleInputChange("payment_method_id", m.id)}
                    className={`p-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200
                      ${formData.payment_method_id === m.id
                        ? "bg-[#4ADE80] text-black shadow-md scale-[1.02]"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                      }`}
                  >
                    <m.icon size={16} />
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* FEEDBACK */}
            {error && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-700 rounded-lg px-4 py-2">{error}</p>
            )}
            {success && (
              <p className="text-green-400 text-sm bg-green-900/20 border border-green-700 rounded-lg px-4 py-2">{success}</p>
            )}

            {/* ACTIONS */}
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#4ADE80] text-black font-semibold py-3 rounded-lg
                           hover:bg-[#3BC470] transition-colors duration-200
                           disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving…
                  </>
                ) : (
                  <><Save size={18} />Save Transaction</>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <X size={18} />Reset
              </button>
            </div>
          </form>
        </Box>

        {/* BUDGET IMPACT — expenses only, ✅ formatAmount from context */}
        {formData.type === "expense" && (
          <Box title="Budget Impact" subtitle="How this transaction affects your monthly budget">
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Monthly Limit</span>
                <span className="text-white font-medium">{formatAmount(budgetLimit)}</span>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm mt-2">
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs mb-1">Spent</p>
                  <p className="text-red-400 font-bold">{formatAmount(baseMonthExpenses)}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs mb-1">This Entry</p>
                  <p className="text-yellow-400 font-bold">
                    {formatAmount(formData.amount ? Number(formData.amount) : 0)}
                  </p>
                </div>
                <div className={`rounded-lg p-3 text-center ${budgetRemaining < 0 ? "bg-red-900/30" : "bg-gray-800"}`}>
                  <p className="text-gray-400 text-xs mb-1">Remaining</p>
                  <p className={`font-bold ${budgetRemaining < 0 ? "text-red-400" : "text-green-400"}`}>
                    {budgetRemaining < 0 ? "-" : ""}{formatAmount(Math.abs(budgetRemaining))}
                  </p>
                </div>
              </div>

              {budgetPercentage >= 100 && (
                <p className="text-red-400 text-sm bg-red-900/20 border border-red-700 rounded-lg px-4 py-2">
                  ⚠️ You have exceeded your monthly budget!
                </p>
              )}
              {budgetPercentage >= 75 && budgetPercentage < 100 && (
                <p className="text-yellow-400 text-sm bg-yellow-900/20 border border-yellow-700 rounded-lg px-4 py-2">
                  ⚠️ You have used {Math.round(budgetPercentage)}% of your monthly budget.
                </p>
              )}
            </div>
          </Box>
        )}

      </div>
    </div>
  )
}

export default AddTransaction