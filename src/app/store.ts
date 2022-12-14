import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import coreReducer from './core-slice';
import customerReducer from '../features/customer/customer-slice';
import entryReducer from '../features/entry/entry-slice';
import orderReducer from '../features/order/order-slice';

export const store = configureStore({
  reducer: {
    core: coreReducer,
    customer: customerReducer,
    entry: entryReducer,
    order: orderReducer,
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
