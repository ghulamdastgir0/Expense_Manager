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

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    currency_symbol: "$",
    currency_code: "USD",
    utc_offset: "GMT+00:00",
    budget_limit: 0
  });

  // ── Live clock lives in a ref + separate small state ──────
  // so ticking every second does NOT re-render all consumers
  const [liveTimeString, setLiveTimeString] = useState("");
  const [userNowSnap, setUserNowSnap] = useState(new Date());
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
        utc_offset:
          s.utc_offset || s.timezone_offset || s.timezone || "GMT+00:00",
        budget_limit: parseFloat(s.budget_limit) || 0
      };
      offsetRef.current = parseUtcOffsetMinutes(formatted.utc_offset);
      setSettings(formatted);
      localStorage.setItem("appSettings", JSON.stringify(formatted));
    } catch {
      const cached = localStorage.getItem("appSettings");
      if (cached) {
        const parsed = JSON.parse(cached);
        offsetRef.current = parseUtcOffsetMinutes(parsed.utc_offset);
        setSettings(parsed);
      }
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // ── Clock tick — only updates clock state, not settings ───
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const userNow = new Date(now.getTime() + offsetRef.current * 60 * 1000);
      setLiveTimeString(userNow.toISOString().slice(11, 19));
      setUserNowSnap(userNow);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Formatters — only re-create when currency changes ─────
  const formatAmount = useCallback(
    (amount) => {
      const num = parseFloat(amount) || 0;
      return `${settings.currency_symbol}${num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    },
    [settings.currency_symbol]
  );

  const formatDate = useCallback((rawDate, rawTime) => {
    if (!rawDate) return "";
    try {
      const dateStr = rawTime ? `${rawDate}T${rawTime}` : rawDate;
      return new Date(dateStr).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return rawDate;
    }
  }, []);

  const formatTime = useCallback((rawDate, rawTime) => {
    if (!rawTime) return "";
    try {
      const dateStr = rawDate ? `${rawDate}T${rawTime}` : rawTime;
      return new Date(dateStr).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    } catch {
      return rawTime;
    }
  }, []);

  // ── Stable value object — only changes when settings change
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

      liveTime: liveTimeString,
      userNow: userNowSnap,

      refreshSettings
    }),
    [
      settings,
      formatAmount,
      formatDate,
      formatTime,
      liveTimeString,
      userNowSnap,
      refreshSettings
    ]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
