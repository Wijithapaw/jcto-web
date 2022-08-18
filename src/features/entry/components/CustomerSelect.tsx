import { useAppSelector } from "../../../app/hooks";
import Dropdown from "../../../components/Dropdown";
import { customerListItemsSelector } from "../../customer/customer-slice";

interface Props {
    name?: string;
    selectedValue?: string;
    onChange: (value: string) => void;
}

export default function CustomerSelect({ name, onChange, selectedValue }: Props) {
    const customers = useAppSelector(customerListItemsSelector);
    return <Dropdown
        items={customers}
        name={name}
        onChange={onChange}
        selectedValue={selectedValue}
        placeholder="Select Customer"
        showEmptyRow />
}
