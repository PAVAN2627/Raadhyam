/**
 * User Dashboard Service
 * 
 * API endpoints for authenticated user dashboard operations:
 * - GET /api/user/courses - Get user's enrolled courses
 * - POST /api/user/notes - Create a new note
 * - GET /api/user/notes/:id - Get a specific note by ID
 * 
 * All requests require JWT token in Authorization header
 * These endpoints are user-specific (not admin)
 */

import axios from 'axios';

// Create axios instance for user dashboard API
const api = axios.create({
  baseURL: '/api/user',
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
 * Get user's enrolled courses
 * @returns {Promise<{success: boolean, data?: Array, message?: string, error?: string}>}
 */
export const getUserCourses = async () => {
  try {
    const response = await api.get('/courses');
    return {
      success: true,
      data: response.data.data || [],
      message: response.data.message,
      count: response.data.count
    };
  } catch (error) {
    console.error('Error fetching user courses:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch enrolled courses',
      error: error.response?.data?.error || error.message
    };
  }
};

/**
 * Create a new note for a course
 * @param {Object} noteData - Note data
 * @param {string} noteData.courseId - Required: MongoDB course ID
 * @param {string} noteData.content - Required: Note content
 * @param {string} [noteData.title] - Optional: Note title
 * @returns {Promise<{success: boolean, data?: Object, message?: string, error?: string}>}
 */
export const createNote = async (noteData) => {
  try {
    const { courseId, content, title } = noteData;
    
    // Basic validation
    if (!courseId) {
      return {
        success: false,
        message: 'Course ID is required'
      };
    }
    
    if (!content) {
      return {
        success: false,
        message: 'Note content is required'
      };
    }

    const response = await api.post('/notes', { courseId, content, title });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Note created successfully'
    };
  } catch (error) {
    console.error('Error creating note:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create note',
      errors: error.response?.data?.errors,
      error: error.response?.data?.error || error.message
    };
  }
};

/**
 * Get a specific note by ID
 * @param {string} noteId - MongoDB note ID
 * @returns {Promise<{success: boolean, data?: Object, message?: string, error?: string}>}
 */
export const getNoteById = async (noteId) => {
  try {
    if (!noteId) {
      return {
        success: false,
        message: 'Note ID is required'
      };
    }

    const response = await api.get(`/notes/${noteId}`);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error fetching note:', error);
    
    // Handle specific error cases
    if (error.response?.status === 403) {
      return {
        success: false,
        message: 'Access denied. You do not have permission to view this note.',
        error: 'FORBIDDEN'
      };
    }
    
    if (error.response?.status === 404) {
      return {
        success: false,
        message: 'Note not found.',
        error: 'NOT_FOUND'
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch note',
      error: error.response?.data?.error || error.message
    };
  }
};

export default {
  getUserCourses,
  createNote,
  getNoteById
};
