import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfile } from '@/types/nutrition';
import { storage } from '@/lib/storage';
import { calculateTargets } from '@/lib/calculations';
import { useToast } from '@/hooks/use-toast';
import { User, Target, Heart } from 'lucide-react';

const Intake = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
    
    toast({
      title: 'Profile Saved!',
      description: 'Your nutrition goals have been calculated and saved.',
    });
    
    navigate('/');
  };

  const handleAllergiesChange = (value: string) => {
    const allergies = value.split(',').map(a => a.trim()).filter(Boolean);
    setProfile({ ...profile, allergies });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Welcome to NutriTrack</h1>
          <p className="text-muted-foreground">
            Let's personalize your nutrition journey. Tell us about yourself to get tailored recommendations.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Fill in your details so we can calculate your personalized nutrition targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                    required
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                    required
                    min="1"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                    required
                    min="1"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Intake;
