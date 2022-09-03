import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { entriesSelector, entryFilterSelector, searchEntriesAsync } from "../entry-slice"
import EntryCard from "./EntryCard";

export default function EntryList() {
    const entries = useAppSelector(entriesSelector);

    const dispatch = useAppDispatch();
    const filter = useAppSelector(entryFilterSelector);

    const search = () => {
        dispatch(searchEntriesAsync(filter));
    }

    return <>
        {entries.items.map(e => <EntryCard key={e.id} onUpdate={search} entry={e} />)}
    </>
}