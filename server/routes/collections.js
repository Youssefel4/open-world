import express from 'express';
import {
    createCollection,
    getCollections,
    getCollection,
    updateCollection,
    deleteCollection,
    addImageToCollection,
    removeImageFromCollection,
} from '../controllers/collectionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createCollection);
router.get('/', protect, getCollections);
router.get('/:id', getCollection);
router.patch('/:id', protect, updateCollection);
router.delete('/:id', protect, deleteCollection);
router.post('/:id/images', protect, addImageToCollection);
router.delete('/:id/images/:imageId', protect, removeImageFromCollection);

export default router;
