import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import '../styles/CustomSelect.scss';

interface CustomSelectProps {
  items: { value: string; label: string }[];
  style?: object; // Add a style prop to accept custom styles
  initialDefaultValue?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ items, style, initialDefaultValue }) => {
  const [defaultValue, setDefaultValue] = useState(initialDefaultValue || null);

  useEffect(() => {
    // Update the default value when the prop changes
    setDefaultValue(initialDefaultValue || null);
  }, [initialDefaultValue]);

  // Merge the provided styles with customStyles if style prop is provided
  const customStyles = style
    ? {
        indicatorSeparator: (provided) => ({
          ...provided,
          display: 'none',
        }),
        control: (provided) => ({
          ...provided,
          border: 'none',
          boxShadow: 'none',
          Width: '140px',
        }),
        menu: (provided) => ({
          ...provided,
          maxHeight: '220px',
          overflowY: 'auto',
        }),
        ...style, // Merge the provided styles
      }
    : {};

  return (
    <div>
      <Select
        className="custom-select"
        options={items}
        styles={customStyles}
        defaultValue={items.find((item) => item.label === defaultValue)}
      />
    </div>
  );
};

export default CustomSelect;
