import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import AppPaginator from "../../../components/AppPaginator";
import { changeEntryFilter, entriesSelector, entryFilterSelector, searchEntriesAsync } from "../entry-slice"
import EntryCard from "./EntryCard";

export default function EntryList() {
    const entries = useAppSelector(entriesSelector);

    const dispatch = useAppDispatch();
    const filter = useAppSelector(entryFilterSelector);

    const search = () => {
        dispatch(searchEntriesAsync(filter));
    }

    const handlePageChange = (page: number) => {
        dispatch(changeEntryFilter({ page }));
        dispatch(searchEntriesAsync({ ...filter, page }));
    }

    return <>
        {entries.items.map(e => <EntryCard key={e.id} onUpdate={search} entry={e} />)}
        <hr/>
        <AppPaginator
            page={filter.page}
            pageSize={filter.pageSize}
            onChange={handlePageChange}
            total={entries.total} />
    </>
}