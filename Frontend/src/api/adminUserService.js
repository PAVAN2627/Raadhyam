/**
 * Admin User Management Service
 * 
 * API endpoints for admin user management:
 * - GET /api/users - List all users (admin only)
 * - POST /api/users - Create new user (admin only)
 * - DELETE /api/users/:id - Delete user (admin only)
 * 
 * All requests require admin token in Authorization header
 */

import axios from 'axios';

// Get auth token - checks both token and authToken for compatibility
const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('authToken');
};

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api/users',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add admin token to all requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Get all users with optional filters
 * @param {Object} filters - Optional filters (search, role, status, plan)
 * @returns {Promise<{success: boolean, users: Array, count: number}>}
 */
export const getUsers = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);
    if (filters.plan) params.append('plan', filters.plan);
    
    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : '';
    
    const response = await api.get(url);
    return {
      success: true,
      users: response.data.users || [],
      count: response.data.count || 0
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      users: [],
      count: 0,
      message: error.response?.data?.message || 'Failed to fetch users'
    };
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data (username, email, password required)
 * @returns {Promise<{success: boolean, user?: Object, message?: string}>}
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post('', userData);
    return {
      success: true,
      user: response.data.user,
      message: response.data.message || 'User created successfully'
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create user'
    };
  }
};

/**
 * Delete a user (soft delete)
 * @param {string} userId - User ID to delete
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/${userId}`);
    return {
      success: true,
      message: response.data.message || 'User deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete user'
    };
  }
};

/**
 * Check if current user is an admin
 * @returns {boolean}
 */
export const isAdmin = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Decode JWT to check role (simple base64 decode)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export default {
  getUsers,
  createUser,
  deleteUser,
  isAdmin
};
