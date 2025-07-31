import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
  modals: {
    isPaymentDialogOpen: boolean;
    isLoanApplicationDialogOpen: boolean;
    isDeleteConfirmationOpen: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
}

const initialState: UIState = {
  isLoading: false,
  notifications: [],
  modals: {
    isPaymentDialogOpen: false,
    isLoanApplicationDialogOpen: false,
    isDeleteConfirmationOpen: false,
  },
  theme: 'system',
  sidebarCollapsed: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id' | 'timestamp'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setModalOpen: (state, action: PayloadAction<{ modal: keyof UIState['modals']; isOpen: boolean }>) => {
      state.modals[action.payload.modal] = action.payload.isOpen;
    },
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
  },
});

export const {
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  setModalOpen,
  setTheme,
  toggleSidebar,
  setSidebarCollapsed,
} = uiSlice.actions;

export default uiSlice.reducer;