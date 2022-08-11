import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import coreReducer from './core-slice';
import customerReducer from '../features/customer/customer-slice';

export const store = configureStore({
  reducer: {
    core: coreReducer,
    customer: customerReducer,
    counter: counterReducer,    
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
