import { SET_USER_PROFILE, UserActionTypes, CourseActionTypes } from './types';
import { SET_COURSES } from './types';
import {User} from '../models/UserModel'
import { CourseOffer } from '../models/CourseModel';

// Action creators
export const setUserProfile = (profile: User): UserActionTypes => ({
  type: SET_USER_PROFILE,
  payload: profile,
});

export const setCourses = (courses: CourseOffer[]): CourseActionTypes => ({
  type: SET_COURSES,
  payload: courses,
});