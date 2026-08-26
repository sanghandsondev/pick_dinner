import { useCallback, useEffect, useState } from "react";
import type { Meal, MealCategory } from "../types";

export interface HistoryEntry {
  id: string;
  mealId: string;
  mealName: string;
  emojis: string[];
  category: MealCategory;
  dealtAt: string; // ISO string
}

const STORAGE_KEY = "pick_dinner_history_v1";
const LIMIT = 200;

function loadInitial(): HistoryEntry[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as HistoryEntry[];
  } catch {
    return [];
  }
}

export function usePickHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadInitial());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore quota errors
    }
  }, [history]);

  const addEntry = useCallback((meal: Meal) => {
    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      mealId: meal.id,
      mealName: meal.name,
      emojis: meal.emojis,
      category: meal.category,
      dealtAt: new Date().toISOString(),
    };
    setHistory((prev) => [entry, ...prev].slice(0, LIMIT));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addEntry, clearHistory };
}
