export type MealCategory = "rice" | "other";

export interface Meal {
  id: string;
  name: string;
  emojis: string[];
  category: MealCategory;
}
