import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import CustomSelect from './CustomSelect';
import '../styles/DatePicker.scss';


const DatePicker = () => {

  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);


  //custom style for the selects
  const customStyles = true;

  const [displayedDate, setDisplayedDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const daysInMonth = () => {
    return new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = () => {
    return new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 1).getDay();
  };

  const lastDayOfPrevMonth = () => {
    return new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 0).getDate();
  }

    // Calculate the initial values for month and year selects
    const initialMonth = {
      value: displayedDate.getMonth(),
      label: new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 1).toLocaleString('default', {
        month: 'long',
      }),
    };
  
    const initialYear = {
      value: displayedDate.getFullYear(),
      label: `${displayedDate.getFullYear()}`,
    };

// Helper function to format the date
const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

  const generateCalendar = () => {
    const days = daysInMonth();
    const firstDay = firstDayOfMonth();
    const lastDayPrevMonth = lastDayOfPrevMonth()

    const rows = [];
    let currentRow = [];

    // Add days from the previous month to the grid
    for (let i = firstDay - 1; i >= 0; i--) {
      currentRow.push(
        <td
          key={`prev-${i}`}
          className="inactive"
        >
          {lastDayPrevMonth - i}
        </td>
      );
    }
//get current day
const currentDate = new Date();

    for (let day = 1; day <= days; day++) {
  const isCurrentDay =
    displayedDate.getFullYear() === currentDate.getFullYear() &&
    displayedDate.getMonth() === currentDate.getMonth() &&
    day === currentDate.getDate();

  currentRow.push(
    <td
      key={day}
      onClick={() => {
        const selected = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), day);
        setSelectedDate(selected);
        setIsDatePickerOpen(false);
      }}
      className={`${
        selectedDate && day === selectedDate.getDate() ? 'selected' : ''
      } ${isCurrentDay ? 'current-day' : ''}`}
    >
      {day}
    </td>
  );

  if (currentRow.length === 7) {
    rows.push(<tr key={day}>{currentRow}</tr>);
    currentRow = [];
  }
}


  // Add days from the next month to complete the last row if needed
  while (currentRow.length < 7) {
    currentRow.push(
      <td
        key={`next-${currentRow.length}`}
        className="inactive"
      >
        {currentRow.length + 1}
      </td>
    );
  }

  rows.push(<tr key={`row-next`}>{currentRow}</tr>);
  return rows;
  
};
  return (
    <div className="date-picker" ref={datePickerRef}>
<input
  type="text"
  value={selectedDate ? formatDate(selectedDate) : ''}
  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
  readOnly
/>
      {isDatePickerOpen && (
        <div className="date-picker-container">
          <div className="date-picker-header">
            <button type="button" onClick={() => setDisplayedDate(new Date(displayedDate.getFullYear(), displayedDate.getMonth() - 1, 1))}>
            <FontAwesomeIcon icon={faCaretLeft} />
            </button>
            <button
              type="button"
              onClick={() => {
                const today = new Date(); // Get the current date
                setDisplayedDate(today); // Set the displayed date to the current date
              }}
            >
              <FontAwesomeIcon icon={faHouse} />
            </button>
            <CustomSelect
              style={customStyles}
              items={Array.from({ length: 12 }, (_, index) => ({
                value: index,
                label: new Date(displayedDate.getFullYear(), index, 1).toLocaleString('default', { month: 'long' }),
              }))}
              initialDefaultValue={initialMonth.label} // Set the initial month value
            />
            <CustomSelect
              style={customStyles}
              items={Array.from({ length: 101 }, (_, index) => ({
                value: 1930 + index,
                label: `${1930 + index}`,
              }))}
              initialDefaultValue={initialYear.label} // Set the initial year value
            />
            <button type="button" onClick={() => setDisplayedDate(new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1, 1))}>
            <FontAwesomeIcon icon={faCaretRight} />
            </button>
          </div>
          <table className="date-picker-calendar">
            <thead>
              <tr>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
              </tr>
            </thead>
            <tbody>{generateCalendar()}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
