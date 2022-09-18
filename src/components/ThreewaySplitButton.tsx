import { useMemo } from "react";
import { Button, ButtonGroup } from "reactstrap";

interface Props {
    selectedValue?: boolean;
    onChange: (val?: boolean) => void;
    trueLabel: string;
    falseLabel: string;
    allLabel: string;
}

export function ThreewaySplitButton({ trueLabel, falseLabel, allLabel, onChange, selectedValue }: Props) {

    var btnData = useMemo(() => {
        return [
            { label: allLabel, value: undefined },
            { label: trueLabel, value: true },
            { label: falseLabel, value: false }
        ];

    }, [trueLabel, allLabel, falseLabel])

    return (
        <ButtonGroup size="sm">
            {btnData.map((val, index) => <Button key={index}
                color="success"
                outline
                onClick={() => onChange(val.value)}
                active={selectedValue === val.value}
            >
                {val.label}
            </Button>)}
        </ButtonGroup>
    )
}
