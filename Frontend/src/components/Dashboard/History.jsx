import { useState, useEffect, useCallback } from "react";
import { Search, Download, ArrowUpDown, Eye, Trash2 } from "lucide-react";
import Box from "./Box";
import { transactionAPI, referenceAPI } from "../../api/api";
import { useSettings } from "../../Context/useSettings";

// ─── Safe date/time helpers ───────────────────────────────────────────────────
// Tries every field name the backend might use for date & time.
function safeParseDatetime(tx) {
  // Try dedicated date + time fields first, then ISO datetime fields
  const rawDate =
    tx.transaction_date ||
    tx.date ||
    tx.created_at ||
    tx.createdAt ||
    tx.timestamp ||
    null;

  const rawTime =
    tx.transaction_time ||
    tx.time ||
    null;

  if (!rawDate) return { date: null, time: null, iso: null };

  // If rawDate already contains a time component (ISO datetime), use it directly
  const iso = rawTime ? `${rawDate}T${rawTime}` : rawDate;
  const d = new Date(iso);
  if (isNaN(d.getTime())) {
    // Last resort: try rawDate alone
    const d2 = new Date(rawDate);
    if (isNaN(d2.getTime())) return { date: null, time: null, iso: null };
    return { date: d2, time: d2, iso: d2.toISOString() };
  }
  return { date: d, time: d, iso: d.toISOString() };
}

