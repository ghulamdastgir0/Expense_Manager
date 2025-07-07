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
  // ===== STATE MANAGEMENT =====
  const [formData, setFormData] = useState({
    title: "",
    type: preSelectedType, 
    amount: "",
    date: "",
    time: "",
    category: "",
    mode: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      type: preSelectedType,
    }))
  }, [preSelectedType])

  // ===== DATA ARRAYS =====

  // Transaction types with icons
  const transactionTypes = [
    { value: "expense", label: "Expense", icon: TrendingDown, color: "text-red-400" },
    { value: "income", label: "Income", icon: TrendingUp, color: "text-green-400" },
  ]

  // Categories with icons
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

  // Payment modes with icons
  const paymentModes = [
    { value: "cash", label: "Cash", icon: Banknote },
    { value: "card", label: "Card", icon: CreditCard },
    { value: "netbanking", label: "Net Banking", icon: Smartphone },
    { value: "cheque", label: "Cheque", icon: FileText },
  ]

  // ===== EVENT HANDLERS =====

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

   
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required"
    } else {
      const amount = Number.parseFloat(formData.amount)
      if (isNaN(amount)) {
        newErrors.amount = "Please enter a valid amount"
      } else if (amount <= 0) {
        newErrors.amount = "Amount must be greater than zero"
      } else if (amount < 0) {
        newErrors.amount = "Amount cannot be negative"
      }
    }
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.time) newErrors.time = "Time is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.mode) newErrors.mode = "Payment mode is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      console.log("Transaction Data:", formData)
    
      alert(`${formData.type === "income" ? "Income" : "Expense"} transaction added successfully!`)

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
    setErrors({})
  }

  const getCurrentDateTime = () => {
    const now = new Date()
    const date = now.toISOString().split("T")[0]
    const time = now.toTimeString().slice(0, 5)

    setFormData((prev) => ({
      ...prev,
      date,
      time,
    }))
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ===== HEADER SECTION ===== */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">
            Add {formData.type === "income" ? "Income" : "Expense"} Transaction
          </h1>
          <p className="text-gray-300">
            Record your {formData.type === "income" ? "income" : "expense"} transaction details
          </p>
        </div>

        {/* ===== MAIN FORM SECTION ===== */}
        <Box className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transaction Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Transaction Type</label>
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800/30 rounded-lg">
                {transactionTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange("type", type.value)}
                    className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.type === type.value
                        ? "border-[#4ADE80] bg-[#4ADE80]/10"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <type.icon className={`w-5 h-5 ${formData.type === type.value ? "text-[#4ADE80]" : type.color}`} />
                    <span className={`font-medium ${formData.type === type.value ? "text-[#4ADE80]" : "text-white"}`}>
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title Field - Using your InputField component */}
            <InputField
              label={`${formData.type === "income" ? "Income" : "Expense"} Title`}
              type="text"
              id="title"
              placeholder={
                formData.type === "income"
                  ? "e.g., Salary payment, Freelance work, Investment return"
                  : "e.g., Grocery shopping, Utility bill, Transportation"
              }
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}

            {/* Amount Field - Using your InputField component */}
            <InputField
              label="Amount"
              type="number"
              id="amount"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              required
            />
            {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount}</p>}

            {/* Date Field - Using your InputField component */}
            <InputField
              label="Date"
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              required
            />
            {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}

            {/* Time Field - Using your InputField component with custom button */}
            <div>
              <InputField
                label="Time"
                type="time"
                id="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                required
              />
              <button
                type="button"
                onClick={getCurrentDateTime}
                className="mt-2 px-4 py-2 bg-[#4ADE80] text-black rounded-lg hover:bg-[#3BC470] transition-colors font-medium text-sm"
              >
                Set Current Date & Time
              </button>
              {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time}</p>}
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Category
                </div>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleInputChange("category", category.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.category === category.value
                        ? "border-[#4ADE80] bg-[#4ADE80]/10"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <category.icon
                      className={`w-5 h-5 ${formData.category === category.value ? "text-[#4ADE80]" : "text-gray-400"}`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        formData.category === category.value ? "text-[#4ADE80]" : "text-white"
                      }`}
                    >
                      {category.label}
                    </span>
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Payment Mode Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Mode
                </div>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {paymentModes.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => handleInputChange("mode", mode.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.mode === mode.value
                        ? "border-[#4ADE80] bg-[#4ADE80]/10"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <mode.icon
                      className={`w-5 h-5 ${formData.mode === mode.value ? "text-[#4ADE80]" : "text-gray-400"}`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        formData.mode === mode.value ? "text-[#4ADE80]" : "text-white"
                      }`}
                    >
                      {mode.label}
                    </span>
                  </button>
                ))}
              </div>
              {errors.mode && <p className="text-red-400 text-sm mt-1">{errors.mode}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-[#4ADE80] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#3BC470] transition-colors duration-200"
              >
                <Save className="w-5 h-5" />
                Add {formData.type === "income" ? "Income" : "Expense"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center gap-2 bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
                Reset
              </button>
            </div>
          </form>
        </Box>

        {/* ===== PREVIEW SECTION ===== */}
        {(formData.title || formData.amount) && (
          <Box title="Transaction Preview" subtitle="Review your transaction details" className="max-w-2xl mx-auto">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-300">Type:</span>
                <div className="flex items-center gap-2">
                  {formData.type === "income" ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`font-medium ${formData.type === "income" ? "text-green-400" : "text-red-400"}`}>
                    {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
                  </span>
                </div>
              </div>

              {formData.title && (
                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300">Title:</span>
                  <span className="text-white font-medium">{formData.title}</span>
                </div>
              )}

              {formData.amount && (
                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300">Amount:</span>
                  <span className="text-[#4ADE80] font-bold text-lg">${formData.amount}</span>
                </div>
              )}

              {(formData.date || formData.time) && (
                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300">Date & Time:</span>
                  <span className="text-white">
                    {formData.date} {formData.time}
                  </span>
                </div>
              )}

              {formData.category && (
                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300">Category:</span>
                  <span className="text-white capitalize">{formData.category}</span>
                </div>
              )}

              {formData.mode && (
                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300">Payment Mode:</span>
                  <span className="text-white capitalize">{formData.mode}</span>
                </div>
              )}
            </div>
          </Box>
        )}
      </div>
    </div>
  )
}

export default AddTransaction
