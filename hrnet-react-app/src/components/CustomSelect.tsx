import Select from 'react-select';

interface CustomSelectProps {
  items: { value: string; label: string }[]; // Define a prop for the items
}

const CustomSelect: React.FC<CustomSelectProps> = ({ items }) => {
  return (
    <div>
      <Select options={items} />
    </div>
  );
};

export default CustomSelect;