function formatDateSafe(tx) {
  const { date } = safeParseDatetime(tx);
  if (!date) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function formatTimeSafe(tx) {
  const { time } = safeParseDatetime(tx);
  if (!time) return "";
  return time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
// ─────────────────────────────────────────────────────────────────────────────

// Normalise type so "income", "Income", "INCOME" all match
function isIncome(type) {
  return type?.toLowerCase() === "income";
}
function isExpense(type) {
  return type?.toLowerCase() === "expense";
}

function History({ onNavigate }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totals, setTotals] = useState({ income: 0, expenses: 0, net: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { formatAmount } = useSettings();

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    type: "",
    sort_by: "date",
    sort_order: "desc",
    from_date: "",
    to_date: ""
  });

  useEffect(() => {
    referenceAPI
      .categories()
      .then((res) => {
        const data = res?.data?.categories || res?.data || res || [];
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(console.error);
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (filters.from_date) params.from_date = filters.from_date;
      if (filters.to_date)   params.to_date   = filters.to_date;
      if (filters.category && filters.category !== "all")
        params.category = filters.category;
      if (filters.type && filters.type !== "all")
        params.type = filters.type;
      if (filters.search) params.search = filters.search;
      params.sort_by    = filters.sort_by;
      params.sort_order = filters.sort_order;

      const res = await transactionAPI.getHistory(params);

      const txs = Array.isArray(res?.data?.transactions) ? res.data.transactions
        : Array.isArray(res?.data)                        ? res.data
        : Array.isArray(res?.transactions)                ? res.transactions
        : Array.isArray(res)                              ? res
        : [];

      setTransactions(txs);

      const income = txs
        .filter((t) => isIncome(t.type))
        .reduce((s, t) => s + parseFloat(t.amount || 0), 0);
      const expenses = txs
        .filter((t) => isExpense(t.type))
        .reduce((s, t) => s + parseFloat(t.amount || 0), 0);
      setTotals({ income, expenses, net: income - expenses });
    } catch (err) {
      console.error("fetchHistory error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleFilterChange = (key, val) =>
    setFilters((p) => ({ ...p, [key]: val }));

  const toggleSort = (field) =>
    setFilters((p) => ({
      ...p,
      sort_by: field,
      sort_order:
        p.sort_by === field && p.sort_order === "desc" ? "asc" : "desc"
    }));

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction? Balance will be reversed."))
      return;
    try {
      setDeletingId(id);
      await transactionAPI.delete(id);
      fetchHistory();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = () => {
    const header = "Date,Time,Title,Type,Category,Payment Method,Amount";
    const rows = transactions.map((t) => {
      const { iso } = safeParseDatetime(t);
      const d = iso ? new Date(iso) : null;
      return [
        d ? d.toLocaleDateString("en-GB") : "",
        d ? d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "",
        `"${t.title}"`,
        t.type,
        t.category,
        t.payment_method,
        t.amount
      ].join(",");
    });
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transaction_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-black text-white space-y-6">
      {/* HEADER */}
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
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-[#4ADE80] text-black rounded-lg hover:bg-[#3BC470] transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* TOTALS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Box title="Total Income" className="shadow-lg">
          <div className="text-2xl font-bold text-green-400">
            +{formatAmount(totals.income)}
          </div>
        </Box>
        <Box title="Total Expenses" className="shadow-lg">
          <div className="text-2xl font-bold text-red-400">
            -{formatAmount(totals.expenses)}
          </div>
        </Box>
        <Box title="Net Amount" className="shadow-lg">
          <div
            className={`text-2xl font-bold ${totals.net >= 0 ? "text-blue-400" : "text-red-400"}`}
          >
            {totals.net < 0 ? "-" : ""}
            {formatAmount(Math.abs(totals.net))}
          </div>
        </Box>
      </div>

      {/* FILTERS */}
      <Box title="Filters & Search" className="shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by title…"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none"
            />
          </div>

          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.category_id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          <div>
            <label className="block text-xs text-gray-400 mb-1">From Date</label>
            <input
              type="date"
              value={filters.from_date}
              onChange={(e) => handleFilterChange("from_date", e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">To Date</label>
            <input
              type="date"
              value={filters.to_date}
              onChange={(e) => handleFilterChange("to_date", e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filters.sort_by}
              onChange={(e) => handleFilterChange("sort_by", e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#4ADE80] focus:outline-none"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="category">Sort by Category</option>
              <option value="description">Sort by Description</option>
            </select>
            <button
              onClick={() =>
                handleFilterChange(
                  "sort_order",
                  filters.sort_order === "asc" ? "desc" : "asc"
                )
              }
              className="px-3 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              title={`Order: ${filters.sort_order.toUpperCase()}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button
          onClick={() =>
            setFilters({
              search: "",
              category: "",
              type: "",
              sort_by: "date",
              sort_order: "desc",
              from_date: "",
              to_date: ""
            })
          }
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Clear all filters
        </button>
      </Box>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}{" "}
          <button onClick={fetchHistory} className="ml-4 underline">
            Retry
          </button>
        </div>
      )}

      {/* TABLE */}
      <Box
        title={`Transaction History (${transactions.length})`}
        className="shadow-lg"
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#4ADE80] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th
                    className="text-left py-3 px-2 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => toggleSort("description")}
                  >
                    Description
                  </th>
                  <th
                    className="text-left py-3 px-2 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => toggleSort("category")}
                  >
                    Category
                  </th>
                  <th
                    className="text-left py-3 px-2 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => toggleSort("date")}
                  >
                    Date & Time
                  </th>
                  <th className="text-left py-3 px-2 text-gray-300 font-medium">
                    Mode
                  </th>
                  <th
                    className="text-left py-3 px-2 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => toggleSort("amount")}
                  >
                    Amount
                  </th>
                  <th className="text-left py-3 px-2 text-gray-300 font-medium">
                    Type
                  </th>
                  <th className="text-left py-3 px-2 text-gray-300 font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.transaction_id}
                    className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-4 px-2 font-medium text-white">
                      {tx.title}
                    </td>
                    <td className="py-4 px-2">
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-gray-300 text-sm">
                      {/* FIX: Use safeParseDatetime to handle any field name from backend */}
                      <div>{formatDateSafe(tx)}</div>
                      <div className="text-xs text-gray-400">{formatTimeSafe(tx)}</div>
                    </td>
                    <td className="py-4 px-2 text-gray-300 text-sm">
                      {tx.payment_method}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <span
                        className={`font-semibold ${isIncome(tx.type) ? "text-green-400" : "text-red-400"}`}
                      >
                        {isIncome(tx.type) ? "+" : "-"}
                        {formatAmount(tx.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${isIncome(tx.type) ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <button
                        onClick={() => handleDelete(tx.transaction_id)}
                        disabled={deletingId === tx.transaction_id}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-400">
                No transactions found matching your criteria.
              </div>
            )}
          </div>
        )}
      </Box>
    </div>
  );
}

export default History;