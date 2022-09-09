import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { PagedResult } from "../../app/types";
import { stockApi } from "./stock-api";
import { DischargesFilter, StockDischargeListItem } from "./types";


export interface StockState {
    dischargesFilter: DischargesFilter;
    discharges: PagedResult<StockDischargeListItem>;
}

const initialState: StockState = {
    dischargesFilter: {
        customerId: '',
        productId: '',
        from: '',
        to: '',
        page: 1,
        pageSize: 100
    },
    discharges: { items: [], total: 0 }
};

export const searchDischargesAsync = createAsyncThunk(
    'stock/discharges/search',
    async (filter: DischargesFilter) => {
        return await stockApi.searchDischarges(filter);
    }
);


export const stockSlice = createSlice({
    name: 'stock',
    initialState,
    reducers: {
        changeDischargesFilter: (state, action: PayloadAction<any>) => {
            state.dischargesFilter = { ...state.dischargesFilter, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(searchDischargesAsync.fulfilled, (state, action) => {
            state.discharges = action.payload
        })
    }
});

export const { changeDischargesFilter } = stockSlice.actions;

export const dischargesFilterSelector = (state: RootState) => state.stock.dischargesFilter;
export const dischargesSelector = (state: RootState) => state.stock.discharges;

export default stockSlice.reducer;