import { useAppSelector } from "../../../app/hooks";
import Dropdown from "../../../components/Dropdown";
import { customerListItemsSelector } from "../customer-slice";

interface Props {
    name?: string;
    selectedValue?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function CustomerSelect({ name, onChange, selectedValue, disabled }: Props) {
    const customers = useAppSelector(customerListItemsSelector);
    return <Dropdown
        disabled={disabled}
        items={customers}
        name={name}
        onChange={onChange}
        selectedValue={selectedValue}
        placeholder=""
        showEmptyRow />
}
