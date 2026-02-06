import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  type CourseId = Nat;
  type LessonId = Nat;

  public type Lesson = {
    id : LessonId;
    title : Text;
    content : Text; // Could be markdown or plain text
  };

  public type Course = {
    id : CourseId;
    title : Text;
    description : Text;
    lessons : [Lesson];
    difficulty : {
      #beginner;
      #intermediate;
      #advanced;
    };
  };

  public type UserProgress = {
    enrolledCourses : [CourseId];
    completedLessons : [(CourseId, [LessonId])];
  };

  // State
  var nextCourseId = 3;
  var nextLessonId = 11;

  let courses = Map.empty<CourseId, Course>();
  let userProgress = Map.empty<Principal, { var enrolledCourses : List.List<CourseId>; completedLessons : Map.Map<CourseId, List.List<LessonId>> }>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Function to add lessons to a course
  func addLesson(lesson : Lesson, courseId : CourseId) {
    let course = courses.get(courseId);
    switch (course) {
      case (null) { Runtime.trap("No course found with id " # courseId.toText()) };
      case (?course) {
        let newCourse = { course with
          lessons = course.lessons.concat([lesson]);
        };
        courses.add(courseId, newCourse);
      };
    };
  };

  // Seed with sample courses and lessons
  public shared ({ caller }) func init() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can initialize data");
    };

    let course1 : Course = {
      id = 1;
      title = "Intro to Computers";
      description = "Basic concepts of computing";
      lessons = [];
      difficulty = #beginner;
    };
    courses.add(1, course1);

    let course2 : Course = {
      id = 2;
      title = "Microsoft Word Basics";
      description = "Learn the fundamentals of Word";
      lessons = [];
      difficulty = #beginner;
    };
    courses.add(2, course2);

    // Add lessons for courses
    let lesson1 : Lesson = {
      id = 1;
      title = "What is a Computer?";
      content = "A computer is a device that processes information.";
    };
    addLesson(lesson1, 1);

    let lesson2 : Lesson = {
      id = 2;
      title = "Turning On Your Computer";
      content = "To start using your computer, you need to turn it on.";
    };
    addLesson(lesson2, 1);

    let lesson3 : Lesson = {
      id = 3;
      title = "What is Word?";
      content = "Word is a word processing program for creating documents.";
    };
    addLesson(lesson3, 2);
  };

  // Public API
  public query ({ caller }) func browseCourses() : async [Course] {
    courses.values().toArray(); // Return all courses as an array
  };

  public query ({ caller }) func getCourse(courseId : CourseId) : async Course {
    switch (courses.get(courseId)) {
      case (null) { Runtime.trap("No course found with id " # courseId.toText()) };
      case (?course) { course };
    };
  };

  public shared ({ caller }) func enrollInCourse(courseId : CourseId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can enroll in courses");
    };

    switch (courses.get(courseId)) {
      case (null) { Runtime.trap("No course found with id " # courseId.toText()) };
      case (?_) {
        let progress = switch (userProgress.get(caller)) {
          case (null) {
            {
              var enrolledCourses = List.empty<CourseId>();
              completedLessons = Map.empty<CourseId, List.List<LessonId>>();
            };
          };
          case (?existing) {
            if (existing.enrolledCourses.toArray().find(func(id) { id == courseId }) != null) {
              Runtime.trap("Already enrolled in this course");
            };
            {
              var enrolledCourses = List.empty<CourseId>();
              completedLessons = existing.completedLessons;
            };
          };
        };
        progress.enrolledCourses.add(courseId);
        userProgress.add(caller, progress);
      };
    };
  };

  public shared ({ caller }) func completeLesson(courseId : CourseId, lessonId : LessonId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete lessons");
    };

    let progress = switch (userProgress.get(caller)) {
      case (null) { Runtime.trap("Not enrolled in this course") };
      case (?existing) {
        let newCompleted = existing.completedLessons.clone();
        let completedLessons = switch (newCompleted.get(courseId)) {
          case (null) { List.empty<LessonId>() };
          case (?existingLessons) {
            if (existingLessons.toArray().find(func(id) { id == lessonId }) != null) {
              return (); // Already completed
            };
            existingLessons.clone();
          };
        };
        completedLessons.add(lessonId);
        newCompleted.add(courseId, completedLessons);
        existing;
      };
    };
    userProgress.add(caller, progress);
  };

  public query ({ caller }) func getCourseProgress(courseId : CourseId) : async {
    totalLessons : Nat;
    completedLessons : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view progress");
    };

    switch (userProgress.get(caller)) {
      case (null) { Runtime.trap("Not enrolled in this course") };
      case (?existing) {
        switch (courses.get(courseId)) {
          case (null) { Runtime.trap("No course found with id " # courseId.toText()) };
          case (?course) {
            let completed = switch (existing.completedLessons.get(courseId)) {
              case (null) { 0 };
              case (?lessons) { lessons.size() };
            };
            {
              totalLessons = course.lessons.size();
              completedLessons = completed;
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func searchCourses(searchText : Text) : async [Course] {
    courses.values().toArray().filter(
      func(course) {
        course.title.contains(#text searchText) or course.description.contains(#text searchText);
      }
    );
  };

  // Authorization/Authentication
  public query ({ caller }) func getUserProgress(user : Principal) : async UserProgress {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own progress");
    };

    switch (userProgress.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?progress) {
        {
          enrolledCourses = progress.enrolledCourses.toArray();
          completedLessons = progress.completedLessons.toArray().map(
            func((courseId, completedList)) {
              (
                courseId,
                completedList.toArray(),
              );
            }
          );
        };
      };
    };
  };

  public shared ({ caller }) func adminAddCourse(title : Text, description : Text, difficulty : {
    #beginner;
    #intermediate;
    #advanced;
  }) : async CourseId {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add courses");
    };

    let courseId = nextCourseId;
    let course : Course = {
      id = courseId;
      title;
      description;
      lessons = [];
      difficulty;
    };
    courses.add(courseId, course);
    nextCourseId += 1;
    courseId;
  };

  public shared ({ caller }) func adminAddLesson(courseId : CourseId, title : Text, content : Text) : async LessonId {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add lessons");
    };

    let lesson : Lesson = {
      id = nextLessonId;
      title;
      content;
    };
    addLesson(lesson, courseId);
    nextLessonId += 1;
    lesson.id;
  };
};
