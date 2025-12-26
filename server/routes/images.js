import express from 'express';
import {
    uploadImage,
    getImages,
    getImage,
    updateImage,
    deleteImage,
    toggleLike,
    toggleSave,
    addComment,
    deleteComment,
} from '../controllers/imageController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getImages);
router.get('/:id', getImage);

// Protected routes
router.post('/upload', protect, upload.single('image'), uploadImage);
router.patch('/:id', protect, updateImage);
router.delete('/:id', protect, deleteImage);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/save', protect, toggleSave);
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

export default router;
