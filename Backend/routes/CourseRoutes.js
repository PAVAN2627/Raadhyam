/**
 * Course Routes
 * 
 * Endpoints:
 * - GET /api/courses - Get all courses (public - no auth required)
 * - GET /api/courses/:id - Get course by ID (public - no auth required)
 * - POST /api/courses - Create course (admin only)
 * - PUT /api/courses/:id - Update course (admin only)
 * - DELETE /api/courses/:id - Delete course (admin only)
 * 
 * Protection:
 * - GET routes are public (no middleware)
 * - POST, PUT, DELETE routes require both verifyToken and isAdmin middleware
 */

import express from 'express';
import verifyToken from '../middlewares/AuthmiddleWare.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

// GET /api/courses - Get all courses (public)
router.get('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Course listing endpoint not implemented yet'
  });
});

// GET /api/courses/:id - Get course by ID (public)
router.get('/:id', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Get course by ID endpoint not implemented yet'
  });
});

// POST /api/courses - Create course (admin only)
router.post('/', verifyToken, isAdmin, (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Course creation endpoint not implemented yet'
  });
});

// PUT /api/courses/:id - Update course (admin only)
router.put('/:id', verifyToken, isAdmin, (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Course update endpoint not implemented yet'
  });
});

// DELETE /api/courses/:id - Delete course (admin only)
router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Course deletion endpoint not implemented yet'
  });
});

export default router;
