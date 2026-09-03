import { useCallback, useEffect, useState } from "react";
import type { Meal, MealCategory } from "../types";
import seedMeals from "../data/meals.json";

const STORAGE_KEY = "pick_dinner_meals_v1";

function sanitize(raw: unknown): Meal | null {
  if (!raw || typeof raw !== "object") return null;
  const m = raw as Record<string, unknown>;
  const id = typeof m.id === "string" ? m.id : null;
  const name = typeof m.name === "string" ? m.name.trim() : null;
  if (!id || !name) return null;
  const category: MealCategory = m.category === "other" ? "other" : "rice";
  return { id, name, category };
}

function seedFromJson(): Meal[] {
  return (seedMeals as unknown[])
    .map(sanitize)
    .filter((m): m is Meal => m !== null);
}

function loadInitial(): Meal[] {
  if (typeof localStorage === "undefined") return seedFromJson();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = parsed
          .map(sanitize)
          .filter((m): m is Meal => m !== null);
        // Nếu user từng lưu (kể cả rỗng cố ý) → tôn trọng lựa chọn.
        return cleaned;
      }
    }
  } catch {
    // ignore parse errors, fall through to seed
  }
  return seedFromJson();
}

function newId(): string {
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>(() => loadInitial());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
    } catch {
      // quota etc — bỏ qua
    }
  }, [meals]);

  const addMeal = useCallback((name: string, category: MealCategory) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setMeals((prev) => [...prev, { id: newId(), name: trimmed, category }]);
  }, []);

  const updateMeal = useCallback(
    (id: string, patch: { name?: string; category?: MealCategory }) => {
      setMeals((prev) =>
        prev.map((m) => {
          if (m.id !== id) return m;
          const nextName =
            patch.name !== undefined ? patch.name.trim() : m.name;
          if (!nextName) return m; // không cho phép name rỗng
          return {
            ...m,
            name: nextName,
            category: patch.category ?? m.category,
          };
        }),
      );
    },
    [],
  );

  const deleteMeal = useCallback((id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // Đổi thứ tự 2 món trong cùng 1 category. delta = -1 (lên), +1 (xuống).
  const moveMeal = useCallback((id: string, delta: -1 | 1) => {
    setMeals((prev) => {
      const idx = prev.findIndex((m) => m.id === id);
      if (idx === -1) return prev;
      const cat = prev[idx].category;
      // Tìm neighbor gần nhất cùng category theo hướng delta.
      let neighborIdx = -1;
      if (delta === -1) {
        for (let i = idx - 1; i >= 0; i--) {
          if (prev[i].category === cat) {
            neighborIdx = i;
            break;
          }
        }
      } else {
        for (let i = idx + 1; i < prev.length; i++) {
          if (prev[i].category === cat) {
            neighborIdx = i;
            break;
          }
        }
      }
      if (neighborIdx === -1) return prev;
      const next = prev.slice();
      [next[idx], next[neighborIdx]] = [next[neighborIdx], next[idx]];
      return next;
    });
  }, []);

  return { meals, addMeal, updateMeal, deleteMeal, moveMeal };
}
