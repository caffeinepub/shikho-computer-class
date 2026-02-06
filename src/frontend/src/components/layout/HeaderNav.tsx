import { Link, useNavigate } from '@tanstack/react-router';
import { BookOpen, GraduationCap } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import AuthButton from '../auth/AuthButton';

export default function HeaderNav() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img 
                src="/assets/generated/shikho-logo.dim_512x512.png" 
                alt="Shikho" 
                className="h-10 w-10 rounded-lg"
              />
              <span className="font-display font-bold text-xl hidden sm:inline">
                Shikho Computer Class
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/courses"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Browse Courses
              </Link>
              
              {isAuthenticated && (
                <Link
                  to="/my-learning"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <GraduationCap className="h-4 w-4" />
                  My Learning
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
