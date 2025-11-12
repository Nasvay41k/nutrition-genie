import { UserProfile, MealEntry, DailyStats, WeeklyAnalytics, Recommendation } from '@/types/nutrition';
import { format, subDays } from 'date-fns';

export const calculateTargets = (profile: UserProfile): { calories: number; protein: number; carbs: number; fat: number } => {
  // Basic BMR calculation (Mifflin-St Jeor Equation)
  const bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  
  let calories = bmr * 1.5; // Moderate activity level
  
  // Adjust based on goal
  if (profile.goal === 'lose_weight') {
    calories -= 500; // 500 calorie deficit
  } else if (profile.goal === 'gain_muscle') {
    calories += 300; // 300 calorie surplus
  }
  
  // Macros: protein 30%, carbs 40%, fat 30%
  const protein = Math.round((calories * 0.30) / 4); // 4 cal per gram
  const carbs = Math.round((calories * 0.40) / 4);
  const fat = Math.round((calories * 0.30) / 9); // 9 cal per gram
  
  return { calories: Math.round(calories), protein, carbs, fat };
};

export const getDailyStats = (meals: MealEntry[], date: string): DailyStats => {
  const dayMeals = meals.filter(m => m.date === date);
  
  return {
    date,
    totalCalories: dayMeals.reduce((sum, m) => sum + m.calories, 0),
    totalProtein: dayMeals.reduce((sum, m) => sum + m.protein, 0),
    totalCarbs: dayMeals.reduce((sum, m) => sum + m.carbs, 0),
    totalFat: dayMeals.reduce((sum, m) => sum + m.fat, 0),
  };
};

export const getWeeklyAnalytics = (meals: MealEntry[], profile: UserProfile | null): WeeklyAnalytics => {
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => format(subDays(today, 6 - i), 'yyyy-MM-dd'));
  
  const dailyStats = last7Days.map(date => getDailyStats(meals, date));
  
  const averageCalories = dailyStats.reduce((sum, day) => sum + day.totalCalories, 0) / 7;
  const averageProtein = dailyStats.reduce((sum, day) => sum + day.totalProtein, 0) / 7;
  const averageCarbs = dailyStats.reduce((sum, day) => sum + day.totalCarbs, 0) / 7;
  const averageFat = dailyStats.reduce((sum, day) => sum + day.totalFat, 0) / 7;
  
  let trend: 'above' | 'below' | 'on_target' = 'on_target';
  if (profile?.targetCalories) {
    if (averageCalories > profile.targetCalories * 1.1) trend = 'above';
    else if (averageCalories < profile.targetCalories * 0.9) trend = 'below';
  }
  
  return {
    averageCalories: Math.round(averageCalories),
    averageProtein: Math.round(averageProtein),
    averageCarbs: Math.round(averageCarbs),
    averageFat: Math.round(averageFat),
    trend,
    dailyStats,
  };
};

export const generateRecommendations = (
  analytics: WeeklyAnalytics,
  profile: UserProfile | null
): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  if (!profile) return recommendations;
  
  const targets = calculateTargets(profile);
  
  // Calorie recommendations
  if (analytics.averageCalories < targets.calories * 0.85) {
    recommendations.push({
      id: '1',
      title: 'Increase Your Caloric Intake',
      description: `You're consuming ${Math.round(targets.calories - analytics.averageCalories)} fewer calories than your target. Consider adding nutrient-dense snacks like nuts, avocados, or protein shakes.`,
      category: 'nutrition',
      priority: 'high',
    });
  } else if (analytics.averageCalories > targets.calories * 1.15) {
    recommendations.push({
      id: '2',
      title: 'Reduce Caloric Surplus',
      description: `You're consuming ${Math.round(analytics.averageCalories - targets.calories)} more calories than your target. Try smaller portions or replace high-calorie snacks with fruits and vegetables.`,
      category: 'nutrition',
      priority: 'high',
    });
  }
  
  // Protein recommendations
  if (analytics.averageProtein < targets.protein * 0.8) {
    recommendations.push({
      id: '3',
      title: 'Boost Your Protein Intake',
      description: `Aim for ${targets.protein}g of protein daily. Add lean meats, fish, eggs, legumes, or protein powder to your meals, especially at lunch and dinner.`,
      category: 'balance',
      priority: 'high',
    });
  }
  
  // Carbs recommendations
  if (analytics.averageCarbs > targets.carbs * 1.3) {
    recommendations.push({
      id: '4',
      title: 'Balance Your Carbohydrate Intake',
      description: 'Consider reducing refined carbs and sugary foods. Focus on complex carbohydrates like whole grains, vegetables, and legumes for sustained energy.',
      category: 'balance',
      priority: 'medium',
    });
  }
  
  // Meal timing
  recommendations.push({
    id: '5',
    title: 'Optimize Meal Timing',
    description: 'Try to eat at consistent times each day. Include protein with breakfast to stabilize blood sugar and reduce cravings throughout the day.',
    category: 'timing',
    priority: 'medium',
  });
  
  // Hydration
  recommendations.push({
    id: '6',
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water daily. Proper hydration supports metabolism, digestion, and helps control appetite.',
    category: 'hydration',
    priority: 'medium',
  });
  
  return recommendations.slice(0, 5); // Return top 5
};
