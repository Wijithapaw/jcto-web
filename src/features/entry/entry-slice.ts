import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { PagedResult } from "../../app/types";
import { entryApi } from "./entry-api";
import { EntriesFilter, EntryListItem } from "./types";

export interface EntryState {
    entryFilter: EntriesFilter;
    entries: PagedResult<EntryListItem>;
}

const initialState: EntryState = {
    entryFilter: {
        customerId: '',
        productId: '',
        active: true,
        entryNo: '',
        toBondNo: '',
        from: '',
        to: '',
        page: 1,
        pageSize: 100
    },
    entries: { items: [], total: 0 }
};

export const searchEntriesAsync = createAsyncThunk(
    'entry/search',
    async (filter: EntriesFilter) => {
        return await entryApi.searchEntries(filter);
    }
);

export const entrySlice = createSlice({
    name: 'entry',
    initialState,
    reducers: {
        changeEntryFilter: (state, action: PayloadAction<any>) => {
            state.entryFilter = { ...state.entryFilter, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(searchEntriesAsync.fulfilled, (state, action) => {
            state.entries = action.payload
        })
    }
});

export const { changeEntryFilter } = entrySlice.actions;

export const entryFilterSelector = (state: RootState) => state.entry.entryFilter;
export const entriesSelector = (state: RootState) => state.entry.entries;

export default entrySlice.reducer;