import { CourseOffer } from '../models/CourseModel';

// Define the User interface
export interface User {
    email: string;
    firstName: string;
    lastName: string;
    role: 'Student' | 'Faculty' | 'Admin';
    enrolledCourses: {
      courseOffer: CourseOffer;
      enrollmentStatus: 'Enrolled' | 'Completed' | 'In Progress';
    }[];
    coursesTaught: CourseOffer[];    
  }
  
 // Define the AppState interface
  export interface AppState {
    userProfile: User | null; 
  }  

  // Define the action types
  export const SET_USER_PROFILE = 'SET_USER_PROFILE';
  export const SET_COURSES = 'SET_COURSES';
  

  // Define the action interfaces
  interface SetUserProfileAction {
    type: typeof SET_USER_PROFILE;
    payload: User;
  }  

  // Define the action interfaces
  interface SetCoursesAction {
    type: typeof SET_COURSES;
    payload: CourseOffer[];
  }

  // Define the action types
  export type UserActionTypes = SetUserProfileAction;
  export type CourseActionTypes = SetCoursesAction;
  