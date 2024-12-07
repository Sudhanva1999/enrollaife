import { CourseOffer } from '../models/CourseModel';
import { User } from '../models/UserModel';
import { SERVER_URL } from './config';

// functionality to get the faculty details
export const getFacultyData = async (): Promise<User> => {
  const response = await fetch(`${SERVER_URL}/user/profile`,{ credentials:'include'});
  if (!response.ok) {
    throw new Error('Failed to fetch faculty data');
  }
  return response.json();
};
import axios from 'axios';


// function to update the faculty profile data
export const updateFacultyData = async (
  updatedData: Partial<User>
): Promise<void> => {
  try {
    await axios.put(`${SERVER_URL}/user/profile`, updatedData, { withCredentials: true });
  } catch (error) {
    console.error('Error updating student data:', error);
    throw new Error('Unable to update student data.');
  }
};

// function to edit course details being faculty
export const editCourse = async (courseOfferId: string, updateData: Partial<CourseOffer>) => {
    try {
      const response = await fetch(`${SERVER_URL}/user/coursesTaught/${courseOfferId}/edit`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        throw new Error('Failed to update course details');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error updating course details:', error);
      throw error;
    }
  };