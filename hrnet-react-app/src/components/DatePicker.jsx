import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import '../styles/DatePicker.scss';
import CustomSelect from './CustomSelect'; // Import the CustomSelect component

const DatePicker = () => {
  const [displayedDate, setDisplayedDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const daysInMonth = () => {
    return new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = () => {
    return new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 1).getDay();
  };

  const generateCalendar = () => {
    const days = daysInMonth();
    const firstDay = firstDayOfMonth();

    const rows = [];
    let currentRow = [];

    const lastDayOfPrevMonth = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 0).getDate();

    // Add days from the previous month to the grid
    for (let i = firstDay - 1; i >= 0; i--) {
      currentRow.push(
        <td
          key={`prev-${i}`}
          className="inactive"
          onClick={() => {
            // Handle clicking on days from the previous month if needed
          }}
        >
          {lastDayOfPrevMonth - i}
        </td>
      );
    }

    for (let day = 1; day <= days; day++) {
      currentRow.push(
        <td
          key={day}
          onClick={() => {
            const selected = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), day);
            setSelectedDate(selected);
            setIsDatePickerOpen(false);
          }}
          className={selectedDate && day === selectedDate.getDate() ? 'selected' : ''}
        >
          {day}
        </td>
      );

      if (currentRow.length === 7) {
        rows.push(<tr key={day}>{currentRow}</tr>);
        currentRow = [];
      }
    }

    // Add days from the next month to the grid
    let nextMonthDate = 1;
    while (currentRow.length < 7) {
      currentRow.push(
        <td
          key={`next-${nextMonthDate}`}
          className="inactive"
          onClick={() => {
            // Handle clicking on days from the next month if needed
          }}
        >
          {nextMonthDate}
        </td>
      );
      nextMonthDate++;
    }

    // Ensure that there are at least 6 rows
    while (rows.length < 6) {
      rows.push(<tr key={`empty-${rows.length}`} />);
    }

    return rows;
  };

  return (
    <div className="date-picker">
      <input
        type="text"
        value={selectedDate ? selectedDate.toDateString() : ''}
        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
        readOnly
      />
      {isDatePickerOpen && (
        <div className="date-picker-container">
          <div className="date-picker-header">
            <button type="button" onClick={() => setDisplayedDate(new Date(displayedDate.getFullYear(), displayedDate.getMonth() - 1, 1))}>
              {'<'}
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
              items={Array.from({ length: 12 }, (_, index) => ({
                value: index,
                label: new Date(displayedDate.getFullYear(), index, 1).toLocaleString('default', { month: 'long' }),
              }))}
            />
            <CustomSelect
              items={Array.from({ length: 101 }, (_, index) => ({
                value: 1930 + index,
                label: `${1930 + index}`,
              }))}
            />
            <button type="button" onClick={() => setDisplayedDate(new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1, 1))}>
              {'>'}
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
