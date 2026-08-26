import type { Meal } from "../types";

interface MealListProps {
  meals: Meal[];
  highlightedId: string | null;
}

export default function MealList({ meals, highlightedId }: MealListProps) {
  return (
    <section className="meal-list" aria-label="Meal list">
      <div className="meal-list__header">
        <h2>Meals</h2>
        <span className="meal-list__count">{meals.length} items</span>
      </div>

      <ul className="meal-list__items">
        {meals.map((meal) => {
          const active = meal.id === highlightedId;
          return (
            <li
              key={meal.id}
              className={`meal-card${active ? " meal-card--active" : ""}`}
            >
              <span className="meal-card__name">{meal.name}</span>
              <span className="meal-card__emojis" aria-hidden>
                {meal.emojis.map((e, i) => (
                  <span key={i} className="meal-card__emoji">
                    {e}
                  </span>
                ))}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
