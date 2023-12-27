import React, { useEffect, useState } from 'react';
import Select, { StylesConfig, ActionMeta } from 'react-select';

interface OptionType {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  items: OptionType[];
  style?: object;
  initialDefaultValue?: string;
  onChange?: (selectedOption: OptionType | null) => void; // Pass null for clearing the selection
  value?: OptionType | null; // Allow null for clearing the selection
}

const CustomSelect: React.FC<CustomSelectProps> = ({ items, style, initialDefaultValue, onChange, value }) => {
  const [defaultValue, setDefaultValue] = useState<OptionType | null>(initialDefaultValue || null);

  useEffect(() => {
    setDefaultValue(initialDefaultValue || null);
  }, [initialDefaultValue]);

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
      width: '189px',
    }),
    menu: (provided) => ({
      ...provided,
      maxHeight: '220px',
      overflowY: 'auto',
    }),
    ...style,
  };

  // Handle selection change
  const handleChange = (selectedOption: OptionType | null, actionMeta: ActionMeta<OptionType>) => {
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
