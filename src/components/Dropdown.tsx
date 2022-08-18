import { Input } from 'reactstrap';
import { ListItem } from '../app/types';

interface Props {
  id?: string;
  name?: string;
  selectedValue?: string;
  items: ListItem[];
  showEmptyRow?: boolean;
  placeholder: string;
  onChange: (value: string) => void;
}

export default function Dropdown({ id, name, selectedValue = '', items, showEmptyRow = true, placeholder, onChange }: Props) {
  return <Input
    id={id}
    name={name}
    type="select"
    value={selectedValue}
    onChange={(e) => onChange(e.target.value)}
  >
    {showEmptyRow && <option label={placeholder || 'Please select'} value='' />}
    {items.map(i => <option key={i.id} label={i.label} value={i.id} />)}
  </Input>
}
