import { useAppSelector } from "../../../app/hooks"
import { entriesSelector } from "../entry-slice"
import EntryCard from "./EntryCard";

export default function EntryList() {
    const entries = useAppSelector(entriesSelector);

    return <>
        {entries.items.map(e => <EntryCard key={e.id} entry={e} />)}
    </>
}