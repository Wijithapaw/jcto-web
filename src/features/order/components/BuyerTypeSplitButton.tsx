import { Button, ButtonGroup } from "reactstrap";
import { BuyerType } from "../types";

interface Props {
    value: BuyerType;
    onChange: (val: BuyerType) => void;
    disabled?: boolean;
}

export default function BuyerTypeSplitButton({ value, onChange, disabled }: Props) {
    return <ButtonGroup>
        <Button color="primary" outline
            onClick={() => !disabled && onChange(BuyerType.Barge)}
            active={value === BuyerType.Barge}>
            Barge
        </Button>
        <Button color="primary" outline
            onClick={() => !disabled && onChange(BuyerType.Bowser)}
            active={value === BuyerType.Bowser}>
            Bowser
        </Button>
    </ButtonGroup>
}