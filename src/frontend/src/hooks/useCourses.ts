import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Course } from '../backend';

export function useGetCourse(courseId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Course>({
    queryKey: ['course', courseId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCourse(courseId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBrowseCourses() {
  const { actor, isFetching } = useActor();

  return useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.browseCourses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchCourses(searchText: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Course[]>({
    queryKey: ['courses', 'search', searchText],
    queryFn: async () => {
      if (!actor) return [];
      if (!searchText.trim()) {
        return actor.browseCourses();
      }
      return actor.searchCourses(searchText);
    },
    enabled: !!actor && !isFetching,
  });
}
