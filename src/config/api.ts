// Environment configuration utility
export const getApiUrl = () => {
  // Check if we're in production
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL_PRODUCTION || 'https://your-backend-app.vercel.app';
  }
  
  // Development environment
  return import.meta.env.VITE_API_URL || 'http://localhost:3001';
};

export const API_BASE_URL = getApiUrl();