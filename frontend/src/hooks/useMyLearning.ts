import { useMemo } from 'react';
import { useGetUserProgress } from './useProgress';
import { useBrowseCourses } from './useCourses';
import { useGetCourseProgress } from './useProgress';
import type { Course, Lesson } from '../backend';

interface EnrolledCourseWithProgress {
  course: Course;
  progress: { totalLessons: bigint; completedLessons: bigint };
  nextLesson: Lesson | null;
}

export function useMyLearning() {
  const { data: userProgress, isLoading: progressLoading } = useGetUserProgress();
  const { data: allCourses, isLoading: coursesLoading } = useBrowseCourses();

  const enrolledCourseIds = userProgress?.enrolledCourses || [];

  const enrolledCourses = useMemo(() => {
    if (!allCourses || !enrolledCourseIds.length) return [];
    return allCourses.filter((course) =>
      enrolledCourseIds.some((id) => id.toString() === course.id.toString())
    );
  }, [allCourses, enrolledCourseIds]);

  // Get progress for each enrolled course
  const enrolledCoursesWithProgress: EnrolledCourseWithProgress[] = useMemo(() => {
    if (!enrolledCourses.length || !userProgress) return [];

    return enrolledCourses
      .map((course) => {
        // Find completed lessons for this course
        const completedLessonsForCourse =
          userProgress.completedLessons.find(([cId]) => cId.toString() === course.id.toString())?.[1] || [];

        const totalLessons = BigInt(course.lessons.length);
        const completedLessons = BigInt(completedLessonsForCourse.length);

        // Find next incomplete lesson
        const nextLesson =
          course.lessons.find(
            (lesson) => !completedLessonsForCourse.some((cId) => cId.toString() === lesson.id.toString())
          ) || null;

        return {
          course,
          progress: { totalLessons, completedLessons },
          nextLesson,
        };
      })
      .sort((a, b) => {
        // Sort by progress (incomplete first)
        const aComplete = a.progress.completedLessons === a.progress.totalLessons;
        const bComplete = b.progress.completedLessons === b.progress.totalLessons;
        if (aComplete !== bComplete) return aComplete ? 1 : -1;
        return 0;
      });
  }, [enrolledCourses, userProgress]);

  return {
    enrolledCoursesWithProgress,
    isLoading: progressLoading || coursesLoading,
  };
}
