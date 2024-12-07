import { configureStore } from '@reduxjs/toolkit';
import {userReducer,  coursesReducer } from './reducer.ts';

// Create the store
const store = configureStore({
    reducer: {
      user: userReducer,
      courses: coursesReducer,
    },
  });
  
  // Exporting the store
  export type RootState = ReturnType<typeof store.getState>;
  export default store;
