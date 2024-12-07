import { CourseOffer } from '../models/CourseModel';
import { SERVER_URL } from './config';

export const getAvailableCourses = async (): Promise<CourseOffer[]> => {
    try {
      const response = await fetch(`${SERVER_URL}/courses`,{credentials:'include'});
      if (!response.ok) {
        throw new Error('Failed to fetch available courses');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  };

export const registerForCourse = async (courseOffer: Partial<CourseOffer>): Promise<void> => {
  const response = await fetch(`${SERVER_URL}/user/enroll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials:'include',
    body: JSON.stringify({ courseOffer }),
  });
  if (!response.ok) {
    throw new Error('Failed to register for course');
  }
};

//add a new course (Admin)
export const addNewCourse = async (courseOffer: CourseOffer): Promise<void> => {
  const response = await fetch(`${SERVER_URL}/courses/newCourse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials:'include',
    body:JSON.stringify (courseOffer) ,
  });
  console.log(response)
  if (!response.ok) {
    throw new Error('Failed to register for course');
  }
};