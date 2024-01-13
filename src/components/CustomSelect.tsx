import { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';

interface OptionType {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  items: { value: string | number; label: string }[];
  style?: object;
  initialDefaultValue?: string | number; // Adjusted to string or number
  onChange?: (selectedOption: { value: string | number; label: string } | null) => void;
  value?: { value: string | number; label: string } | null;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ items, style, initialDefaultValue, onChange, value }) => {
  const findInitialValue = () => {
    return items.find(item => item.value === initialDefaultValue) || null;
  };

  const [defaultValue, setDefaultValue] = useState<{ value: string | number; label: string } | null>(findInitialValue());

  useEffect(() => {
    setDefaultValue(findInitialValue());
  }, [initialDefaultValue, items]);

  // Custom styles for the select component
  const customStyles: StylesConfig<OptionType, false> = {
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),
    control: (provided) => ({
      ...provided,
      border: 'none',
      boxShadow: 'none',
      width: '110px',
    }),
    menu: (provided) => ({
      ...provided,
      maxHeight: '220px',
      overflowY: 'auto',
    }),
    ...style,
  };

  // Handle selection change
  const handleChange = (selectedOption: OptionType | null) => {
    console.log(selectedOption);
    onChange?.(selectedOption);
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
