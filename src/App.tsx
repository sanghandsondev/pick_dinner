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
    <div className={`app-shell${dealt ? " app-shell--dealt" : ""}`}>
      {dealt ? (
        <section className="deal-hero" aria-live="polite">
          <div className="deal-hero__label">Tonight's dinner</div>
          <div className="deal-hero__name">{dealMeal?.name}</div>
          <div className="deal-hero__emojis" aria-hidden>
            {dealMeal?.emojis.map((e, i) => (
              <span key={i}>{e}</span>
            ))}
          </div>
        </section>
      ) : (
        <>
          <main className="app-main">
            <DateHeader date={today} />
            <MealList meals={MEALS} highlightedId={null} />
          </main>
          <PickDinnerButton disabled={false} onClick={openModal} />
        </>
      )}

      <PickDinnerModal
        open={modalOpen}
        meals={MEALS}
        onClose={() => setModalOpen(false)}
        onDeal={handleDeal}
      />
    </div>
  );
}
