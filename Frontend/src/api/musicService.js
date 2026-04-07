/**
 * Music Service
 * 
 * API endpoints for music management:
 * - GET /api/music - List all public music (no auth required)
 * - GET /api/music/:id - Get single music by ID (no auth required)
 * - POST /api/music - Create new music entry (admin only, requires auth)
 * - DELETE /api/music/:id - Delete music entry (admin only, requires auth)
 * 
 * Note: File upload is handled separately via /api/upload endpoint.
 * The create flow expects a pre-uploaded file URL to be passed in.
 * 
 * All admin requests require JWT token in Authorization header
 */

import axios from 'axios';

// Get auth token - checks both token and authToken for compatibility
const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('authToken');
};

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api/music',
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
 * Get all public music entries
 * Public endpoint - accessible without authentication
 * @param {Object} options - Pagination and filtering options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 20)
 * @returns {Promise<{success: boolean, data?: Array, pagination?: Object, message?: string}>}
 */
export const getAllMusic = async (options = {}) => {
  try {
    const { page = 1, limit = 20 } = options;
    
    const response = await api.get('', {
      params: { page, limit }
    });
    
    return {
      success: true,
      data: response.data.data || [],
      pagination: response.data.pagination || {
        currentPage: page,
        totalPages: 1,
        totalItems: 0
      }
    };
  } catch (error) {
    console.error('Error fetching music:', error);
    return {
      success: false,
      data: [],
      pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
      message: error.response?.data?.message || 'Failed to fetch music'
    };
  }
};

/**
 * Get single music entry by ID
 * Public endpoint - accessible without authentication
 * @param {string} id - Music ID
 * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
 */
export const getMusicById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching music by ID:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Music not found'
    };
  }
};

/**
 * Create new music entry
 * Admin only endpoint - requires authentication
 * 
 * IMPORTANT: This expects a pre-uploaded file URL. The file upload
 * should be handled separately via /api/upload endpoint first,
 * then the returned URL should be passed to this function.
 * 
 * @param {Object} musicData - Music metadata
 * @param {string} musicData.title - Song title (required)
 * @param {string} musicData.artist - Artist name (required)
 * @param {string} musicData.fileUrl - Pre-uploaded audio file URL (required)
 * @param {string} musicData.publicId - Cloudinary public ID (optional)
 * @param {string} musicData.thumbnailUrl - Album art URL (optional)
 * @param {string} musicData.album - Album name (optional)
 * @param {string} musicData.genre - Genre (optional)
 * @param {number} musicData.duration - Duration in seconds (optional)
 * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
 */
export const createMusic = async (musicData) => {
  try {
    const response = await api.post('', musicData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Music created successfully'
    };
  } catch (error) {
    console.error('Error creating music:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Failed to create music',
      missing: error.response?.data?.missing || []
    };
  }
};

/**
 * Delete music entry
 * Admin only endpoint - requires authentication
 * @param {string} id - Music ID to delete
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const deleteMusic = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return {
      success: true,
      message: response.data.message || 'Music deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting music:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete music'
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

/**
 * Format duration from seconds to MM:SS
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  if (!seconds || typeof seconds !== 'number') return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default {
  getAllMusic,
  getMusicById,
  createMusic,
  deleteMusic,
  isAdmin,
  formatDuration
};