import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type CourseId = bigint;
export interface Lesson {
    id: LessonId;
    title: string;
    content: string;
}
export interface UserProgress {
    completedLessons: Array<[CourseId, Array<LessonId>]>;
    enrolledCourses: Array<CourseId>;
}
export type LessonId = bigint;
export interface Course {
    id: CourseId;
    title: string;
    difficulty: Variant_intermediate_beginner_advanced;
    description: string;
    lessons: Array<Lesson>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_intermediate_beginner_advanced {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced"
}
export interface backendInterface {
    adminAddCourse(title: string, description: string, difficulty: Variant_intermediate_beginner_advanced): Promise<CourseId>;
    adminAddLesson(courseId: CourseId, title: string, content: string): Promise<LessonId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    browseCourses(): Promise<Array<Course>>;
    completeLesson(courseId: CourseId, lessonId: LessonId): Promise<void>;
    enrollInCourse(courseId: CourseId): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getCourse(courseId: CourseId): Promise<Course>;
    getCourseProgress(courseId: CourseId): Promise<{
        totalLessons: bigint;
        completedLessons: bigint;
    }>;
    getUserProgress(user: Principal): Promise<UserProgress>;
    init(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    searchCourses(searchText: string): Promise<Array<Course>>;
}
