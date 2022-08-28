import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { PagedResult } from "../../app/types";
import { orderApi } from "./order-api";
import { OrderListItem, OrdersFilter, OrderStatus } from "./types";

export interface OrderState {
    orderFilter: OrdersFilter;
    orders: PagedResult<OrderListItem>;
}

const initialState: OrderState = {
    orderFilter: {
        customerId: '',
        productId: '',
        from: '',
        to: '',
        orderNo: '',
        page: 1,
        pageSize: 10,
    },
    orders: { total: 0, items: [] }
};

export const searchOrdersAsync = createAsyncThunk(
    'order/search',
    async (filter: OrdersFilter) => {
        return await orderApi.searchOrder(filter);
    }
);

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        changeOrderFilter: (state, action: PayloadAction<any>) => {
            state.orderFilter = { ...state.orderFilter, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(searchOrdersAsync.fulfilled, (state, action) => {
            state.orders = action.payload;
        })
    }
});

export const { changeOrderFilter } = orderSlice.actions;

export const orderFilterSelector = (state: RootState) => state.order.orderFilter;
export const ordersSelector = (state: RootState) => state.order.orders;

export default orderSlice.reducer;