import type { Meal, MealCategory } from "../types";

interface MealListProps {
  meals: Meal[];
  excludedIds: Set<string>;
  onToggle: (id: string) => void;
  category: MealCategory;
  onChangeCategory: (c: MealCategory) => void;
  homeCount: number;
  eatOutCount: number;
}

export default function MealList({
  meals,
  excludedIds,
  onToggle,
  category,
  onChangeCategory,
  homeCount,
  eatOutCount,
}: MealListProps) {
  return (
    <section className="meal-list" aria-label="Meal list">
      <div className="meal-list__header">
        <h2>Meals</h2>

        <div
          className="meal-list__tabs"
          role="tablist"
          aria-label="Meal category"
        >
          <button
            type="button"
            role="tab"
            aria-selected={category === "home"}
            className={`meal-tab${category === "home" ? " meal-tab--active" : ""}`}
            onClick={() => onChangeCategory("home")}
          >
            <span className="meal-tab__label">Home</span>
            <span className="meal-tab__count">{homeCount}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={category === "eat-out"}
            className={`meal-tab${category === "eat-out" ? " meal-tab--active" : ""}`}
            onClick={() => onChangeCategory("eat-out")}
          >
            <span className="meal-tab__label">Eat out</span>
            <span className="meal-tab__count">{eatOutCount}</span>
          </button>
        </div>
      </div>

      <ul className="meal-list__items">
        {meals.map((meal) => {
          const excluded = excludedIds.has(meal.id);
          return (
            <li key={meal.id} className="meal-card-wrap">
              <button
                type="button"
                className={`meal-card${excluded ? " meal-card--excluded" : ""}`}
                onClick={() => onToggle(meal.id)}
                aria-pressed={excluded}
                aria-label={
                  excluded
                    ? `Bỏ loại: ${meal.name}`
                    : `Loại khỏi random: ${meal.name}`
                }
              >
                <span className="meal-card__name">{meal.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
