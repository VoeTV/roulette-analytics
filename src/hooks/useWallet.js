import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "rs_wallet_v1";
const HISTORY_KEY = "rs_history_v1";
const DEFAULT_BALANCE = 1000;

function readNumber(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    if (v == null) return fallback;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

function readJSON(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    if (!v) return fallback;
    return JSON.parse(v);
  } catch {
    return fallback;
  }
}

export function useWallet() {
  const [balance, setBalance] = useState(() => readNumber(STORAGE_KEY, DEFAULT_BALANCE));
  const [history, setHistory] = useState(() => readJSON(HISTORY_KEY, []));

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(balance)); } catch {}
  }, [balance]);

  useEffect(() => {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50))); } catch {}
  }, [history]);

  const debit = useCallback((amount) => {
    setBalance((b) => Math.max(0, b - amount));
  }, []);

  const credit = useCallback((amount) => {
    setBalance((b) => b + amount);
  }, []);

  const reset = useCallback(() => {
    setBalance(DEFAULT_BALANCE);
    setHistory([]);
  }, []);

  const addTopUp = useCallback((amount = 1000) => {
    setBalance((b) => b + amount);
  }, []);

  const pushHistory = useCallback((entry) => {
    setHistory((h) => [entry, ...h].slice(0, 50));
  }, []);

  return { balance, setBalance, debit, credit, reset, addTopUp, history, pushHistory };
}
