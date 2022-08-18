import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { EntriesFilter } from "./types";

export interface EntryState {
    entryFilter: EntriesFilter
}

const initialState: EntryState = {
    entryFilter: {
        customerId: ''
    }
};

export const entrySlice = createSlice({
    name: 'entry',
    initialState,
    reducers: {
        changeEntryFilter: (state, action: PayloadAction<any>) => {
            state.entryFilter = { ...state.entryFilter, ...action.payload };
        },
    },
    extraReducers: (builder) => {
    }
});

export const { changeEntryFilter }  = entrySlice.actions;

export const entryFilterSelector = (state: RootState) => state.entry.entryFilter;

export default entrySlice.reducer;