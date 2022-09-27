import { useMemo } from "react";
import { ListItem } from "../../../app/types";
import Dropdown from "../../../components/Dropdown";
import { EntryApprovalType, getApprovalType } from "../types";

const allApprovalTypes: ListItem[] = [
    { id: EntryApprovalType.Rebond.toString(), label: getApprovalType(EntryApprovalType.Rebond) },
    { id: EntryApprovalType.Xbond.toString(), label: getApprovalType(EntryApprovalType.Xbond) },
    { id: EntryApprovalType.Letter.toString(), label: getApprovalType(EntryApprovalType.Letter) }
];

interface Props {
    name?: string;
    selectedValue?: EntryApprovalType;
    onChange: (value?: EntryApprovalType) => void;
    disabled?: boolean;
    filter?: EntryApprovalType[];
}

export default function ApprovalTypeSelect({ name, onChange, selectedValue, disabled, filter }: Props) {
    const items = useMemo(() => {
        if (filter && filter.length) {
            const filteredItems = allApprovalTypes.filter(l => filter.includes(+l.id));
            return filteredItems;
        }
        return allApprovalTypes;
    }, [filter])

    return <Dropdown
        disabled={disabled}
        items={items}
        name={name}
        onChange={(val) => { onChange(val ? +val : undefined) }}
        selectedValue={selectedValue?.toString()}
        placeholder=""
        showEmptyRow />
}
