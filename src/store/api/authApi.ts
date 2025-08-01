import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

// Get API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL_PRODUCTION || import.meta.env.VITE_API_URL || 'https://backend-loan-application.vercel.app';

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/api/auth`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('content-type', 'application/json');
    return headers;
  },
});

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginRequest {
  email: string;
  secretKey: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    isAdmin?: boolean;
  };
  token: string;
  message?: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    adminLogin: builder.mutation<AuthResponse, AdminLoginRequest>({
      query: (credentials) => ({
        url: '/admin-login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/signup',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    
    verifyToken: builder.query<AuthResponse, void>({
      query: () => '/verify',
      providesTags: ['Auth'],
    }),
    
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useAdminLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useVerifyTokenQuery,
  useRefreshTokenMutation,
} = authApi;