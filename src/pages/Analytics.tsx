import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { storage } from '@/lib/storage';
import { getWeeklyAnalytics } from '@/lib/calculations';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(getWeeklyAnalytics([], null));
  const userProfile = storage.getUserProfile();

  useEffect(() => {
    const meals = storage.getMeals();
    setAnalytics(getWeeklyAnalytics(meals, userProfile));
  }, [userProfile]);

  const chartData = analytics.dailyStats.map(day => ({
    date: format(parseISO(day.date), 'MMM d'),
    calories: day.totalCalories,
    protein: day.totalProtein,
    carbs: day.totalCarbs,
    fat: day.totalFat,
  }));

  const macroData = [
    { name: 'Protein', value: analytics.averageProtein, color: 'hsl(142 71% 45%)' },
    { name: 'Carbs', value: analytics.averageCarbs, color: 'hsl(32 95% 58%)' },
    { name: 'Fat', value: analytics.averageFat, color: 'hsl(210 17% 60%)' },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Your Progress & Insights</h1>
          <p className="text-muted-foreground">
            Track your nutrition trends and understand your eating patterns over the past 7 days.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Daily Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-foreground">{analytics.averageCalories}</p>
                {userProfile?.targetCalories && (
                  <div className="flex items-center gap-1 text-sm">
                    {analytics.trend === 'above' ? (
                      <TrendingUp className="w-4 h-4 text-destructive" />
                    ) : analytics.trend === 'below' ? (
                      <TrendingDown className="w-4 h-4 text-accent" />
                    ) : (
                      <Target className="w-4 h-4 text-primary" />
                    )}
                  </div>
                )}
              </div>
              {userProfile?.targetCalories && (
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {userProfile.targetCalories} cal
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Protein
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{analytics.averageProtein}g</p>
              {userProfile?.targetProtein && (
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {userProfile.targetProtein}g
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Carbs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{analytics.averageCarbs}g</p>
              {userProfile?.targetCarbs && (
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {userProfile.targetCarbs}g
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Fat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{analytics.averageFat}g</p>
              {userProfile?.targetFat && (
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {userProfile.targetFat}g
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Daily Calorie Intake</CardTitle>
              <CardDescription>Your calorie consumption over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="hsl(142 71% 45%)"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(142 71% 45%)', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Macronutrient Breakdown</CardTitle>
              <CardDescription>Average daily macros in grams</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={macroData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(142 71% 45%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Daily Stats */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Weekly Breakdown</CardTitle>
            <CardDescription>Detailed nutrition data for each day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Calories</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Protein (g)</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Carbs (g)</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Fat (g)</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.dailyStats.map((day) => (
                    <tr key={day.date} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{format(parseISO(day.date), 'MMM d, yyyy')}</td>
                      <td className="text-right py-3 px-4">{day.totalCalories}</td>
                      <td className="text-right py-3 px-4">{day.totalProtein}</td>
                      <td className="text-right py-3 px-4">{day.totalCarbs}</td>
                      <td className="text-right py-3 px-4">{day.totalFat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate('/recommendations')}
            className="bg-gradient-accent"
            size="lg"
          >
            Get Personalized Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
