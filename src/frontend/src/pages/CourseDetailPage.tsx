import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useGetCourse } from '../hooks/useCourses';
import { useEnrollInCourse } from '../hooks/useEnrollment';
import { useGetCourseProgress } from '../hooks/useProgress';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Skeleton } from '@/components/ui/skeleton';

export default function CourseDetailPage() {
  const { courseId } = useParams({ from: '/courses/$courseId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: course, isLoading: courseLoading } = useGetCourse(BigInt(courseId));
  const { data: progress, isLoading: progressLoading } = useGetCourseProgress(BigInt(courseId));
  const enrollMutation = useEnrollInCourse();

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      return;
    }
    try {
      await enrollMutation.mutateAsync(BigInt(courseId));
    } catch (error: any) {
      console.error('Enrollment error:', error);
    }
  };

  const handleStartLesson = (lessonId: bigint) => {
    navigate({ to: `/courses/${courseId}/lessons/${lessonId}` });
  };

  if (courseLoading) {
    return (
      <div className="py-12">
        <div className="container-custom">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-12">
        <div className="container-custom">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-lg text-muted-foreground">Course not found.</p>
              <Link to="/courses">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isEnrolled = progress !== undefined && progress !== null;
  const progressPercent = isEnrolled && progress
    ? progress.totalLessons > 0n
      ? Math.round((Number(progress.completedLessons) / Number(progress.totalLessons)) * 100)
      : 0
    : 0;

  return (
    <div className="py-12">
      <div className="container-custom">
        <Link to="/courses">
          <Button variant="ghost" className="mb-8 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {course.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.lessons.length} lessons</span>
                  </div>
                </div>
                <CardTitle className="text-3xl">{course.title}</CardTitle>
                <CardDescription className="text-base">
                  {course.description}
                </CardDescription>
              </CardHeader>
              {isEnrolled && (
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your Progress</span>
                      <span className="font-medium">
                        {progress.completedLessons.toString()} / {progress.totalLessons.toString()} lessons
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>
                </CardContent>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Syllabus</CardTitle>
                <CardDescription>
                  Complete lessons in order to build your skills progressively.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.lessons.map((lesson, index) => (
                    <div key={lesson.id.toString()}>
                      <button
                        onClick={() => handleStartLesson(lesson.id)}
                        className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-colors text-left group"
                      >
                        <div className="flex-shrink-0">
                          {isEnrolled ? (
                            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Lesson {index + 1}
                            </span>
                          </div>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {lesson.title}
                          </p>
                        </div>
                        <Play className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </button>
                      {index < course.lessons.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isAuthenticated ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Sign in to enroll in this course and track your progress.
                    </p>
                    <Link to="/">
                      <Button className="w-full">Sign In to Enroll</Button>
                    </Link>
                  </>
                ) : isEnrolled ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      You're enrolled! Continue learning at your own pace.
                    </p>
                    <Button
                      className="w-full gap-2"
                      onClick={() => handleStartLesson(course.lessons[0].id)}
                    >
                      <Play className="h-4 w-4" />
                      Continue Learning
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Enroll now to start learning and track your progress.
                    </p>
                    <Button
                      className="w-full"
                      onClick={handleEnroll}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  </>
                )}

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{course.lessons.length} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {course.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
