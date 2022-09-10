import { Input } from 'reactstrap';
import { ListItem } from '../app/types';

interface Props {
  id?: string;
  name?: string;
  selectedValue?: string;
  items: ListItem[];
  showEmptyRow?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function Dropdown({ id, name, selectedValue = '', items, showEmptyRow = true, placeholder, onChange, disabled, className }: Props) {
  return <Input
    disabled={disabled}
    id={id}
    name={name}
    type="select"
    value={selectedValue}
    onChange={(e) => onChange(e.target.value)}
    className={className}
  >
    {showEmptyRow && <option label={placeholder || ''} value='' />}
    {items.map(i => <option key={i.id} label={i.label} value={i.id} />)}
  </Input>
}
