# Specification

## Summary
**Goal:** Deliver an MVP “Shikho Computer Class” learning app with a consistent non-blue/purple theme, public course browsing, Internet Identity authentication, and per-user enrollments and lesson progress.

**Planned changes:**
- Create an app-wide visual theme (colors, typography, spacing, component styling) applied consistently across pages.
- Build a public landing page at the default route with app name, brief description, and CTAs for “Browse Courses” and “Sign in”, using provided static generated images.
- Add Internet Identity sign-in/sign-out UI, signed-in vs signed-out states, and sign-in prompts for protected areas.
- Implement backend (single Motoko actor) data models and APIs for course catalog, lessons, enrollments, and per-user completion/progress with stable storage across upgrades.
- Build “Browse Courses” flow: course list with basic text search and course detail pages showing syllabus and enroll action updating without full refresh.
- Build lesson viewer: render lesson content by course+lesson identifier, allow marking completed, and show per-course progress (completed X of Y).
- Build “My Learning” dashboard for signed-in users listing enrolled courses with progress and a “Continue” action to the next incomplete lesson.
- Seed backend with at least 2 beginner computer learning courses (each 5+ lessons) with all user-facing text in English.
- Add and use generated static assets (logo + landing hero illustration) from `frontend/public/assets/generated`.

**User-visible outcome:** Users can land on a branded homepage, sign in with Internet Identity, browse and enroll in beginner courses, read lessons, mark them completed, and track/continue progress from a personal “My Learning” dashboard.
