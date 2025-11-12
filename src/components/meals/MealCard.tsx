import { MealEntry } from '@/types/nutrition';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2 } from 'lucide-react';

interface MealCardProps {
  meal: MealEntry;
  onEdit?: (meal: MealEntry) => void;
  onDelete?: (id: string) => void;
}

const MealCard = ({ meal, onEdit, onDelete }: MealCardProps) => {
  const mealTypeColors = {
    breakfast: 'bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20',
    lunch: 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20',
    dinner: 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20',
    snack: 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20',
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-1 ${mealTypeColors[meal.mealType]}`} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {meal.mealType}
            </p>
            <h3 className="font-semibold text-foreground">{meal.name}</h3>
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(meal)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(meal.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Calories</p>
            <p className="font-semibold text-foreground">{meal.calories}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Protein</p>
            <p className="font-semibold text-foreground">{meal.protein}g</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Carbs</p>
            <p className="font-semibold text-foreground">{meal.carbs}g</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fat</p>
            <p className="font-semibold text-foreground">{meal.fat}g</p>
          </div>
        </div>
        
        {meal.notes && (
          <p className="mt-3 text-sm text-muted-foreground border-t pt-2">
            {meal.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MealCard;
