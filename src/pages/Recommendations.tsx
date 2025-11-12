import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/storage';
import { getWeeklyAnalytics, generateRecommendations } from '@/lib/calculations';
import { Sparkles, Droplets, Clock, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const userProfile = storage.getUserProfile();

  useEffect(() => {
    const meals = storage.getMeals();
    const analytics = getWeeklyAnalytics(meals, userProfile);
    const recs = generateRecommendations(analytics, userProfile);
    setRecommendations(recs);
  }, [userProfile]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition':
        return <Scale className="w-5 h-5" />;
      case 'balance':
        return <Sparkles className="w-5 h-5" />;
      case 'timing':
        return <Clock className="w-5 h-5" />;
      case 'hydration':
        return <Droplets className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-accent/10 text-accent-foreground border-accent/20';
      case 'low':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-4 shadow-lg">
          <CardHeader>
            <CardTitle>Complete Your Profile First</CardTitle>
            <CardDescription>
              We need your profile information to generate personalized recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate('/intake')}
              className="w-full bg-gradient-primary"
            >
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Your Personalized Recommendations</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Based on your 7-day nutrition data and health goals, here are actionable insights from our nutrition experts.
          </p>
        </div>

        {recommendations.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No recommendations yet. Start logging your meals to get personalized insights!
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-gradient-primary"
              >
                Start Logging Meals
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Card
                key={rec.id}
                className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-primary"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                        {getCategoryIcon(rec.category)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{rec.title}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {rec.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/analytics')}
            variant="outline"
            size="lg"
          >
            View Analytics
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-primary"
            size="lg"
          >
            Track More Meals
          </Button>
        </div>

        {/* Additional Tips */}
        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Log your meals consistently for more accurate recommendations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Focus on one recommendation at a time for sustainable change</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Review your progress weekly to track improvements</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Adjust your profile as your goals or body changes</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Recommendations;
