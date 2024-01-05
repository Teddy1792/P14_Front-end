import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import Modal from 'react-modal';
import { store } from './redux/store.js';
import { setEmployees } from './redux/employeesSlice';
import employeesData from './assets/mockedEmployees.json'; // Import the employees data

Modal.setAppElement('#root');

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

store.dispatch(setEmployees(employeesData));
