export type MealCategory = "home" | "eat-out";

export interface Meal {
  id: string;
  name: string;
  emojis: string[];
  category: MealCategory;
}
