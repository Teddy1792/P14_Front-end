import React, { useState, useEffect, ChangeEvent, FormEvent, FocusEvent } from 'react';
import { NavLink } from 'react-router-dom';
import ModalComponent from './ModalComponent.jsx';
import useDocumentTitle from './useDocumentTitle.js';
import states from '../assets/states.json';
import departments from '../assets/departments.json';
import CustomSelect from './CustomSelect.js';
import DatePicker from './DatePicker.jsx';
import { useDispatch } from 'react-redux';
import { addEmployee } from '../redux/employeesSlice';
import '../styles/CreateEmployee.scss';

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  startDate: Date | null;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  department: string;
}

const CreateEmployee = () => {
  // Set the document title
  useDocumentTitle('HRnet');
  
  const dispatch = useDispatch();

  // Form state for employee data
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    startDate: null,
    street: '',
    city: '',
    state: '',
    zipCode: '',
    department: '',
  });

  // Form validation errors
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
  
  // State to track whether all fields are filled
  const [areAllFieldsFilled, setAreAllFieldsFilled] = useState(false);

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.id]: '',
    }));
  
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle department change
  const handleDepartmentChange = (selectedValue) => {
    setFormData({
      ...formData,
      department: selectedValue.value, // Update department field
    });
  };

  // Handle state change
  const handleStateChange = (selectedValue) => {
    setFormData({
      ...formData,
      state: selectedValue.value, // Update state field
    });
  };

  // Handle input blur (comprehensive validation)
  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    let error = '';
  
    switch (id) {
      case 'firstName':
      case 'lastName':
      case 'city':
      case 'street':
        if (value.length < 2) {
          error = 'Field must have at least two letters';
        }
        break;
      case 'zipCode':
        if (!/^\d{5,}$/.test(value)) { // Only trigger validation if there are two or more digits
          error = 'Zip Code must contain 5 digits!';
        }
        break;
      case 'state':
      case 'department':
        if (!value) {
          error = 'Field is required';
        }
        break;
      case 'dateOfBirth':
      case 'startDate':
        if (!value) {
          error = 'Field is required';
        }
        break;
      default:
        break;
    }
  
    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [id]: error,
    }));
  };  

  // Check if all required fields are filled
  useEffect(() => {
    const requiredFields = ['firstName', 'lastName', 'city', 'street', 'state', 'zipCode', 'department', 'dateOfBirth', 'startDate'];
    const hasErrors = Object.values(inputErrors).some((error) => error !== '');
  
    // Calculate areRequiredFieldsFilled inside the useEffect
    const areRequiredFieldsFilled = requiredFields.every((field) => {
      if (field === 'dateOfBirth' || field === 'startDate') {
        return !!formData[field];
      } else {
        return formData[field].trim() !== '' && !inputErrors[field];
      }
    });
  
    // Set the state to enable or disable the submit button
    setAreAllFieldsFilled(!hasErrors && areRequiredFieldsFilled);
  }, [inputErrors, formData]); // Include inputErrors and formData as dependencies

  // Handle form submission
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  // Convert dateOfBirth and startDate to "YYYY-MM-DD" format
  const formDataWithSerializedDates = {
    ...formData,
    dateOfBirth: formData.dateOfBirth
      ? formData.dateOfBirth.toISOString().split('T')[0]
      : null,
    startDate: formData.startDate
      ? formData.startDate.toISOString().split('T')[0]
      : null,
  };
    // Dispatch the action to add an employee
    dispatch(addEmployee(formDataWithSerializedDates));
    // Open the modal
    openModal();
  };

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className="container">
      <div className='title'>
        <h2>Create Employee</h2>
      </div>
      <form onSubmit={handleFormSubmit} id="create-employee">
      <div className='completeForm'>
        <div className='employeePersonalInfo'>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {inputErrors.lastName && (
            <div className="errorMessage">{inputErrors.lastName}</div>
          )}

          <label htmlFor="dateOfBirth">Date of Birth</label>
          <DatePicker
            selectedDate={formData.dateOfBirth}
            onChange={(date) =>
              setFormData({ ...formData, dateOfBirth: date })
            }
            onFormInputChange={(fieldName, value) =>
              setFormData({ ...formData, dateOfBirth: value })
            }
          />
          <label htmlFor="startDate">Start Date</label>
          <DatePicker
            selectedDate={formData.startDate}
            onChange={(date) =>
              setFormData({ ...formData, startDate: date })
            }
            onFormInputChange={(fieldName, value) =>
              setFormData({ ...formData, startDate: value })
            }
          />
          {inputErrors.startDate && (
            <div className="errorMessage">{inputErrors.startDate}</div>
          )}
          <div className="departmentSelect">
            <label htmlFor="department">Department</label>
            <CustomSelect
              items={departments.map((department) => ({
                value: department,
                label: department,
              }))}
              onChange={handleDepartmentChange}
              value={{ value: formData.department, label: formData.department }}
            />
            {inputErrors.department && (
              <div className="errorMessage">{inputErrors.department}</div>
            )}
          </div>
        </div>
        <div className='employeeAdress'>
          <fieldset className="address">
            <legend>Address</legend>

            <label htmlFor="street">Street</label>
            <input
              type="text"
              id="street"
              value={formData.street}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {inputErrors.street && (
              <div className="errorMessage">{inputErrors.street}</div>
            )}

            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {inputErrors.city && (
              <div className="errorMessage">{inputErrors.city}</div>
            )}

            <label htmlFor="state">State</label>
            <CustomSelect
              items={states.map((state) => ({
                value: state.name,
                label: state.name,
              }))}
              onChange={handleStateChange} 
              value={{ value: formData.state, label: formData.state }}
            />
            <label htmlFor="zipCode">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {inputErrors.zipCode && (
              <div className="errorMessage">{inputErrors.zipCode}</div>
            )}
          </fieldset>
        </div>
        </div>
        <div className='buttonContainer'>
          <button type="submit" disabled={!areAllFieldsFilled}>
            Save
          </button>
        </div>
      </form>
      <ModalComponent isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default CreateEmployee;
