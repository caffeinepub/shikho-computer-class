import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import CourseListPage from './pages/CourseListPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonViewerPage from './pages/LessonViewerPage';
import MyLearningPage from './pages/MyLearningPage';
import RequireAuth from './components/auth/RequireAuth';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const coursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses',
  component: CourseListPage,
});

const courseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses/$courseId',
  component: CourseDetailPage,
});

const lessonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses/$courseId/lessons/$lessonId',
  component: LessonViewerPage,
});

const myLearningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-learning',
  component: () => (
    <RequireAuth>
      <MyLearningPage />
    </RequireAuth>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  coursesRoute,
  courseDetailRoute,
  lessonRoute,
  myLearningRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
