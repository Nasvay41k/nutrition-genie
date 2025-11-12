import { UserProfile, MealEntry } from '@/types/nutrition';

const STORAGE_KEYS = {
  USER_PROFILE: 'nutrition_user_profile',
  MEALS: 'nutrition_meals',
};

export const storage = {
  getUserProfile: (): UserProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  },

  setUserProfile: (profile: UserProfile): void => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  getMeals: (): MealEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MEALS);
    return data ? JSON.parse(data) : [];
  },

  setMeals: (meals: MealEntry[]): void => {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  },

  addMeal: (meal: MealEntry): void => {
    const meals = storage.getMeals();
    meals.push(meal);
    storage.setMeals(meals);
  },

  updateMeal: (id: string, updatedMeal: MealEntry): void => {
    const meals = storage.getMeals();
    const index = meals.findIndex(m => m.id === id);
    if (index !== -1) {
      meals[index] = updatedMeal;
      storage.setMeals(meals);
    }
  },

  deleteMeal: (id: string): void => {
    const meals = storage.getMeals();
    storage.setMeals(meals.filter(m => m.id !== id));
  },

  clearAllData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.MEALS);
  },
};
