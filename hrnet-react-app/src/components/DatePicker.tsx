import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight, faHouse } from '@fortawesome/free-solid-svg-icons';
import CustomSelect from './CustomSelect';
import '../styles/DatePicker.scss';

interface DatePickerProps {
  id: string;
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  onFormInputChange: (fieldName: string, value: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ id, selectedDate, onChange, onFormInputChange }) => {
  const datePickerRef = useRef(null);

  console.log("id:", typeof id);
  console.log("selectedDate:", typeof selectedDate);
  console.log("onChange:", typeof onChange);
  console.log("onFormInputChange:", typeof onFormInputChange);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
        handleDatePickerClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const [displayedDate, setDisplayedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [inputDate, setInputDate] = useState('');
  const [isValidDate, setIsValidDate] = useState(true);
  const [isDatePickerOpening, setIsDatePickerOpening] = useState(false);

  // Helper function to format a date into "YYYY-MM-DD" format
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  //check for correct input on change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;

    // Remove any non-digit characters except "-"
    inputValue = inputValue.replace(/[^\d-]/g, '');
  
    // Count the number of "-" characters
    const dashCount = (inputValue.match(/-/g) || []).length;

    // Add "-" after the year and month if they are typed
    if (inputValue.length === 4 && dashCount < 1) {
      inputValue = inputValue.substring(0, 4) + '-' + inputValue.substring(4);
    } else if (inputValue.length === 7 && dashCount < 2) {
      inputValue = inputValue.substring(0, 7) + '-' + inputValue.substring(7);
    }
    if (inputValue.length <= 10) {
      setInputDate(inputValue);
      onFormInputChange('date', inputValue);
    }
    try {
      const parsedDate = new Date(inputValue);
  
      // Check if the parsed date is not NaN and is in the ISO format
      if (!isNaN(parsedDate.getTime()) && inputValue === parsedDate.toISOString().slice(0, 10)) {
        setIsValidDate(true);
        setInputDate(parsedDate.toISOString().slice(0, 10));
        onFormInputChange('date', parsedDate.toISOString().slice(0, 10));
      } else {
        setIsValidDate(false);
      }
    } catch (error) {
      setIsValidDate(false);
    }
  };

  const handleDatePickerOpen = () => {
    setIsDatePickerOpen(true);
    setIsDatePickerOpening(true);
  };

  const handleDatePickerClose = () => {
    setIsDatePickerOpen(false);
    if (!isDatePickerOpening && !isValidDate) {
      setIsValidDate(true);
    }
    setIsDatePickerOpening(false);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // Check if the input value matches the desired format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(inputDate)) {
        const parsedDate = new Date(inputDate);
        if (!isNaN(parsedDate.getTime())) {
          // Update the selected date if it's a valid date
          onChange(parsedDate);
          setIsDatePickerOpen(false);
          setDisplayedDate(parsedDate);
        }
      } else {
        // Clear the selected date if the input value is not in the correct format
        onChange(null);
        setInputDate('');
      }
    }
  };

  const daysInMonth = () => {
    return new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = () => {
    return new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 1).getDay();
  };

  const lastDayOfPrevMonth = () => {
    return new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 0).getDate();
  };

  const generateCalendar = (handleClose: () => void) => {
    const days = daysInMonth();
    const firstDay = firstDayOfMonth();
    const lastDayPrevMonth = lastDayOfPrevMonth();
    const currentDate = new Date();
  
    const rows = [];
    let currentRow = [];
  
    // Adjust for Monday as the first day of the week
    const offset = firstDay === 0 ? 6 : firstDay;
  
    // Fill the preceding days of the week with the last few days of the previous month
    for (let i = 0; i < offset; i++) {
      currentRow.push(
        <td key={`prev-${i}`} className="inactive">
          {lastDayPrevMonth - offset + i + 1}
        </td>
      );
    }
  
    for (let day = 1; day <= days; day++) {
      const date = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), day);
      let className = "";
  
      const isCurrentDay =
        displayedDate.getFullYear() === currentDate.getFullYear() &&
        displayedDate.getMonth() === currentDate.getMonth() &&
        day === currentDate.getDate();
  
      const isSelectedDay = selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime()) && date.getTime() === selectedDate.getTime();
  
      if (isCurrentDay && (isSelectedDay || !selectedDate)) {
        className = "currentDay selectedDay";
      } else if (isCurrentDay) {
        className = "currentDayUnselected";
      } else if (isSelectedDay) {
        className = "selectedDay";
      }
  
      currentRow.push(
        <td
          key={day}
          onClick={() => {
            setInputDate(formatDate(date)); // Update inputDate with the selected date
            onChange(date); // Update the selected date here
            setIsValidDate(true); //validate the date so as to remove the error message
            handleClose(); // Close the date picker
          }}
          className={className}
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
  

  const handleMonthChange = (selectedMonth: { value: number; label: string }) => {
    setDisplayedDate((currentDate) => {
      return new Date(currentDate.getFullYear(), selectedMonth.value, 1);
    });
  };

  const handleYearChange = (selectedYear: { value: number; label: string }) => {
    setDisplayedDate((currentDate) => new Date(selectedYear.value, currentDate.getMonth(), 1));
  };

  return (
    <div className="date-picker" ref={datePickerRef}>
      <input
        type="text"
        id={id}
        value={inputDate}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onClick={handleDatePickerOpen} // Handle opening the date picker
        placeholder="YYYY-MM-DD"
      />
      {!isValidDate && (
        <div className="error-message">
          Please enter a valid date (YYYY-MM-DD format).
        </div>
      )}
      {isDatePickerOpen && (
        <div className="date-picker-container">
          <div className="date-picker-header">
            <button type="button" onClick={() => setDisplayedDate(new Date(displayedDate.getFullYear(), displayedDate.getMonth() - 1, 1))}>
              <FontAwesomeIcon icon={faCaretLeft} />
            </button>
            <button
              type="button"
              onClick={() => {
                setDisplayedDate(new Date());
              }}
            >
              <FontAwesomeIcon icon={faHouse} />
            </button>
            <CustomSelect
              style={true}
              items={Array.from({ length: 12 }, (_, index) => ({
                value: index,
                label: new Date(displayedDate.getFullYear(), index, 1).toLocaleString('default', { month: 'long' }),
              }))}
              value={{ value: displayedDate.getMonth(), label: new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 1).toLocaleString('default', { month: 'long' }) }}
              onChange={handleMonthChange}
            />
            <CustomSelect
              style={true}
              items={Array.from({ length: 101 }, (_, index) => ({
                value: 1930 + index,
                label: `${1930 + index}`,
              }))}
              value={{ value: displayedDate.getFullYear(), label: `${displayedDate.getFullYear()}` }}
              onChange={handleYearChange}
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
            <tbody>{generateCalendar(handleDatePickerClose)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DatePicker;