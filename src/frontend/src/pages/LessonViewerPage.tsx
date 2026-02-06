import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetCourse } from '../hooks/useCourses';
import { useCompleteLesson } from '../hooks/useProgress';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Skeleton } from '@/components/ui/skeleton';
import type { Lesson } from '../backend';

export default function LessonViewerPage() {
  const { courseId, lessonId } = useParams({ from: '/courses/$courseId/lessons/$lessonId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: course, isLoading } = useGetCourse(BigInt(courseId));
  const completeMutation = useCompleteLesson();

  const currentLesson = course?.lessons.find((l) => l.id.toString() === lessonId);
  const currentIndex = course?.lessons.findIndex((l) => l.id.toString() === lessonId) ?? -1;
  const nextLesson = course && currentIndex >= 0 && currentIndex < course.lessons.length - 1
    ? course.lessons[currentIndex + 1]
    : null;
  const prevLesson = course && currentIndex > 0 ? course.lessons[currentIndex - 1] : null;

  const handleComplete = async () => {
    if (!isAuthenticated || !currentLesson) return;
    try {
      await completeMutation.mutateAsync({
        courseId: BigInt(courseId),
        lessonId: currentLesson.id,
      });
    } catch (error: any) {
      console.error('Complete lesson error:', error);
    }
  };

  const handleNext = () => {
    if (nextLesson) {
      navigate({ 
        to: '/courses/$courseId/lessons/$lessonId',
        params: { courseId, lessonId: nextLesson.id.toString() }
      });
    }
  };

  const handlePrev = () => {
    if (prevLesson) {
      navigate({ 
        to: '/courses/$courseId/lessons/$lessonId',
        params: { courseId, lessonId: prevLesson.id.toString() }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="container-custom max-w-4xl">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="py-12">
        <div className="container-custom max-w-4xl">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-lg text-muted-foreground">Lesson not found.</p>
              <Link 
                to="/courses/$courseId"
                params={{ courseId }}
              >
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container-custom max-w-4xl">
        <Link 
          to="/courses/$courseId"
          params={{ courseId }}
        >
          <Button variant="ghost" className="mb-8 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Course
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  Lesson {currentIndex + 1} of {course.lessons.length}
                </p>
                <CardTitle className="text-3xl">{currentLesson.title}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {currentLesson.content}
              </p>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={!prevLesson}
                  className="flex-1 sm:flex-none"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNext}
                  disabled={!nextLesson}
                  className="flex-1 sm:flex-none"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              {isAuthenticated && (
                <Button
                  onClick={handleComplete}
                  disabled={completeMutation.isPending}
                  className="gap-2 w-full sm:w-auto"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {completeMutation.isPending ? 'Marking Complete...' : 'Mark as Complete'}
                </Button>
              )}
            </div>

            {!isAuthenticated && (
              <Card className="bg-muted/50">
                <CardContent className="py-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Sign in to track your progress and mark lessons as complete.
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
