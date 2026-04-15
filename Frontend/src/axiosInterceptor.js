import axios from "axios";

// ============================================
// Axios Configuration
// ============================================

// Base URL Configuration
// In production, use environment variable or absolute URL
const getBaseURL = () => {
  // Check for Vite environment variable (browser environment)
  if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Development: localhost with specific ports
  if (window.location.origin.includes('localhost')) {
    return ''; // Relative path uses Vite proxy to avoid CORS issues
  }

  // Production: use the current origin
  return window.location.origin;
};

// Set base URL for all axios requests
axios.defaults.baseURL = getBaseURL();
axios.defaults.withCredentials = true; // Enable cookies
axios.defaults.headers.common['Content-Type'] = 'application/json';

console.log(`🔗 API Base URL: ${axios.defaults.baseURL}`);

// ============================================
// Request Interceptor
// ============================================

axios.interceptors.request.use(
  (config) => {
    // Add token to request headers if it exists
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// Response Interceptor
// ============================================

axios.interceptors.response.use(
  (response) => {
    // Success response
    return response;
  },
  (error) => {
    const errorData = error.response?.data || {};
    const errorMessage = errorData?.message || error.message || 'An error occurred';
    const errorCode = errorData?.code || 'UNKNOWN_ERROR';

    console.error(`❌ API Error [${errorCode}]: ${errorMessage}`);

    // Handle specific error scenarios
    if (error.response && error.response.status === 401) {
      // Unauthorized - check if it's a session expired error
      if (
        errorMessage === "Another device logged in, session expired" ||
        errorCode === "SESSION_EXPIRED" ||
        errorCode === "TOKEN_EXPIRED"
      ) {
        console.warn('⚠️  Session expired - logging out user');

        // Clear token from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("userData");

        // Clear cookies
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Redirect to login
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Regular 401 - might be invalid token
      if (errorCode === "INVALID_TOKEN" || errorCode === "AUTH_REQUIRED") {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        // Only redirect if not already on login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }

    // Handle rate limiting
    if (error.response && error.response.status === 429) {
      console.warn('⚠️  Rate limit exceeded - please try again later');
      alert('Too many requests. Please try again later.');
    }

    // Handle server errors
    if (error.response && error.response.status >= 500) {
      console.error('❌ Server error:', error.response.status);
      alert('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default axios;

