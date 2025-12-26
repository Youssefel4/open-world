import express from 'express';
import {
    getUsers,
    getUser,
    deleteUser,
    getUserImages,
    getUserSavedImages,
    updateProfile,
    uploadProfileImage,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Admin routes
router.get('/', protect, adminOnly, getUsers);
router.delete('/:id', protect, adminOnly, deleteUser);

// Public routes
router.get('/:id', getUser);
router.get('/:id/images', getUserImages);

// Private routes
router.get('/:id/saved', protect, getUserSavedImages);
router.patch('/profile', protect, updateProfile);
router.post('/profile/image', protect, upload.single('image'), uploadProfileImage);

export default router;
