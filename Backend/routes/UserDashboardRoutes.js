/**
 * User Dashboard Routes - Authenticated user operations
 * 
 * Endpoints:
 * - GET /api/user/courses - Get user's enrolled courses
 * - POST /api/user/notes - Create user note
 * - GET /api/user/notes/:id - Get specific note
 * 
 * Protection:
 * - All routes require verifyToken middleware (authenticated user only)
 * - No admin role required - any authenticated user can access
 */

import express from 'express';
import verifyToken from '../middlewares/AuthmiddleWare.js';

const router = express.Router();

// GET /api/user/courses - Get user's enrolled courses (requires auth)
router.get('/courses', verifyToken, (req, res) => {
  res.status(501).json({
    success: false,
    message: 'User courses endpoint not implemented yet'
  });
});

// POST /api/user/notes - Create user note (requires auth)
router.post('/notes', verifyToken, (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Create note endpoint not implemented yet'
  });
});

// GET /api/user/notes/:id - Get specific note (requires auth)
router.get('/notes/:id', verifyToken, (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Get note endpoint not implemented yet'
  });
});

export default router;
