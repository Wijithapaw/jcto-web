import { useMemo } from "react";
import { numbersHelpers } from "../../../app/helpers";
import { ListItem } from "../../../app/types";
import Dropdown from "../../../components/Dropdown";
import { EntryRemaningApproval, getApprovalType } from "../../entry/types";

interface Props {
    name?: string;
    selectedValue?: string;
    onChange: (value?: string) => void;
    disabled?: boolean;
    options: EntryRemaningApproval[];
}

export default function RemainingApprovalsSelect({ name, onChange, selectedValue, disabled, options }: Props) {
    const items: ListItem[] = useMemo(() => {
        return options.map(o => ({ id: o.id, label: `${getApprovalType(o.approvalType)}${o.approvalRef ? `-${o.approvalRef}` : ''} (Bal: ${numbersHelpers.toDisplayStr(o.remainingQty)})` }));
    }, [options])

    return <Dropdown
        disabled={disabled}
        items={items}
        name={name}
        onChange={onChange}
        selectedValue={selectedValue?.toString()}
        placeholder=""
        showEmptyRow />
}
