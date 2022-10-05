import { useState } from "react";
import { PopoverBody, PopoverHeader, UncontrolledPopover } from "reactstrap";
import { dateHelpers } from "../app/helpers";
import { AuditedEntity } from "../app/types";
import AppIcon from "./AppIcon";

interface Props {
    value: AuditedEntity;
    id: string;
}

export default function AuditInfo({ value, id }: Props) {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);

    return <>
        <AppIcon size="lg" icon="clipboard-list" id={id} title="Show audit information"
            className="text-primary ms-3 me-3" mode="button" onClick={toggle} />
        <UncontrolledPopover placement="right-end" isOpen={tooltipOpen} target={id} toggle={toggle} trigger="legacy">
            <PopoverHeader>Audit Info</PopoverHeader>
            <PopoverBody>
                {`Created by: ${value.createdBy} on ${value.createdDateUtc && dateHelpers.toDatetimeStr(value.createdDateUtc)}`}
                <br/>
                {`Last Updated by: ${value.lastUpdatedBy} on ${value.lastUpdatedDateUtc && dateHelpers.toDatetimeStr(value.lastUpdatedDateUtc)}`}
            </PopoverBody>
        </UncontrolledPopover>
    </>
}