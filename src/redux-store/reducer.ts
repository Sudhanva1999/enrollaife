import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './types';
import { CourseOffer } from '../models/CourseModel';

// Initial state
const initialState: { userProfile: User | null } = {
  userProfile: null,
};

// Creating a slice to manage the user profile state
const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUserProfile(state, action: PayloadAction<User>) {
      state.userProfile = action.payload;
    }    
  },
});

// Initial state
const initialCoursesState: { courses: CourseOffer[] | null } = {
    courses: null,
  };
  
// Creating a slice to manage the courses state
const coursesSlice = createSlice({
    name: 'courses',
    initialState: initialCoursesState,
    reducers: {
      setCourses(state, action: PayloadAction<CourseOffer[]>) {
        state.courses = action.payload;
      }    
    },
  });

// Exporting actions for use in components
export const { setUserProfile } = userSlice.actions;
export const { setCourses } = coursesSlice.actions;

// Exporting the reducer to use in store
export const userReducer = userSlice.reducer;
export const coursesReducer = coursesSlice.reducer;
