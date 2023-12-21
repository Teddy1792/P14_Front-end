import React from 'react';
import { NavLink,useLocation } from 'react-router-dom';
import icon from '../assets/logo.png';
import '../styles/Nav.scss';

const Nav = () => {
  const location = useLocation();

  return (
    <nav>
      <div className='logo'>
        <img src={icon} alt="Logo" />
        <div className='HRnet'>
          <h1 className='HR'>HR</h1>
          <h1 className='net'>NET</h1>
        </div>
      </div>
      {location.pathname === '/' ? (
        <NavLink to="/employee-list">
          View Current Employees
        </NavLink>
      ) : (
        <NavLink to="/">
          Home
        </NavLink>
      )}
    </nav>
  );
};

export default Nav;

