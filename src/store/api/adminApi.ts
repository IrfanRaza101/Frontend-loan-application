import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

// Get API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL_PRODUCTION || import.meta.env.VITE_API_URL || 'https://backend-loan-application.vercel.app';

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/api/admin`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('content-type', 'application/json');
    return headers;
  },
});

export interface AdminStats {
  totalUsers: number;
  totalLoans: number;
  totalAmount: number;
  pendingLoans: number;
  approvedLoans: number;
  rejectedLoans: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended' | 'deleted';
  createdAt: string;
  totalLoans: number;
  totalBorrowed: number;
}

export interface AdminLoan {
  _id: string;
  amount: number;
  term: number;
  purpose: string;
  loanType: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface AdminLoansResponse {
  loans: AdminLoan[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface UpdateLoanStatusRequest {
  loanId: string;
  status: 'approved' | 'rejected';
}

export interface UpdateUserStatusRequest {
  userId: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface AnalyticsData {
  statusDistribution: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  monthlyApplications: Array<{
    _id: { year: number; month: number };
    count: number;
    totalAmount: number;
  }>;
  loanTypeDistribution: Array<{
    _id: string;
    count: number;
    totalAmount: number;
    avgAmount: number;
  }>;
}

export interface ReportParams {
  type: 'loans' | 'users' | 'financial';
  startDate?: string;
  endDate?: string;
}

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery,
  tagTypes: ['AdminStats', 'AdminLoans', 'AdminUsers', 'Analytics'],
  endpoints: (builder) => ({
    // Get admin dashboard stats
    getAdminStats: builder.query<AdminStats, void>({
      query: () => '/stats',
      providesTags: ['AdminStats'],
    }),
    
    // Get all loans for admin
    getAdminLoans: builder.query<AdminLoansResponse, { page?: number; limit?: number; status?: string; search?: string }>({
      query: (params = {}) => ({
        url: '/loans',
        params,
      }),
      providesTags: ['AdminLoans'],
    }),
    
    // Update loan status
    updateLoanStatus: builder.mutation<{ success: boolean; message: string }, UpdateLoanStatusRequest>({
      query: ({ loanId, status }) => ({
        url: `/loans/${loanId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['AdminLoans', 'AdminStats'],
    }),
    
    // Get all users for admin
    getAdminUsers: builder.query<AdminUsersResponse, { page?: number; limit?: number; status?: string; search?: string }>({
      query: (params = {}) => ({
        url: '/users',
        params,
      }),
      providesTags: ['AdminUsers'],
    }),
    
    // Update user status
    updateUserStatus: builder.mutation<{ success: boolean; message: string }, UpdateUserStatusRequest>({
      query: ({ userId, status }) => ({
        url: `/users/${userId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['AdminUsers', 'AdminStats'],
    }),
    
    // Delete user
    deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminUsers', 'AdminStats'],
    }),
    
    // Get analytics data
    getAnalytics: builder.query<AnalyticsData, void>({
      query: () => '/analytics',
      providesTags: ['Analytics'],
    }),
    
    // Generate reports
    generateReport: builder.query<any, ReportParams>({
      query: ({ type, ...params }) => ({
        url: `/reports/${type}`,
        params,
      }),
    }),
    
    // Get user details for admin
    getUserDetails: builder.query<AdminUser, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'AdminUsers', id: userId }],
    }),
    
    // Get loan details for admin
    getLoanDetails: builder.query<AdminLoan, string>({
      query: (loanId) => `/loans/${loanId}`,
      providesTags: (result, error, loanId) => [{ type: 'AdminLoans', id: loanId }],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAdminLoansQuery,
  useUpdateLoanStatusMutation,
  useGetAdminUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useGetAnalyticsQuery,
  useGenerateReportQuery,
  useLazyGenerateReportQuery,
  useGetUserDetailsQuery,
  useGetLoanDetailsQuery,
} = adminApi;