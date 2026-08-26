import type { Meal } from '../types';

interface MealListProps {
  meals: Meal[];
  highlightedId: string | null;
}

export default function MealList({ meals, highlightedId }: MealListProps) {
  return (
    <section className="meal-list" aria-label="Danh sách món ăn">
      <div className="meal-list__header">
        <h2>Danh sách món</h2>
        <span className="meal-list__count">{meals.length} món</span>
      </div>

      <ul className="meal-list__items">
        {meals.map((meal) => {
          const active = meal.id === highlightedId;
          return (
            <li
              key={meal.id}
              className={`meal-card${active ? ' meal-card--active' : ''}`}
            >
              <span className="meal-card__emoji" aria-hidden>
                {meal.emoji ?? '🍽️'}
              </span>
              <span className="meal-card__name">{meal.name}</span>
              {active && (
                <span className="meal-card__badge" aria-label="Đã chọn">
                  ✓
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
