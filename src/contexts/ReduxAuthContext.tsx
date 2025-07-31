import React, { createContext, useContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  useLoginMutation, 
  useAdminLoginMutation, 
  useRegisterMutation,
  useLogoutMutation 
} from '@/store/api/authApi';
import { 
  useApplyForLoanMutation, 
  useGetLoanStatusQuery 
} from '@/store/api/loanApi';
import { 
  loginSuccess, 
  adminLoginSuccess, 
  logout as logoutAction,
  setLoading,
  setError 
} from '@/store/slices/authSlice';
import { addNotification } from '@/store/slices/uiSlice';

interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  isAdmin?: boolean;
}

interface LoanApplication {
  loanType: string;
  type: string;
  _id: string;
  id: string;
  amount: number;
  term: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  userId: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, secretKey: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>; // name is full name for backward compatibility
  logout: () => void;
  loanApplications: LoanApplication[];
  submitLoanApplication: (data: { amount: number; term: number; purpose: string; loanType?: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isAdmin, isLoading } = useAppSelector((state) => state.auth);
  
  // RTK Query hooks
  const [loginMutation] = useLoginMutation();
  const [adminLoginMutation] = useAdminLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const [applyForLoanMutation] = useApplyForLoanMutation();
  
  // Get loan applications using RTK Query
  const { data: loanStatusData, refetch: refetchLoans } = useGetLoanStatusQuery(undefined, {
    skip: !isAuthenticated,
  });

  const loanApplications = loanStatusData?.data || [];

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const result = await loginMutation({ email, password }).unwrap();
      
      if (result.success) {
        dispatch(loginSuccess({ user: result.user, token: result.token }));
        dispatch(addNotification({
          type: 'success',
          message: 'Login successful!'
        }));
        return true;
      }
      return false;
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error && typeof error === 'object' && 'data' in error && 
                           error.data && typeof error.data === 'object' && 'message' in error.data
                           ? (error.data as { message: string }).message 
                           : 'Login failed';
      dispatch(setError(errorMessage));
      
      // No fallback for production - each user should see only their own data
      dispatch(addNotification({
        type: 'error',
        message: errorMessage || 'Login failed. Please try again.'
      }));
      return false;
      
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const adminLogin = async (email: string, secretKey: string): Promise<boolean> => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const result = await adminLoginMutation({ email, secretKey }).unwrap();
      
      if (result.success) {
        dispatch(adminLoginSuccess({ user: result.user, token: result.token }));
        dispatch(addNotification({
          type: 'success',
          message: 'Admin login successful!'
        }));
        return true;
      }
      return false;
    } catch (error: unknown) {
      console.error('Admin login error:', error);
      const errorMessage = error && typeof error === 'object' && 'data' in error && 
                           error.data && typeof error.data === 'object' && 'message' in error.data
                           ? (error.data as { message: string }).message 
                           : 'Admin login failed';
      dispatch(setError(errorMessage));
      
      // No fallback for admin login - proper authentication required
      dispatch(addNotification({
        type: 'error',
        message: errorMessage || 'Admin login failed. Please check your credentials.'
      }));
      return false;
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const result = await registerMutation({ name, email, password }).unwrap();
      
      if (result.success) {
        dispatch(loginSuccess({ user: result.user, token: result.token }));
        dispatch(addNotification({
          type: 'success',
          message: 'Registration successful!'
        }));
        return true;
      }
      return false;
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error && typeof error === 'object' && 'data' in error && 
                           error.data && typeof error.data === 'object' && 'message' in error.data
                           ? (error.data as { message: string }).message 
                           : 'Registration failed';
      dispatch(setError(errorMessage));
      
      // Fallback: Create demo user for testing purposes
      if (name && email && password) {
        const demoUser = {
          id: `demo-${Date.now()}`,
          name: name,
          email: email
        };
        
        dispatch(loginSuccess({ 
          user: {
            id: demoUser.id,
            firstName: demoUser.name,
            email: demoUser.email
          },
          token: `demo-token-${Date.now()}` 
        }));
        
        dispatch(addNotification({
          type: 'info',
          message: 'Using demo mode - API not available'
        }));
        return true;
      }
      
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = () => {
    try {
      logoutMutation();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logoutAction());
      dispatch(addNotification({
        type: 'success',
        message: 'Logged out successfully'
      }));
    }
  };

  const submitLoanApplication = async (data: { amount: number; term: number; purpose: string; loanType?: string }): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      const result = await applyForLoanMutation({
        amount: data.amount,
        term: data.term,
        purpose: data.purpose,
        loanType: data.loanType || 'personal'
      }).unwrap();

      if (result.success) {
        // Refetch loan applications after successful submission
        refetchLoans();
        dispatch(addNotification({
          type: 'success',
          message: 'Loan application submitted successfully!'
        }));
        return true;
      }
      
      return false;
    } catch (error: unknown) {
      console.error('Loan application submission error:', error);
      
      // No fallback for loan application - proper API connection required
      const errorMessage = error && typeof error === 'object' && 'data' in error && 
                         error.data && typeof error.data === 'object' && 'message' in error.data
                         ? (error.data as { message: string }).message 
                         : 'Failed to submit loan application';
      
      dispatch(addNotification({
        type: 'error',
        message: errorMessage
      }));
      return false;
      
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    adminLogin,
    register,
    logout,
    loanApplications,
    submitLoanApplication
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};