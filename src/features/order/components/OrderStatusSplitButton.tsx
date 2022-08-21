import { Button, ButtonGroup } from "reactstrap";
import { OrderStatus } from "../types";

interface Props {
    value?: OrderStatus;
    onChange: (val?: OrderStatus) => void;
    showAllOption?: boolean;
}

export default function OrderStatusSplitButton({ value, onChange, showAllOption }: Props) {
    return <ButtonGroup>
        {showAllOption && <Button color="primary" outline onClick={() => onChange(undefined)} active={value === undefined}>All</Button>}
        <Button color="primary" outline onClick={() => onChange(OrderStatus.Delivered)} active={value === OrderStatus.Delivered}>Delivered</Button>
        <Button color="primary" outline onClick={() => onChange(OrderStatus.Undelivered)} active={value === OrderStatus.Undelivered}>Undelivered</Button>
    </ButtonGroup>
}