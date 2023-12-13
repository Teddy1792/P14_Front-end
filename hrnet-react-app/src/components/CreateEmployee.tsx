import React, { useState, ChangeEvent, FormEvent } from 'react';
import { NavLink } from 'react-router-dom';
import ModalComponent from './ModalComponent.jsx';
import useDocumentTitle from './useDocumentTitle.js';
import states from '../assets/states.json'; // Import the JSON file for states
import departments from '../assets/departments.json'; // Import the JSON file for departments
import CustomSelect from './CustomSelect.js';
import DatePicker from './DatePicker.jsx';
import '../styles/CreateEmployee.scss';

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  startDate: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  department: string;
}

const CreateEmployee = () => {
  // Change document name
  useDocumentTitle('HRnet');

  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    startDate: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    department: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you can handle the submission of the form data
    console.log(formData);
    openModal(); // Open the modal after form submission
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container">
      <h1>HRnet</h1>
      <NavLink to="/employee-list" className="active">
        View Current Employees
      </NavLink>
      <h2>Create Employee</h2>
      <form onSubmit={handleFormSubmit} id="create-employee">
        <label htmlFor="first-name">First Name</label>
        <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} />

        <label htmlFor="last-name">Last Name</label>
        <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} />

        <label htmlFor="date-of-birth">Date of Birth</label>
        <DatePicker selectedDate={formData.dateOfBirth} onChange={(date) => handleChange({ target: { id: 'dateOfBirth', value: date } })} />

        <label htmlFor="start-date">Start Date</label>
        <DatePicker selectedDate={formData.startDate} onChange={(date) => handleChange({ target: { id: 'startDate', value: date } })} />

        <fieldset className="address">
          <legend>Address</legend>

          <label htmlFor="street">Street</label>
          <input type="text" id="street" value={formData.street} onChange={handleChange} />

          <label htmlFor="city">City</label>
          <input type="text" id="city" value={formData.city} onChange={handleChange} />

          <label htmlFor="state">State</label>
          <CustomSelect items={states.map((state) => ({ value: state.name, label: state.name }))} />

          <label htmlFor="zip-code">Zip Code</label>
          <input type="text" id="zipCode" value={formData.zipCode} onChange={handleChange} />
        </fieldset>

        <div className="departmentSelect">
          <label htmlFor="department">Department</label>
          <CustomSelect
            items={departments.map((department) => ({ value: department, label: department }))}
            onSelect={(selectedValue) => handleChange({ target: { id: 'department', value: selectedValue } })}
          />
          <button type="submit">Save</button>
        </div>
      </form>
      <ModalComponent isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default CreateEmployee;
