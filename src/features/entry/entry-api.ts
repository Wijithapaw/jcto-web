import { coreApi } from "../../app/core-api";
import { EntityCreateResult, PagedResult } from "../../app/types";
import { EntriesFilter, Entry, EntryApproval, EntryListItem } from "./types";

export const entryApi = {
    createEntry,
    searchEntries,
    approveEntry
}

function createEntry(entry: Entry) {
    return coreApi.post<EntityCreateResult>('entries', entry);
}

function searchEntries(filter: EntriesFilter) {
    return coreApi.get<PagedResult<EntryListItem>>(`entries`, filter);
}

function approveEntry(approval: EntryApproval) {
    return coreApi.post<EntityCreateResult>('entries/approve', approval);
}
