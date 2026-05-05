import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import SettingsContext from "./SettingsContext";
import { settingsAPI } from "../api/api";

function parseUtcOffsetMinutes(offset = "") {
  const clean = offset.replace(/^(GMT|UTC)/i, "").trim();
  const match = clean.match(/^([+-])(\d{1,2}):(\d{2})$/);
  if (!match) return 0;
  const sign = match[1] === "+" ? 1 : -1;
  return sign * (parseInt(match[2], 10) * 60 + parseInt(match[3], 10));
}

// ✅ Safe date parser — handles all backend formats without crashing
function safeParseDatetime(rawDate, rawTime) {
  if (!rawDate) return null;
  try {
    // Already a full ISO string
    if (rawDate.includes("T")) return new Date(rawDate);
    // Date only
    if (!rawTime) return new Date(rawDate + "T00:00:00");
    // Combine date + time — strip milliseconds/timezone if present
    const cleanTime = rawTime.split(".")[0].split("Z")[0];
    return new Date(`${rawDate}T${cleanTime}`);
  } catch {
    return null;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    currency_symbol: "$",
    currency_code: "USD",
    utc_offset: "GMT+00:00",
    budget_limit: 0,
  });

  // ── Clock lives in its own isolated state ─────────────────
  // It is NOT included in the main context value so ticking
  // every second does NOT re-render all consumers
  const clockRef = useRef({ time: "", snap: new Date() });
  const [, forceClockTick] = useState(0); // only Clock component subscribes
  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false);

  const refreshSettings = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const res = await settingsAPI.get();
      const s = res?.data?.settings || res?.data || res || {};
      const formatted = {
        currency_symbol: s.currency_symbol || s.symbol || "$",
        currency_code: s.currency_code || s.currency || "USD",
        utc_offset: s.utc_offset || s.timezone_offset || s.timezone || "GMT+00:00",
        budget_limit: parseFloat(s.budget_limit) || 0,
      };
      offsetRef.current = parseUtcOffsetMinutes(formatted.utc_offset);
      setSettings(formatted);
      localStorage.setItem("appSettings", JSON.stringify(formatted));
    } catch {
      const cached = localStorage.getItem("appSettings");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          offsetRef.current = parseUtcOffsetMinutes(parsed.utc_offset);
          setSettings(parsed);
        } catch {
          // Ignore parse errors
        }
      }
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // ── Clock tick — isolated, does NOT touch settings state ──
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const userNow = new Date(now.getTime() + offsetRef.current * 60 * 1000);
      clockRef.current = {
        time: userNow.toISOString().slice(11, 19),
        snap: userNow,
      };
      forceClockTick((n) => n + 1); // only re-renders Clock consumers
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Formatters ─────────────────────────────────────────────
  const formatAmount = useCallback(
    (amount) => {
      const num = parseFloat(amount) || 0;
      return `${settings.currency_symbol}${num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
    [settings.currency_symbol]
  );

  // ✅ Fixed formatDate — uses safeParseDatetime, never returns "Invalid Date"
  const formatDate = useCallback((rawDate, rawTime) => {
    if (!rawDate) return "—";
    const d = safeParseDatetime(rawDate, rawTime);
    if (!d || isNaN(d.getTime())) {
      // Fallback: just show the raw date string nicely
      return rawDate;
    }
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  // ✅ Fixed formatTime — uses safeParseDatetime, never crashes
  const formatTime = useCallback((rawDate, rawTime) => {
    if (!rawTime) return "—";
    const d = safeParseDatetime(rawDate, rawTime);
    if (!d || isNaN(d.getTime())) {
      // Fallback: show raw time sliced to HH:MM
      return rawTime.slice(0, 5);
    }
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // ✅ Clock NOT in value — prevents every consumer re-rendering every second
  const value = useMemo(
    () => ({
      settings,
      currencySymbol: settings.currency_symbol,
      currencyCode: settings.currency_code,
      utcOffset: settings.utc_offset,
      budgetLimit: settings.budget_limit,

      formatAmount,
      formatDate,
      formatTime,

      // Clock — read via ref so only components that call these get updates
      get liveTime() { return clockRef.current.time; },
      get userNow()  { return clockRef.current.snap;  },

      refreshSettings,
    }),
    [settings, formatAmount, formatDate, formatTime, refreshSettings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}