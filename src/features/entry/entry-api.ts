import { coreApi } from "../../app/core-api";
import { EntityCreateResult, PagedResult } from "../../app/types";
import { EntriesFilter, Entry, EntryListItem } from "./types";

export const entryApi = {
    createEntry,
    searchEntries
}

function createEntry(entry: Entry) {
    return coreApi.post<EntityCreateResult>('entries', entry);
}

function searchEntries(filter: EntriesFilter) {
    return coreApi.get<PagedResult<EntryListItem>>(`entries`, filter);
}
