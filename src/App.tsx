import { useMemo, useState } from "react";
import mealsData from "./data/meals.json";
import type { Meal, MealCategory } from "./types";
import DateHeader from "./components/DateHeader";
import MealList from "./components/MealList";
import PickDinnerButton from "./components/PickDinnerButton";
import PickDinnerModal from "./components/PickDinnerModal";
import HistoryModal from "./components/HistoryModal";
import { usePickHistory, type HistoryEntry } from "./hooks/usePickHistory";

const MEALS: Meal[] = mealsData as Meal[];

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function entryToMeal(entry: HistoryEntry): Meal {
  return {
    id: entry.mealId,
    name: entry.mealName,
    emojis: entry.emojis,
    category: entry.category,
  };
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [category, setCategory] = useState<MealCategory>("rice");
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const { history, addEntry, clearToday } = usePickHistory();

  const today = useMemo(() => new Date(), []);

  // Nếu entry lịch sử mới nhất có ngày = hôm nay → đã deal hôm nay.
  const todayEntry = useMemo(() => {
    if (history.length === 0) return null;
    const latest = history[0];
    const dealtAt = new Date(latest.dealtAt);
    if (isNaN(dealtAt.getTime())) return null;
    return isSameLocalDay(dealtAt, today) ? latest : null;
  }, [history, today]);

  const dealMeal: Meal | null = todayEntry ? entryToMeal(todayEntry) : null;
  const dealt = dealMeal !== null;

  const mealsByCategory = useMemo(
    () => MEALS.filter((m) => m.category === category),
    [category],
  );

  // Pool để random: theo category hiện tại, loại bỏ các món bị exclude.
  const pickPool = useMemo(
    () => mealsByCategory.filter((m) => !excludedIds.has(m.id)),
    [mealsByCategory, excludedIds],
  );

  const openModal = () => {
    if (dealt || pickPool.length === 0) return;
    setModalOpen(true);
  };

  const handleDeal = (meal: Meal) => {
    addEntry(meal);
    setModalOpen(false);
  };

  const toggleExclude = (id: string) => {
    setExcludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={`app-shell${dealt ? " app-shell--dealt" : ""}`}>
      <main className="app-main">
        <DateHeader
          date={today}
          historyCount={history.length}
          onOpenHistory={() => setHistoryOpen(true)}
        />
        {dealt ? (
          <section className="deal-hero" aria-live="polite">
            <div className="deal-hero__name">{dealMeal?.name}</div>
            <div className="deal-hero__emojis" aria-hidden>
              {dealMeal?.emojis.map((e, i) => (
                <span key={i} className="deal-hero__emoji">
                  {e}
                </span>
              ))}
            </div>
          </section>
        ) : (
          <MealList
            meals={mealsByCategory}
            excludedIds={excludedIds}
            onToggle={toggleExclude}
            category={category}
            onChangeCategory={setCategory}
            homeCount={MEALS.filter((m) => m.category === "rice").length}
            eatOutCount={MEALS.filter((m) => m.category === "other").length}
          />
        )}
      </main>
      <PickDinnerButton
        disabled={dealt || pickPool.length === 0}
        onClick={openModal}
      />

      <PickDinnerModal
        open={modalOpen}
        meals={pickPool}
        onClose={() => setModalOpen(false)}
        onDeal={handleDeal}
      />

      <HistoryModal
        open={historyOpen}
        entries={history}
        onClose={() => setHistoryOpen(false)}
        onClearToday={clearToday}
        hasTodayEntry={dealt}
      />
    </div>
  );
}
