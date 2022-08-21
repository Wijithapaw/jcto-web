import { useAppSelector } from "../../../app/hooks";
import Dropdown from "../../../components/Dropdown";
import { productsListItemsSelector } from "../customer-slice";

interface Props {
    name?: string;
    selectedValue?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function ProductSelect({ name, onChange, selectedValue, disabled }: Props) {
    const products = useAppSelector(productsListItemsSelector);
    return <Dropdown
        disabled={disabled}
        items={products}
        name={name}
        onChange={onChange}
        selectedValue={selectedValue}
        placeholder=""
        showEmptyRow />
}
