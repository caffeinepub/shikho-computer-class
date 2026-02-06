import { Link } from '@tanstack/react-router';
import { BookOpen, GraduationCap, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function LandingPage() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="font-display font-bold tracking-tight">
                  Learn Computer Skills at Your Own Pace
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl">
                  Master essential computer skills with our beginner-friendly courses. 
                  From basic concepts to practical applications, we'll guide you every step of the way.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/courses">
                  <Button size="lg" className="gap-2 text-base">
                    <BookOpen className="h-5 w-5" />
                    Browse Courses
                  </Button>
                </Link>
                
                {!isAuthenticated && (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="gap-2 text-base"
                    onClick={login}
                  >
                    <GraduationCap className="h-5 w-5" />
                    Sign In
                  </Button>
                )}
                
                {isAuthenticated && (
                  <Link to="/my-learning">
                    <Button size="lg" variant="outline" className="gap-2 text-base">
                      <GraduationCap className="h-5 w-5" />
                      My Learning
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="relative">
              <img
                src="/assets/generated/shikho-hero.dim_1600x900.png"
                alt="Student learning on computer"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold mb-4">Why Choose Shikho?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform is designed to make learning computer skills accessible and enjoyable for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Beginner Friendly</CardTitle>
                <CardDescription>
                  Start from the basics with clear, easy-to-follow lessons designed for absolute beginners.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Learn at Your Pace</CardTitle>
                <CardDescription>
                  No deadlines or pressure. Take your time and learn when it's convenient for you.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  Monitor your learning journey and celebrate your achievements as you complete lessons.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-custom">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="font-display font-bold mb-4">Ready to Start Learning?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of learners building their computer skills. Start your journey today!
              </p>
              <Link to="/courses">
                <Button size="lg" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  Explore Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
