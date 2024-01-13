import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Employee = {
  firstName: string;
  lastName: string;
  startDate: string;
  department: string;
  dateOfBirth: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
};


// Define a type for your employee state
type EmployeeState = {
  employees: Employee[];
};

const initialState: EmployeeState = {
  employees: [],
};

export const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
    },
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload);
    },
  },
});

export const { setEmployees, addEmployee } = employeesSlice.actions;

export default employeesSlice.reducer;
