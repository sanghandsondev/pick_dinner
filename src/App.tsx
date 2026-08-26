import { useMemo, useState } from "react";
import mealsData from "./data/meals.json";
import type { Meal } from "./types";
import DateHeader from "./components/DateHeader";
import MealList from "./components/MealList";
import PickDinnerButton from "./components/PickDinnerButton";
import PickDinnerModal from "./components/PickDinnerModal";

const MEALS: Meal[] = mealsData as Meal[];

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [dealMeal, setDealMeal] = useState<Meal | null>(null);

  const today = useMemo(() => new Date(), []);
  const dealt = dealMeal !== null;

  const openModal = () => {
    if (dealt) return;
    setModalOpen(true);
  };

  const handleDeal = (meal: Meal) => {
    setDealMeal(meal);
    setModalOpen(false);
  };

  return (
    <div className="app-shell">
      <main className="app-main">
        <DateHeader date={today} />

        {dealt && (
          <section className="deal-banner" aria-live="polite">
            <div className="deal-banner__label">Tonight's dinner</div>
            <div className="deal-banner__meal">
              <span className="deal-banner__emoji" aria-hidden>
                {dealMeal?.emoji ?? "🍽️"}
              </span>
              <span>{dealMeal?.name}</span>
            </div>
          </section>
        )}

        <MealList meals={MEALS} highlightedId={dealMeal?.id ?? null} />
      </main>

      <PickDinnerButton disabled={dealt} onClick={openModal} />

      <PickDinnerModal
        open={modalOpen}
        meals={MEALS}
        onClose={() => setModalOpen(false)}
        onDeal={handleDeal}
      />
    </div>
  );
}
