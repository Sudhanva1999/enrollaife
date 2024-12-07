import axios from 'axios';
import { User } from '../models/UserModel';
import { SERVER_URL } from './config';

/**
 * @returns A Promise that resolves to the student data.
 */
export const getStudentData = async (): Promise<User> => {
  try {
    const response = await axios.get<User>(`${SERVER_URL}/user/profile`,{withCredentials: true});
    return response.data;
  } catch (error) {
    console.error('Error fetching student data:', error);
    throw new Error('Unable to fetch student data.');
  }
};

/**
 * @param updatedData - The partial student data to update.
 * @returns A Promise that resolves when the update is complete.
 */
export const updateStudentData = async (
  updatedData: Partial<User>
): Promise<void> => {
  try {
    await axios.put(`${SERVER_URL}/user/profile`, updatedData, { withCredentials: true });
  } catch (error) {
    console.error('Error updating student data:', error);
    throw new Error('Unable to update student data.');
  }
};

export const uploadProfileImage = async (file: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('profileImage', file);

    await axios.put(`${SERVER_URL}/user/profile/image`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw new Error('Unable to upload profile image.');
  }
};
