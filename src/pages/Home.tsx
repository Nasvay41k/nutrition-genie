import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, TrendingUp } from 'lucide-react';
import { storage } from '@/lib/storage';
import { MealEntry } from '@/types/nutrition';
import { getDailyStats } from '@/lib/calculations';
import MealCard from '@/components/meals/MealCard';
import AddMealDialog from '@/components/meals/AddMealDialog';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);

  const userProfile = storage.getUserProfile();
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));

  useEffect(() => {
    setMeals(storage.getMeals());
  }, []);

  const handleAddMeal = (meal: MealEntry) => {
    if (editingMeal) {
      storage.updateMeal(meal.id, meal);
    } else {
      storage.addMeal(meal);
    }
    setMeals(storage.getMeals());
    setEditingMeal(null);
  };

  const handleDeleteMeal = (id: string) => {
    storage.deleteMeal(id);
    setMeals(storage.getMeals());
  };

  const handleEditMeal = (meal: MealEntry) => {
    setEditingMeal(meal);
    setSelectedDate(meal.date);
    setDialogOpen(true);
  };

  const todayMeals = meals.filter(m => m.date === selectedDate);
  const dailyStats = getDailyStats(meals, selectedDate);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Your Nutrition Journey
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your meals, monitor your progress, and achieve your health goals with personalized insights.
          </p>
          {!userProfile && (
            <Button 
              onClick={() => navigate('/intake')}
              className="mt-4 bg-gradient-accent"
              size="lg"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Start Your Journey
            </Button>
          )}
        </div>

        {/* 7-Day Calendar */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>Weekly Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {last7Days.map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const dayStats = getDailyStats(meals, dateStr);
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                        : 'bg-card hover:bg-secondary border-border'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">
                      {format(day, 'EEE')}
                    </div>
                    <div className="text-lg font-bold mb-1">
                      {format(day, 'd')}
                    </div>
                    {isToday && (
                      <div className="text-xs bg-accent text-accent-foreground rounded px-1 py-0.5 mb-1">
                        Today
                      </div>
                    )}
                    <div className="text-xs">
                      {dayStats.totalCalories > 0 ? `${dayStats.totalCalories} cal` : '—'}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Meals for Selected Day */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Meals for {format(new Date(selectedDate), 'MMMM d, yyyy')}</CardTitle>
                <Button
                  onClick={() => {
                    setEditingMeal(null);
                    setDialogOpen(true);
                  }}
                  size="sm"
                  className="bg-gradient-primary"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Meal
                </Button>
              </CardHeader>
              <CardContent>
                {todayMeals.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No meals logged for this day.</p>
                    <p className="text-sm mt-2">Click "Add Meal" to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayMeals.map((meal) => (
                      <MealCard
                        key={meal.id}
                        meal={meal}
                        onEdit={handleEditMeal}
                        onDelete={handleDeleteMeal}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Daily Summary */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Daily Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Total Calories</p>
                  <p className="text-3xl font-bold text-foreground">{dailyStats.totalCalories}</p>
                  {userProfile?.targetCalories && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: {userProfile.targetCalories} cal
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground mb-1">Protein</p>
                    <p className="text-lg font-semibold text-foreground">{dailyStats.totalProtein}g</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                    <p className="text-lg font-semibold text-foreground">{dailyStats.totalCarbs}g</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground mb-1">Fat</p>
                    <p className="text-lg font-semibold text-foreground">{dailyStats.totalFat}g</p>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/analytics')}
                  variant="outline"
                  className="w-full"
                >
                  View Full Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AddMealDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        date={selectedDate}
        onAdd={handleAddMeal}
        editMeal={editingMeal}
      />
    </div>
  );
};

export default Home;
