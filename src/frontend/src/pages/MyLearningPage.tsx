import { Link } from '@tanstack/react-router';
import { BookOpen, Play, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useMyLearning } from '../hooks/useMyLearning';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyLearningPage() {
  const { enrolledCoursesWithProgress, isLoading } = useMyLearning();

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="container-custom">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="mb-12">
          <h1 className="font-display font-bold mb-4">My Learning</h1>
          <p className="text-lg text-muted-foreground">
            Track your progress and continue where you left off.
          </p>
        </div>

        {enrolledCoursesWithProgress.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                You haven't enrolled in any courses yet.
              </p>
              <Link to="/courses">
                <Button>Browse Courses</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {enrolledCoursesWithProgress.map(({ course, progress, nextLesson }) => {
              const progressPercent =
                progress.totalLessons > 0n
                  ? Math.round((Number(progress.completedLessons) / Number(progress.totalLessons)) * 100)
                  : 0;
              const isCompleted = progress.completedLessons === progress.totalLessons;

              return (
                <Card key={course.id.toString()} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="capitalize">
                        {course.difficulty}
                      </Badge>
                      {isCompleted && (
                        <Badge variant="default" className="gap-1">
                          <Award className="h-3 w-3" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {progress.completedLessons.toString()} / {progress.totalLessons.toString()} lessons
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                      <Link 
                        to="/courses/$courseId"
                        params={{ courseId: course.id.toString() }}
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full gap-2">
                          <BookOpen className="h-4 w-4" />
                          View Course
                        </Button>
                      </Link>
                      {nextLesson && (
                        <Link
                          to="/courses/$courseId/lessons/$lessonId"
                          params={{ 
                            courseId: course.id.toString(),
                            lessonId: nextLesson.id.toString()
                          }}
                          className="flex-1"
                        >
                          <Button className="w-full gap-2">
                            <Play className="h-4 w-4" />
                            Continue
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
