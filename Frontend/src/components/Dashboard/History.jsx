"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Download,
  ArrowUpDown,
  Eye,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle
} from "lucide-react";
import Box from "./Box";

function History({ onNavigate }) {
  // Extended transactions data
  const [allTransactions, setAllTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Dropdown states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    transactionId: null,
    title: "",
    message: ""
  });
  const [notification, setNotification] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: ""
  });

  // Month selection state
  const token = localStorage.getItem("token");
  const data = JSON.parse(localStorage.getItem("dashboardData"));
  const monthIndex = localStorage.getItem("currentMonth");
  const [selectedMonth, setSelectedMonth] = useState(monthIndex || "1");
  const currency_symbol = data?.currency_symbol || "$";

  // Month names array
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  // Show notification helper
  const showNotification = (type, title, message) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    });
  };

  // Delete transaction function
  const handleDeleteTransaction = async (transactionId) => {
    setConfirmDialog({
      isOpen: true,
      transactionId,
      title: "Delete Transaction",
      message:
        "Are you sure you want to delete this transaction? This action cannot be undone."
    });
  };

  const confirmDeleteTransaction = async () => {
    const { transactionId } = confirmDialog;

    try {
      const response = await fetch(`/transactions/delete?id=${transactionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        showToast("Transaction deleted successfully");
        setAllTransactions((prev) =>
          prev.filter((tx) => tx.id !== transactionId)
        );
      } else {
        showToast("Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      showToast("Failed to delete transaction");
    }
  };

  // Fetch transactions when month changes
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) {
        // Navigate to signin page without react-router-dom
        window.location.href = "/signin";
        return;
      }

      try {
        const response = await fetch(
          `/transactions/history?month=${selectedMonth}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          console.log("Fetched transactions:", responseData);

          // Handle both direct array and nested transactions array
          const transactions = responseData.transactions || responseData;

          // Map the server data to match frontend expectations
          const mappedTransactions = transactions.map((tx) => ({
            id: tx.id,
            description: tx.description,
            amount: Number.parseFloat(tx.amount), // Convert string to number
            date: formatDate(tx.date), // Format the date
            time: tx.transaction_time, // Use transaction_time from server
            category: tx.category || "Other",
            mode: tx.mode || "Unknown"
          }));

          setAllTransactions(mappedTransactions);
        } else {
          console.error("Failed to fetch transactions");
          setAllTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setAllTransactions([]);
      }
    };

    fetchTransactions();
  }, [selectedMonth, token]);

  // Filter and sort transactions
  const filteredTransactions = allTransactions
    .filter((transaction) => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        transaction.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "amount":
          aValue = Math.abs(a.amount);
          bValue = Math.abs(b.amount);
          break;
        case "date":
          // For date sorting, we need to create proper date objects
          aValue = new Date(a.date + " " + a.time);
          bValue = new Date(b.date + " " + b.time);
          break;
        case "category":
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = a.description;
          bValue = b.description;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const categories = [
    "all",
    "food",
    "transport",
    "entertainment",
    "utilities",
    "income",
    "shopping"
  ];

  const handleExport = () => {
    try {
      console.log("Exporting transaction history...");

      // Create a new window for printing
      const printWindow = window.open("", "_blank");

      // Calculate summary data
      const totalIncome = filteredTransactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = Math.abs(
        filteredTransactions
          .filter((t) => t.amount < 0)
          .reduce((sum, t) => sum + t.amount, 0)
      );
      const netAmount = filteredTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      );
      const selectedMonthName = monthNames[selectedMonth - 1];

      // Create HTML content for printing
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Transaction History - ${selectedMonthName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .summary { margin-bottom: 30px; padding: 15px; background-color: #f5f5f5; }
              .summary-item { margin: 5px 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #4ade80; color: black; font-weight: bold; }
              tr:nth-child(even) { background-color: #f9f9f9; }
              .amount-positive { color: #22c55e; font-weight: bold; }
              .amount-negative { color: #ef4444; font-weight: bold; }
              .print-date { font-size: 12px; color: #666; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Transaction History Report</h1>
              <p class="print-date">Generated on: ${new Date().toLocaleDateString()}</p>
              <p class="print-date">Month: ${selectedMonthName}</p>
            </div>
            
            <div class="summary">
              <h2>Summary</h2>
              <div class="summary-item"><strong>Total Income:</strong> ${currency_symbol}${totalIncome.toFixed(
        2
      )}</div>
              <div class="summary-item"><strong>Total Expenses:</strong> ${currency_symbol}${totalExpenses.toFixed(
        2
      )}</div>
              <div class="summary-item"><strong>Net Amount:</strong> ${currency_symbol}${netAmount.toFixed(
        2
      )}</div>
              <div class="summary-item"><strong>Total Transactions:</strong> ${
                filteredTransactions.length
              }</div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Mode</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${filteredTransactions
                  .map(
                    (transaction) => `
                  <tr>
                    <td>${transaction.description}</td>
                    <td>${transaction.category}</td>
                    <td>${transaction.date}</td>
                    <td>${transaction.time}</td>
                    <td>${transaction.mode}</td>
                    <td class="${
                      transaction.amount > 0
                        ? "amount-positive"
                        : "amount-negative"
                    }">
                      ${
                        transaction.amount > 0 ? "+" : "-"
                      }${currency_symbol}${Math.abs(transaction.amount).toFixed(
                      2
                    )}
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `;

      // Write content to new window and trigger print
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };

      showNotification(
        "success",
        "Export Started",
        "Your transaction history is being prepared for printing."
      );
    } catch (error) {
      console.error("Error exporting:", error);
      showNotification(
        "error",
        "Export Failed",
        "Failed to export. Please try again."
      );
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleMonthChange = (e) => {
    const monthIndex = Number.parseInt(e.target.value);
    setSelectedMonth(monthIndex);
  };
  const Toast = ({ message, isVisible, onClose }) => {
    useEffect(() => {
      if (isVisible) {
        const timer = setTimeout(() => {
          onClose();
        }, 2000); // Hide after 2 seconds

        return () => clearTimeout(timer);
      }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
      <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
        <div className="bg-[#4ADE80] text-black px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{message}</span>
        </div>
      </div>
    );
  };

  const [toast, setToast] = useState({ isVisible: false, message: "" });
  const showToast = (message) => {
    setToast({ isVisible: true, message });
  };

  const hideToast = () => {
    setToast({ isVisible: false, message: "" });
  };
  // Inline confirmation modal component
  const ConfirmationModal = () => {
    if (!confirmDialog.isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {confirmDialog.title}
              </h3>
              <button
                onClick={() =>
                  setConfirmDialog({ ...confirmDialog, isOpen: false })
                }
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-300 mb-6">{confirmDialog.message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setConfirmDialog({ ...confirmDialog, isOpen: false })
                }
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmDeleteTransaction();
                  setConfirmDialog({ ...confirmDialog, isOpen: false });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-black text-white space-y-6">
      <Toast message={toast.message} isVisible={toast.isVisible} onClose={hideToast} />
      {/* ===== HEADER SECTION ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Transaction History</h1>
          <p className="text-gray-300 text-sm">
            Complete history of your financial transactions
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate("Transactions")}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Back to Transactions
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-[#4ADE80] text-black rounded-lg hover:bg-[#3BC470] transition-colors duration-200 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* ===== SUMMARY SECTION ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Box title="Total Income" className="shadow-lg">
          <div className="text-2xl font-bold text-green-400">
            +{currency_symbol}
            {filteredTransactions
              .filter((t) => t.amount > 0)
              .reduce((sum, t) => sum + t.amount, 0)
              .toFixed(2)}
          </div>
        </Box>
        <Box title="Total Expenses" className="shadow-lg">
          <div className="text-2xl font-bold text-red-400">
            -{currency_symbol}
            {Math.abs(
              filteredTransactions
                .filter((t) => t.amount < 0)
                .reduce((sum, t) => sum + t.amount, 0)
            ).toFixed(2)}
          </div>
        </Box>
        <Box title="Net Amount" className="shadow-lg">
          <div className="text-2xl font-bold text-blue-400">
            {currency_symbol}
            {filteredTransactions
              .reduce((sum, t) => sum + t.amount, 0)
              .toFixed(2)}
          </div>
        </Box>
      </div>

      {/* ===== FILTERS SECTION ===== */}
      <Box title="Filters & Search" className="shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none capitalize"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>

          {/* Sort Options */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="category">Sort by Category</option>
              <option value="description">Sort by Description</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* Month Filter */}
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none"
          >
            {monthNames.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </Box>

      {/* ===== TRANSACTIONS TABLE ===== */}
      <Box
        title={`Transaction History (${filteredTransactions.length})`}
        className="shadow-lg"
      >
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-700">
                <th
                  className="text-left py-4 px-4 text-gray-300 font-medium cursor-pointer hover:text-white w-1/4"
                  onClick={() => toggleSort("description")}
                >
                  Description
                </th>
                <th
                  className="text-left py-4 px-4 text-gray-300 font-medium cursor-pointer hover:text-white w-1/6"
                  onClick={() => toggleSort("category")}
                >
                  Category
                </th>
                <th
                  className="text-left py-4 px-4 text-gray-300 font-medium cursor-pointer hover:text-white w-1/5"
                  onClick={() => toggleSort("date")}
                >
                  Date & Time
                </th>
                <th className="text-left py-4 px-4 text-gray-300 font-medium w-1/12">
                  Mode
                </th>
                <th
                  className="text-right py-4 px-4 text-gray-300 font-medium cursor-pointer hover:text-white w-1/6"
                  onClick={() => toggleSort("amount")}
                >
                  Amount
                </th>
                <th className="text-center py-4 px-4 text-gray-300 font-medium w-16">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div
                      className="font-medium text-white truncate"
                      title={transaction.description}
                    >
                      {transaction.description}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs capitalize inline-block">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300 text-sm">
                    <div className="font-medium">{transaction.date}</div>
                    <div className="text-xs text-gray-400">
                      {transaction.time}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300 text-sm">
                    {transaction.mode}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span
                      className={`font-semibold text-sm ${
                        transaction.amount > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : "-"}
                      {currency_symbol}
                      {Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200 group"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-lg font-medium">No transactions found</div>
              <div className="text-sm">
                Try adjusting your search criteria or filters
              </div>
            </div>
          )}
        </div>
      </Box>

      <ConfirmationModal />
    </div>
  );
}

export default History;
