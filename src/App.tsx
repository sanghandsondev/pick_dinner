import { useMemo, useState } from "react";
import mealsData from "./data/meals.json";
import type { Meal, MealCategory } from "./types";
import DateHeader from "./components/DateHeader";
import MealList from "./components/MealList";
import PickDinnerButton from "./components/PickDinnerButton";
import PickDinnerModal from "./components/PickDinnerModal";
import HistoryModal from "./components/HistoryModal";
import { usePickHistory } from "./hooks/usePickHistory";

const MEALS: Meal[] = mealsData as Meal[];

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [dealMeal, setDealMeal] = useState<Meal | null>(null);
  const [category, setCategory] = useState<MealCategory>("rice");
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const { history, addEntry, clearHistory } = usePickHistory();

  const today = useMemo(() => new Date(), []);
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
    setDealMeal(meal);
    setModalOpen(false);
    addEntry(meal);
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
            <div className="deal-hero__label">Tonight's dinner</div>
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
        onClear={clearHistory}
      />
    </div>
  );
}
