import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ListItem } from "../../app/types";
import { customerApi } from "./customer-api";
import { CustomerStocks } from "./types";

export interface CustomerState {
    customerStocks: CustomerStocks[];
    customerListItems: ListItem[];
}

//TODO: Delete this once finalized
const customerStocks: CustomerStocks[] = [
    {
        customerId: 'customer-1',
        customerName: 'JKCS',
        stocks: [
            {
                productCode: 'GO',
                remainingStock: 1000,
                undeliveredStock: 100
            },
            {
                productCode: '380_LSFO',
                remainingStock: 2000,
                undeliveredStock: 200
            },
            {
                productCode: '380_HSFO',
                remainingStock: 100,
                undeliveredStock: 0
            }
        ]
    },
    {
        customerId: 'customer-2',
        customerName: 'ABC',
        stocks: [
            {
                productCode: 'GO',
                remainingStock: 450,
                undeliveredStock: 20
            },
            {
                productCode: '380_LSFO',
                remainingStock: 360,
                undeliveredStock: 20.54
            },
            {
                productCode: '380_HSFO',
                remainingStock: 100,
                undeliveredStock: 500.50
            }
        ]
    },
    {
        customerId: 'customer-3',
        customerName: 'XYZ',
        stocks: [
            {
                productCode: 'GO',
                remainingStock: 752.257,
                undeliveredStock: 56.458
            },
            {
                productCode: '380_LSFO',
                remainingStock: 52.69,
                undeliveredStock: 855.58
            },
            {
                productCode: '380_HSFO',
                remainingStock: 100,
                undeliveredStock: 500
            }
        ]
    }

];

const initialState: CustomerState = { customerStocks: [], customerListItems: [] };

export const getCustomerStocksAsync = createAsyncThunk(
    'customer/stocks',
    async () => {
        return await customerApi.getCustomerStocks();
    }
);

export const getCustomerListItemsAsync = createAsyncThunk(
    'customer/listitems',
    async () => {
        return await customerApi.getCustomerListItems();
    }
);

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCustomerStocksAsync.fulfilled, (state, action) => {
            state.customerStocks = action.payload
        }).addCase(getCustomerListItemsAsync.fulfilled, (state, action) => {
            state.customerListItems = action.payload
        })
    }
});

export const { } = customerSlice.actions;

export const customerStocksSelector = (state: RootState) => state.customer.customerStocks;
export const customerListItemsSelector = (state: RootState) => state.customer.customerListItems;

export default customerSlice.reducer;