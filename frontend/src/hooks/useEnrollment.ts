import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CourseId } from '../backend';

export function useEnrollInCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: CourseId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.enrollInCourse(courseId);
    },
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: ['courseProgress', courseId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    },
  });
}
