import { useEffect, useState } from 'react';
import Select from 'react-select';
import '../styles/CustomSelect.scss';

interface CustomSelectProps {
  items: { value: string | number; label: string }[];
  style?: object;
  initialDefaultValue?: string;
  onChange?: (selectedOption: { value: string | number; label: string } | null) => void; // Pass null for clearing the selection
  value?: { value: string | number; label: string } | null; // Allow null for clearing the selection
}

const CustomSelect: React.FC<CustomSelectProps> = ({ items, style, initialDefaultValue, onChange, value }) => {
  const [defaultValue, setDefaultValue] = useState(initialDefaultValue || null);

  useEffect(() => {
    setDefaultValue(initialDefaultValue || null);
  }, [initialDefaultValue]);

  // Custom styles for the select component
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
          width: '140px', // 'Width' should be lowercase 'width'
        }),
        menu: (provided) => ({
          ...provided,
          maxHeight: '220px',
          overflowY: 'auto',
        }),
        ...style,
      }
    : {};

  // Handle selection change
  const handleChange = (selectedOption) => {
    console.log(selectedOption);
    onChange(selectedOption);
  };

  return (
    <div>
      <Select
        className="custom-select"
        options={items}
        styles={customStyles}
        value={items.find((item) => item.value === (value ? value.value : defaultValue))}
        onChange={handleChange}
      />
    </div>
  );
};

export default CustomSelect;
