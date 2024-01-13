import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from './employeesSlice';

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
  },
});

// Define RootState based on the store's state
export type RootState = ReturnType<typeof store.getState>;

export default store;
