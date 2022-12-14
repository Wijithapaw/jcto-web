import { coreApi } from "../../app/core-api";
import { EntityCreateResult, EntityUpdateResult, PagedResult } from "../../app/types";
import { EntriesFilter, Entry, EntryApproval, EntryApprovalSummary, EntryBalanceQty, EntryListItem, EntryRebondToDto, EntryRemaningApproval } from "./types";

export const entryApi = {
    createEntry,
    updateEntry,
    searchEntries,
    approveEntry,
    getBalanceQuantities,
    getRemainingApprovals,
    getEntry,
    deleteEntry,
    deleteApproval,
    updateApproval,
    getApprovalSummary,
    rebondTo,
    getEntryApproval
}

function createEntry(entry: Entry) {
    return coreApi.post<EntityCreateResult>('entries', entry);
}

function updateEntry(id: string, entry: Entry) {
    return coreApi.put<EntityCreateResult>(`entries/${id}`, entry);
}

function searchEntries(filter: EntriesFilter) {
    return coreApi.get<PagedResult<EntryListItem>>(`entries`, filter);
}

function getEntry(id: string) {
    return coreApi.get<Entry>(`entries/${id}`);
}

function deleteEntry(id: string) {
    return coreApi.del(`entries/${id}`);
}

function getApprovalSummary(id: string) {
    return coreApi.get<EntryApprovalSummary>(`entries/approval/${id}/summary`);
}

function approveEntry(approval: EntryApproval) {
    return coreApi.post<EntityCreateResult>('entries/approval', approval);
}


function getEntryApproval(id: string) {
    return coreApi.get<EntryApproval>(`entries/approval/${id}`);
}

function deleteApproval(id: string) {
    return coreApi.del(`entries/approval/${id}`);
}

function updateApproval(id: string, approval: EntryApproval) {
    return coreApi.put<EntityUpdateResult>(`entries/approval/${id}`, approval);
}

function getBalanceQuantities(entryNo: string) {
    return coreApi.get<EntryBalanceQty>(`entries/${entryNo}/balance`);
}

function getRemainingApprovals(entryNo: string, excludeOrderId?: string) {
    return coreApi.get<EntryRemaningApproval[]>(`entries/${entryNo}/RemainingApprovals`, { excludeOrderId });
}

function rebondTo(entryId: string, data: EntryRebondToDto) {
    return coreApi.post<EntityCreateResult>(`entries/${entryId}/RebondTo`, data);
}
