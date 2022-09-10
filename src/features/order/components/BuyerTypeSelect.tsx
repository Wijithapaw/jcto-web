import { useMemo } from "react";
import { ListItem } from "../../../app/types";
import Dropdown from "../../../components/Dropdown";
import { BuyerType } from "../types";

interface Props {
    value?: BuyerType;
    onChange: (val?: BuyerType) => void;
    disabled?: boolean;
    showAllOption?: boolean;
}

export default function BuyerTypeSelect({ value, onChange, disabled, showAllOption }: Props) {
    const buyerTypes = useMemo(() => {
        var types: ListItem[] = [
            { id: BuyerType.Barge.toString(), label: 'Barge' },
            { id: BuyerType.Bowser.toString(), label: 'Bowser' }
        ];
        return types;
    }, [])

    return <Dropdown items={buyerTypes}
        disabled={disabled}        
        showEmptyRow={showAllOption || false}
        onChange={(val) => onChange(val ? +val as BuyerType : undefined)}
        selectedValue={value?.toString() || ''}
    />
}
