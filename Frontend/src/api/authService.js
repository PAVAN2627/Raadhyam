/**
 * Auth Service
 * 
 * API endpoints for authentication:
 * - POST /api/auth/register - Register new user
 * - POST /api/auth/login - Login user
 * - POST /api/auth/forgot-password - Request password reset
 * - POST /api/auth/reset-password - Reset password
 * - GET /api/auth/check-auth - Check authentication status
 * 
 * All requests require JWT token in Authorization header when applicable
 */

import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api/auth',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Register a new user
 * @param {Object} userData - User data (name, email, password)
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return {
      success: true,
      message: response.data.message || 'User registered successfully'
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed',
      field: error.response?.data?.field
    };
  }
};

/**
 * Login user
 * @param {Object} credentials - Login credentials (email, password)
 * @returns {Promise<{success: boolean, token?: string, user?: Object, message?: string}>}
 */
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    if (response.data.success) {
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return {
        success: true,
        token: response.data.token,
        user: response.data.user
      };
    }
    return {
      success: false,
      message: response.data.message || 'Login failed'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed'
    };
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgot-password', { email });
    return {
      success: true,
      message: response.data.message || 'Password reset link sent if email exists',
      resetToken: response.data.resetToken // Only in development
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send reset link'
    };
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} email - User email
 * @param {string} newPassword - New password
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const resetPassword = async (token, email, newPassword) => {
  try {
    const response = await api.post('/reset-password', { token, email, newPassword });
    return {
      success: true,
      message: response.data.message || 'Password reset successful'
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to reset password'
    };
  }
};

/**
 * Check authentication status
 * @returns {Promise<{success: boolean, authenticated?: boolean, user?: Object}>}
 */
export const checkAuth = async () => {
  try {
    const response = await api.get('/check-auth');
    return {
      success: true,
      authenticated: response.data.authenticated,
      user: response.data.user
    };
  } catch (error) {
    console.error('Check auth error:', error);
    return {
      success: false,
      authenticated: false
    };
  }
};

/**
 * Logout user - clears local storage
 */
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
};

/**
 * Get current user from localStorage
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  return !!token;
};

export default {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  checkAuth,
  logoutUser,
  getCurrentUser,
  isLoggedIn
};
