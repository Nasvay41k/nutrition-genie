import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { Apple, BarChart3, Sparkles, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink 
            to="/" 
            className="flex items-center gap-2 font-semibold text-lg text-foreground hover:text-primary transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Apple className="w-5 h-5 text-primary-foreground" />
            </div>
            NutriTrack
          </NavLink>
          
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Apple className="w-4 h-4" />
                Calendar
              </Button>
            </NavLink>
            <NavLink to="/intake">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                Profile
              </Button>
            </NavLink>
            <NavLink to="/analytics">
              <Button variant="ghost" size="sm" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button>
            </NavLink>
            <NavLink to="/recommendations">
              <Button variant="ghost" size="sm" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Recommendations
              </Button>
            </NavLink>
          </div>
          
          <div className="md:hidden">
            <NavLink to="/intake">
              <Button size="sm" className="bg-gradient-primary">
                Start Here
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
