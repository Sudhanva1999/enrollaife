import { CourseOffer } from "./CourseModel";

// adding interface for how user model should be
export interface User {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'Student' | 'Faculty' | 'Admin';
  enrolledCourses: {
    courseOffer: CourseOffer;
    enrollmentStatus: 'Enrolled' | 'Completed' | 'In Progress';
  }[];
  coursesTaught: CourseOffer[];
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
  __v: number;
}

