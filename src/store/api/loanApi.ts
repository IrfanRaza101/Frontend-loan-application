import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

// Get API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Types
export interface LoanApplication {
  _id: string;
  userId: string;
  amount: number;
  purpose: string;
  income: number;
  employment: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  documents?: string[];
  loanType: string;
  duration: number;
  interestRate: number;
}

export interface LoanRequest {
  amount: number;
  term: number;
  purpose: string;
  loanType: string;
  monthlyIncome?: number;
  employmentStatus?: string;
}

export interface LoanResponse {
  success: boolean;
  message: string;
  data: LoanApplication;
}

export interface PaymentRequest {
  loanId: string;
  amount: number;
  paymentMethod: string;
}

export interface PaymentHistory {
  _id: string;
  loanId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: string;
}

export interface EMICalculation {
  monthlyEMI: number;
  totalAmount: number;
  totalInterest: number;
}

export interface LoanType {
  _id: string;
  name: string;
  interestRate: number;
  maxAmount: number;
  minDuration: number;
  maxDuration: number;
  description: string;
}

export interface Wallet {
  _id: string;
  userId: string;
  balance: number;
  transactions: Transaction[];
}

export interface Transaction {
  _id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface Installment {
  _id: string;
  loanId: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paidAt?: string;
}

export const loanApi = createApi({
  reducerPath: 'loanApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Loan', 'Payment', 'Wallet', 'Notification', 'Installment'],
  endpoints: (builder) => ({
    // Loan application endpoints
    applyForLoan: builder.mutation<LoanResponse, LoanRequest>({
      query: (loanData) => ({
        url: '/loan/apply',
        method: 'POST',
        body: loanData,
      }),
      invalidatesTags: ['Loan'],
    }),
    
    getLoanStatus: builder.query<{ success: boolean; data: LoanApplication[] }, void>({
      query: () => '/loan/status',
      providesTags: ['Loan'],
    }),
    
    getLoanDetails: builder.query<LoanApplication, string>({
      query: (loanId) => `/loan/${loanId}`,
      providesTags: ['Loan'],
    }),
    
    // Payment endpoints
    makePayment: builder.mutation<any, PaymentRequest>({
      query: (paymentData) => ({
        url: '/payments/make',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment', 'Wallet', 'Installment'],
    }),
    
    getPaymentHistory: builder.query<{ payments: PaymentHistory[] }, string>({
      query: (loanId) => `/payments/history/${loanId}`,
      providesTags: ['Payment'],
    }),
    
    // EMI calculation
    calculateEMI: builder.query<EMICalculation, { amount: number; rate: number; duration: number }>({
      query: ({ amount, rate, duration }) => 
        `/loan/calculate-emi?amount=${amount}&rate=${rate}&duration=${duration}`,
    }),
    
    // Loan types
    getLoanTypes: builder.query<{ loanTypes: LoanType[] }, void>({
      query: () => '/loan/types',
    }),

    // User dashboard endpoints
    getUserWallet: builder.query<{ data: Wallet }, void>({
      query: () => '/user/wallet',
      providesTags: ['Wallet'],
    }),

    getUserNotifications: builder.query<{ data: { notifications: Notification[]; unreadCount: number } }, { limit?: number }>({
      query: ({ limit = 5 } = {}) => `/user/notifications?limit=${limit}`,
      providesTags: ['Notification'],
    }),

    markNotificationAsRead: builder.mutation<any, string>({
      query: (notificationId) => ({
        url: `/user/notifications/${notificationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),

    deleteNotification: builder.mutation<any, string>({
      query: (notificationId) => ({
        url: `/user/notifications/${notificationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),

    getUserInstallments: builder.query<{ data: { installments: Installment[] } }, { limit?: number }>({
      query: ({ limit = 5 } = {}) => `/user/installments?limit=${limit}`,
      providesTags: ['Installment'],
    }),
  }),
});

export const {
  useApplyForLoanMutation,
  useGetLoanStatusQuery,
  useGetLoanDetailsQuery,
  useMakePaymentMutation,
  useGetPaymentHistoryQuery,
  useCalculateEMIQuery,
  useGetLoanTypesQuery,
  useGetUserWalletQuery,
  useGetUserNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
  useGetUserInstallmentsQuery,
} = loanApi;