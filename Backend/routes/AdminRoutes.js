import express from 'express';
import upload from '../middlewares/Upload.js';
import verifyToken from '../middlewares/AuthmiddleWare.js';
import isAdmin from '../middlewares/isAdmin.js';
import {
  createCourse,
  updateCourse,
  getAllCoursesAdmin,
  deleteCourseAdmin,
  getCourseByIdAdmin,
  generateCourseSlug,
  validateCourse,
  uploadFile,
  getAllMusicNotes,
  createMusicNote,
  updateMusicNote,
  deleteMusicNote,
  getMusicNoteById,
  uploadThumbnail,
  getDashboardStats,
  getAllUsersAdmin,
  createUser,
  getUserByIdAdmin,
  updateUser,
  deleteUser,
  updateUserStatus
} from '../controllers/AdminController.js';


const router = express.Router();

// All admin routes require both verifyToken and isAdmin middleware
// verifyToken: verifies user is authenticated
// isAdmin: verifies user has admin role

router.get('/admin/dashboard/stats', verifyToken, isAdmin, getDashboardStats);

router.post('/admin/courses', verifyToken, isAdmin, createCourse);
router.get('/admin/courses', verifyToken, isAdmin, getAllCoursesAdmin);
router.get('/admin/courses/:id', verifyToken, isAdmin, getCourseByIdAdmin);
router.put('/admin/courses/:id', verifyToken, isAdmin, updateCourse);
router.delete('/admin/courses/:id', verifyToken, isAdmin, deleteCourseAdmin);
router.post('/admin/courses/generate-slug', verifyToken, isAdmin, generateCourseSlug);
router.post('/admin/courses/validate', verifyToken, isAdmin, validateCourse);

router.post('/admin/upload', verifyToken, isAdmin, upload.single('file'), uploadFile);
router.post('/admin/upload/thumbnail', verifyToken, isAdmin, upload.single('thumbnail'), uploadThumbnail);
router.get('/admin/music-notes', verifyToken, isAdmin, getAllMusicNotes);
router.post('/admin/music-notes', verifyToken, isAdmin, createMusicNote);
router.get('/admin/music-notes/:id', verifyToken, isAdmin, getMusicNoteById);
router.put('/admin/music-notes/:id', verifyToken, isAdmin, updateMusicNote);
router.delete('/admin/music-notes/:id', verifyToken, isAdmin, deleteMusicNote);

router.get('/admin/users', verifyToken, isAdmin, getAllUsersAdmin);
router.post('/admin/users', verifyToken, isAdmin, createUser);
router.get('/admin/users/:id', verifyToken, isAdmin, getUserByIdAdmin);
router.put('/admin/users/:id', verifyToken, isAdmin, updateUser);
router.delete('/admin/users/:id', verifyToken, isAdmin, deleteUser);
router.put('/admin/users/:id/status', verifyToken, isAdmin, updateUserStatus);


export default router;