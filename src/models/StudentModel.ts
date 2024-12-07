/**
 * Course Interface
 *
 * Represents the details of a course offered in the system.
 *
 * @property {string} courseCode - Unique identifier for the course.
 * @property {string} name - Name of the course.
 * @property {string[]} prerequisites - List of prerequisite course codes for the course.
 */

export interface Course {
  courseCode: string;
  name: string;
  prerequisites: string[];
}

/**
 * Term Interface
 *
 * Represents a specific academic term.
 *
 * @property {number} year - The year of the term.
 * @property {string} semester - The semester of the term (e.g., "Spring", "Fall").
 */

export interface Term {
  year: number;
  semester: string;
}

export interface CourseOffer {
  course: Course;
  term: Term;
  instructor: string;
  maxSeats: number;
  currentSeats: number;
}

export interface EnrolledCourse {
  courseOffer: CourseOffer;
  enrollmentStatus: string;
}

/**
 * Student Interface
 *
 * Represents a student in the system, including their profile and enrolled courses.
 *
 * @property {string} id - Unique identifier for the student.
 * @property {string} name - Full name of the student.
 * @property {string} email - Email address of the student.
 * @property {string} department - The department to which the student belongs.
 * @property {EnrolledCourse[]} enrolledCourses - List of courses in which the student is enrolled.
 */

export interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  enrolledCourses: EnrolledCourse[];
}
