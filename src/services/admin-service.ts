import axios from 'axios';
import { User } from '../models/UserModel';
import { SERVER_URL } from './config';

const API_URL = `${SERVER_URL}/admin`; // Base API URL

// Fetch user by ID
export const getUserById = async (): Promise<User> => {
  try {
    const response = await axios.get<User>(`${API_URL}/profile`,{withCredentials: true});
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

// Fetch all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(`${API_URL}/getAllUsers`,{withCredentials: true}); // Adjust endpoint to your API's users route
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};


// Update user profile
export const updateUserProfile = async (updatedUser: User): Promise<User> => {
  try {
    const response = await axios.put<User>(`${API_URL}/updateProfile`, updatedUser,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};



export const deleteUserById = async (userId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/deleteUser`, {
      params: { userId },
      withCredentials: true,
    });
    } catch (error) {
    console.error('Error deleting user with axios:', error);
    throw error;
  }
};


