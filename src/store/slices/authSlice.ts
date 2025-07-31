import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: false,
  error: null,
};

// Load initial state from localStorage
const loadInitialState = (): AuthState => {
  try {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedIsAdmin = localStorage.getItem('isAdmin');
    
    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      return {
        ...initialState,
        user,
        token: storedToken,
        isAuthenticated: true,
        isAdmin: storedIsAdmin === 'true' || user.isAdmin || false,
      };
    }
  } catch (error) {
    console.error('Error loading auth state from localStorage:', error);
  }
  
  return initialState;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.user.isAdmin || false;
      state.isLoading = false;
      state.error = null;
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
      if (action.payload.user.isAdmin) {
        localStorage.setItem('isAdmin', 'true');
      }
    },
    adminLoginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = { ...action.payload.user, isAdmin: true };
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isAdmin = true;
      state.isLoading = false;
      state.error = null;
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify({ ...action.payload.user, isAdmin: true }));
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('isAdmin', 'true');
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.isLoading = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('loanApplications');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const {
  setLoading,
  setError,
  loginSuccess,
  adminLoginSuccess,
  logout,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;