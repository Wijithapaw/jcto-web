import { useAppSelector } from "../../../app/hooks";
import Dropdown from "../../../components/Dropdown";
import { productsListItemsSelector } from "../../customer/customer-slice";

interface Props {
    name?: string;
    selectedValue?: string;
    onChange: (value: string) => void;
}

export default function ProductSelect({ name, onChange, selectedValue }: Props) {
    const products = useAppSelector(productsListItemsSelector);
    return <Dropdown
        items={products}
        name={name}
        onChange={onChange}
        selectedValue={selectedValue}
        placeholder=""
        showEmptyRow />
}
