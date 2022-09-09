import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import coreReducer from './core-slice';
import customerReducer from '../features/customer/customer-slice';
import entryReducer from '../features/entry/entry-slice';
import orderReducer from '../features/order/order-slice';
import stockReducer from '../features/stock/stock-slice';

export const store = configureStore({
  reducer: {
    core: coreReducer,
    customer: customerReducer,
    counter: counterReducer,    
    entry: entryReducer,
    order: orderReducer,
    stock: stockReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
