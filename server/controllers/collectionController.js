import Collection from '../models/Collection.js';

// @desc    Create new collection
// @route   POST /api/collections
// @access  Private
export const createCollection = async (req, res) => {
    try {
        const { title, description, isPrivate } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a title',
            });
        }

        const collection = await Collection.create({
            title,
            description,
            isPrivate: isPrivate || false,
            user: req.user._id,
        });

        await collection.populate('user', 'name email profileImage');

        res.status(201).json({
            success: true,
            data: collection,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get user's collections
// @route   GET /api/collections
// @access  Private
export const getCollections = async (req, res) => {
    try {
        const userId = req.query.user || req.user._id;

        // If requesting another user's collections, only show public ones
        let query = { user: userId };
        if (userId !== req.user._id.toString()) {
            query.isPrivate = false;
        }

        const collections = await Collection.find(query)
            .populate('user', 'name email profileImage')
            .populate('images', 'imageUrl title')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: collections.length,
            data: collections,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get single collection
// @route   GET /api/collections/:id
// @access  Public
export const getCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id)
            .populate('user', 'name email profileImage')
            .populate({
                path: 'images',
                populate: {
                    path: 'uploadedBy',
                    select: 'name profileImage',
                },
            });

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: 'Collection not found',
            });
        }

        // Check if private and not owner
        if (
            collection.isPrivate &&
            (!req.user || collection.user._id.toString() !== req.user._id.toString())
        ) {
            return res.status(403).json({
                success: false,
                message: 'This collection is private',
            });
        }

        res.status(200).json({
            success: true,
            data: collection,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update collection
// @route   PATCH /api/collections/:id
// @access  Private
export const updateCollection = async (req, res) => {
    try {
        let collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: 'Collection not found',
            });
        }

        // Check ownership
        if (collection.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this collection',
            });
        }

        const { title, description, isPrivate } = req.body;

        collection = await Collection.findByIdAndUpdate(
            req.params.id,
            {
                title: title || collection.title,
                description: description !== undefined ? description : collection.description,
                isPrivate: isPrivate !== undefined ? isPrivate : collection.isPrivate,
            },
            { new: true, runValidators: true }
        ).populate('user', 'name email profileImage');

        res.status(200).json({
            success: true,
            data: collection,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private
export const deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: 'Collection not found',
            });
        }

        // Check ownership
        if (collection.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this collection',
            });
        }

        await collection.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Collection deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Add image to collection
// @route   POST /api/collections/:id/images
// @access  Private
export const addImageToCollection = async (req, res) => {
    try {
        const { imageId } = req.body;

        if (!imageId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an image ID',
            });
        }

        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: 'Collection not found',
            });
        }

        // Check ownership
        if (collection.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to modify this collection',
            });
        }

        // Check if image already in collection
        if (collection.images.includes(imageId)) {
            return res.status(400).json({
                success: false,
                message: 'Image already in collection',
            });
        }

        collection.images.push(imageId);
        await collection.save();

        await collection.populate('images', 'imageUrl title');

        res.status(200).json({
            success: true,
            data: collection,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Remove image from collection
// @route   DELETE /api/collections/:id/images/:imageId
// @access  Private
export const removeImageFromCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: 'Collection not found',
            });
        }

        // Check ownership
        if (collection.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to modify this collection',
            });
        }

        const index = collection.images.indexOf(req.params.imageId);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Image not found in collection',
            });
        }

        collection.images.splice(index, 1);
        await collection.save();

        res.status(200).json({
            success: true,
            message: 'Image removed from collection',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
