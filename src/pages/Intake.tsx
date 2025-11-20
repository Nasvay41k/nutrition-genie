import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfile } from '@/types/nutrition';
import { storage } from '@/lib/storage';
import { calculateTargets, getAnalyticsByPeriod } from '@/lib/calculations';
import { useToast } from '@/hooks/use-toast';
import { User, Target, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const Intake = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    age: 25,
    weight: 70,
    height: 170,
    allergies: [],
    goal: 'maintain',
    dietaryPreference: 'none',
  });

  useEffect(() => {
    const existingProfile = storage.getUserProfile();
    if (existingProfile) {
      setProfile(existingProfile);
      setShowForm(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const targets = calculateTargets(profile);
    const updatedProfile: UserProfile = {
      ...profile,
      targetCalories: targets.calories,
      targetProtein: targets.protein,
      targetCarbs: targets.carbs,
      targetFat: targets.fat,
    };
    
    storage.setUserProfile(updatedProfile);
    
    setShowForm(false);
    
    toast({
      title: 'Profile Saved!',
      description: 'Your nutrition goals have been calculated and saved.',
    });
  };

  const handleAllergiesChange = (value: string) => {
    const allergies = value.split(',').map(a => a.trim()).filter(Boolean);
    setProfile({ ...profile, allergies });
  };

  const meals = storage.getMeals();
  const analytics1Month = getAnalyticsByPeriod(meals, profile, '1month');
  const analytics6Months = getAnalyticsByPeriod(meals, profile, '6months');

  const caloriesData = analytics1Month.dailyStats
    .filter(day => day.totalCalories > 0)
    .map(day => ({
      date: format(parseISO(day.date), 'MMM d'),
      value: day.totalCalories,
    }));

  const proteinData = analytics6Months.dailyStats
    .filter(day => day.totalProtein > 0)
    .map(day => ({
      date: format(parseISO(day.date), 'MMM yyyy'),
      value: day.totalProtein,
    }));

  const carbsData = analytics6Months.dailyStats
    .filter(day => day.totalCarbs > 0)
    .map(day => ({
      date: format(parseISO(day.date), 'MMM yyyy'),
      value: day.totalCarbs,
    }));

  const fatData = analytics6Months.dailyStats
    .filter(day => day.totalFat > 0)
    .map(day => ({
      date: format(parseISO(day.date), 'MMM yyyy'),
      value: day.totalFat,
    }));

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Your Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile and view your nutrition journey over time
          </p>
        </div>

        <Card className="shadow-lg mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  {showForm ? 'Fill in your details so we can calculate your personalized nutrition targets' : 'Your profile information'}
                </CardDescription>
              </div>
              {!showForm && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                  {showForm ? 'Hide' : 'Edit Profile'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!showForm && (
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Age</p>
                  <p className="font-medium">{profile.age} years</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Weight</p>
                  <p className="font-medium">{profile.weight} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Height</p>
                  <p className="font-medium">{profile.height} cm</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Goal</p>
                  <p className="font-medium">{profile.goal.replace('_', ' ')}</p>
                </div>
              </div>
            )}
            
            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profile.age || ''}
                      onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                      required
                      min="1"
                      max="120"
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={profile.weight || ''}
                      onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                      required
                      min="1"
                      step="0.1"
                      placeholder="70"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={profile.height || ''}
                      onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                      required
                      min="1"
                      placeholder="170"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="goal" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Primary Goal
                  </Label>
                  <Select
                    value={profile.goal}
                    onValueChange={(value) => setProfile({ ...profile, goal: value as UserProfile['goal'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose_weight">Lose Weight</SelectItem>
                      <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                      <SelectItem value="maintain">Maintain Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dietaryPreference" className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Dietary Preference
                  </Label>
                  <Select
                    value={profile.dietaryPreference}
                    onValueChange={(value) => setProfile({ ...profile, dietaryPreference: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Restriction</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="keto">Keto</SelectItem>
                      <SelectItem value="paleo">Paleo</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="allergies">Food Allergies (Optional)</Label>
                  <Input
                    id="allergies"
                    placeholder="e.g., Peanuts, Shellfish, Dairy (comma separated)"
                    value={profile.allergies.join(', ')}
                    onChange={(e) => handleAllergiesChange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate multiple allergies with commas
                  </p>
                </div>

                <Button type="submit" className="w-full bg-gradient-primary" size="lg">
                  Save Profile & Calculate Targets
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Historical Statistics */}
        {!showForm && meals.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Historical Statistics</h2>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Calorie Intake Over Time</CardTitle>
                <CardDescription>Daily calories for the last month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={caloriesData}>
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
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Protein Intake</CardTitle>
                  <CardDescription>Last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={proteinData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--foreground))" fontSize={10} />
                      <YAxis stroke="hsl(var(--foreground))" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Carbs Intake</CardTitle>
                  <CardDescription>Last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={carbsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--foreground))" fontSize={10} />
                      <YAxis stroke="hsl(var(--foreground))" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Fat Intake</CardTitle>
                  <CardDescription>Last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={fatData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--foreground))" fontSize={10} />
                      <YAxis stroke="hsl(var(--foreground))" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--muted-foreground))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Intake;
