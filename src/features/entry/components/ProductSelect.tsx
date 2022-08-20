import Dropdown from "../../../components/Dropdown";
import { PRODUCT_CODES } from "../../customer/types";

interface Props {
    name?: string;
    selectedValue?: string;
    onChange: (value: string) => void;
}

export default function ProductSelect({ name, onChange, selectedValue }: Props) {
    return <Dropdown
        items={PRODUCT_CODES}
        name={name}
        onChange={onChange}
        selectedValue={selectedValue}
        placeholder=""
        showEmptyRow />
}
