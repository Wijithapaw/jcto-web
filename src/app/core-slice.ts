import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { SapNotification, User } from "./types";

export interface CoreState {
  user?: User;
  globalError?: string;
  notifications: SapNotification[];
}

const initialState: CoreState = { notifications: [] }

export const coreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    setGlobalError: (state, action: PayloadAction<string>) => {
      state.globalError = action.payload;
    },
    showToast: (state, action: PayloadAction<SapNotification>) => {
      state.notifications.push(action.payload);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    dismissToast: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id == action.payload);
      state.notifications.splice(index, 1);
    }
  }
});

export const { setGlobalError, dismissToast, showToast } = coreSlice.actions;

export const globalErrorSelector = (state: RootState) => state.core.globalError;
export const notificationSelector = (state: RootState) => state.core.notifications;
export const authUserSelector = (state: RootState) => state.core.user;

export default coreSlice.reducer;