import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { OrdersFilter, OrderStatus } from "./types";

export interface OrderState {
    ordeFilter: OrdersFilter
}

const initialState: OrderState = {
    ordeFilter: {
        customerId: '',
        productId: '',
        from: '',
        to: '',
        orderNo: '',
    }
};

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        changeOrderFilter: (state, action: PayloadAction<any>) => {
            state.ordeFilter = { ...state.ordeFilter, ...action.payload };
        },
    },
    extraReducers: (builder) => {
    }
});

export const { changeOrderFilter }  = orderSlice.actions;

export const orderFilterSelector = (state: RootState) => state.order.ordeFilter;

export default orderSlice.reducer;