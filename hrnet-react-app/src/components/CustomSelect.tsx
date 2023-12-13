import Select from 'react-select';
import '../styles/CustomSelect.scss'

interface CustomSelectProps {
  items: { value: string; label: string }[]; // Define a prop for the items
}

const CustomSelect: React.FC<CustomSelectProps> = ({ items }) => {
  return (
    <div>
      <Select className="custom-select" options={items} />
    </div>
  );
};

export default CustomSelect;