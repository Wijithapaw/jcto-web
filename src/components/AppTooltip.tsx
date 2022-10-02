import { useState } from "react";
import { Tooltip } from "reactstrap";
import AppIcon from "./AppIcon";

interface Props {
    text: string;
    id: string;
}

export default function AppTooltip({ id, text }: Props) {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);

    return <>
        <AppIcon size="sm" icon="question-circle" id={id} className="text-primary ms-1 me-1" mode="icon" />
        <Tooltip placement="right"
            target={id}
            isOpen={tooltipOpen}
            toggle={toggle} >
            {text}
        </Tooltip>
    </>
}