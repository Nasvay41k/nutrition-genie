export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  allergies: string[];
  goal: 'lose_weight' | 'gain_muscle' | 'maintain';
  dietaryPreference: string;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
}

export interface MealEntry {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string;
}

export interface DailyStats {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface WeeklyAnalytics {
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  trend: 'above' | 'below' | 'on_target';
  dailyStats: DailyStats[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'balance' | 'timing' | 'hydration';
  priority: 'high' | 'medium' | 'low';
}
