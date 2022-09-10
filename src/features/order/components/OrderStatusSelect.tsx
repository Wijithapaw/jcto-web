import { useMemo } from "react";
import { ListItem } from "../../../app/types";
import Dropdown from "../../../components/Dropdown";
import { OrderStatus } from "../types";

interface Props {
    value?: OrderStatus;
    onChange: (val?: OrderStatus) => void;
    showAllOption?: boolean;
    className?: string;
}

export default function OrderStatusSelect({ value, onChange, showAllOption, className }: Props) {
    const orderStatus = useMemo(() => {
        var types: ListItem[] = [
            { id: OrderStatus.Undelivered.toString(), label: 'Undelivered' },
            { id: OrderStatus.Delivered.toString(), label: 'Delivered' }
        ];
        return types;
    }, [])

    return <Dropdown items={orderStatus}
        className={className}
        showEmptyRow={showAllOption || false}
        onChange={(val) => onChange(val ? +val as OrderStatus : undefined)}
        selectedValue={value?.toString() || ''}
    />
}
