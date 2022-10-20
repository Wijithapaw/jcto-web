import { useMemo, useState } from "react";
import { Button, Input, InputGroup, ListGroup, ListGroupItem, PopoverBody, UncontrolledPopover } from "reactstrap";
import AppIcon from "../../../components/AppIcon";

interface Props {
    index?: number;
    name?: string
    disabled?: boolean;
    value?: number;
    onChange: (val: any) => void;
}

export default function BowserSelect({ name, onChange, value, disabled, index }: Props) {
    const [open, setOpen] = useState(false);

    const options = useMemo(() => {
        return [
            "3300",
            "6600",
            "9900",
            "13200",
            "19800",
            "33000"
        ];
    }, []);

    const toggle = () => setOpen(!open);

    const id = `bowserselect-${index || ''}`;

    return <InputGroup>
        <Input disabled={disabled}
            value={value}
            name={name}
            type="number"
            onChange={onChange} />
        <Button type="button" onClick={toggle} id={id} disabled={disabled}>
            <AppIcon icon="chevron-down" />
        </Button>
        <UncontrolledPopover placement="auto" isOpen={open} target={id} toggle={toggle} trigger="legacy">
            <PopoverBody>
                <ListGroup>
                    {options.map((val, index) => <ListGroupItem key={`${index}-${val}`}
                        onClick={(e) => {
                            onChange({ target: { name, value: val } });
                            toggle();
                        }}>
                        <span className="txt-link"> {val}</span>
                    </ListGroupItem>)}
                </ListGroup>
            </PopoverBody>
        </UncontrolledPopover>
    </InputGroup>
}



