import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { CourseId, LessonId, UserProgress } from '../backend';

export function useGetCourseProgress(courseId: CourseId) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<{ totalLessons: bigint; completedLessons: bigint } | null>({
    queryKey: ['courseProgress', courseId.toString()],
    queryFn: async () => {
      if (!actor || !isAuthenticated) return null;
      try {
        return await actor.getCourseProgress(courseId);
      } catch (error) {
        // User not enrolled yet
        return null;
      }
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });
}

export function useGetUserProgress() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<UserProgress | null>({
    queryKey: ['userProgress'],
    queryFn: async () => {
      if (!actor || !identity) return null;
      try {
        return await actor.getUserProgress(identity.getPrincipal());
      } catch (error) {
        // User has no progress yet
        return null;
      }
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });
}

export function useCompleteLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, lessonId }: { courseId: CourseId; lessonId: LessonId }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeLesson(courseId, lessonId);
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['courseProgress', courseId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    },
  });
}
