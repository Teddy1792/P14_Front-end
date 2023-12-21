import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employees: [],
};

export const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    addEmployee: (state, action) => {
      state.employees.push(action.payload); // Add a single employee
    },
    // other reducers...
  },
});

export const { setEmployees, addEmployee } = employeesSlice.actions;

export default employeesSlice.reducer;
