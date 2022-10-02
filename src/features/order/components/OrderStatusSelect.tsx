import { useMemo } from "react";
import { ListItem } from "../../../app/types";
import Dropdown from "../../../components/Dropdown";
import { OrderStatus } from "../types";

interface Props {
    value?: OrderStatus;
    onChange: (val?: OrderStatus) => void;
    showAllOption?: boolean;
    className?: string;
    disabled?: boolean;
    hideCancelled?: boolean;
}

export default function OrderStatusSelect({ value, onChange, showAllOption, className, disabled, hideCancelled }: Props) {
    const orderStatus = useMemo(() => {
        var types: ListItem[] = [
            { id: OrderStatus.Undelivered.toString(), label: 'Undelivered' },
            { id: OrderStatus.Delivered.toString(), label: 'Delivered' }
        ];
        !hideCancelled && types.push({ id: OrderStatus.Cancelled.toString(), label: 'Cancelled' });
        return types;
    }, [hideCancelled])

    return <Dropdown items={orderStatus}
        className={className}
        showEmptyRow={showAllOption || false}
        onChange={(val) => onChange(val ? +val as OrderStatus : undefined)}
        selectedValue={value?.toString() || ''}
        disabled={disabled}
    />
}
