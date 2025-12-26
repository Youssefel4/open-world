import Image from '../models/Image.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Upload new image
// @route   POST /api/images/upload
// @access  Private
export const uploadImage = async (req, res) => {
    try {
        const { title, description, tags } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image',
            });
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'openworld',
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        // Create image document
        const image = await Image.create({
            title,
            description,
            tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
            imageUrl: result.secure_url,
            cloudinaryId: result.public_id,
            uploadedBy: req.user._id,
        });

        // Populate user info
        await image.populate('uploadedBy', 'name email profileImage');

        res.status(201).json({
            success: true,
            data: image,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all images with pagination and filters
// @route   GET /api/images
// @access  Public
export const getImages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Build query
        let query = {};

        // Filter by tags
        if (req.query.tags) {
            const tags = req.query.tags.split(',');
            query.tags = { $in: tags };
        }

        // Search by text
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }

        // Filter by user
        if (req.query.user) {
            query.uploadedBy = req.query.user;
        }

        const images = await Image.find(query)
            .populate('uploadedBy', 'name email profileImage')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Image.countDocuments(query);

        res.status(200).json({
            success: true,
            count: images.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: images,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get single image
// @route   GET /api/images/:id
// @access  Public
export const getImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id)
            .populate('uploadedBy', 'name email profileImage')
            .populate('comments.user', 'name profileImage');

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found',
            });
        }

        res.status(200).json({
            success: true,
            data: image,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update image
// @route   PATCH /api/images/:id
// @access  Private
export const updateImage = async (req, res) => {
    try {
        let image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found',
            });
        }

        // Check ownership
        if (image.uploadedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this image',
            });
        }

        const { title, description, tags } = req.body;

        image = await Image.findByIdAndUpdate(
            req.params.id,
            {
                title: title || image.title,
                description: description || image.description,
                tags: tags ? tags.split(',').map((tag) => tag.trim()) : image.tags,
            },
            { new: true, runValidators: true }
        ).populate('uploadedBy', 'name email profileImage');

        res.status(200).json({
            success: true,
            data: image,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete image
// @route   DELETE /api/images/:id
// @access  Private
export const deleteImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found',
            });
        }

        // Check ownership or admin
        if (
            image.uploadedBy.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this image',
            });
        }

        // Delete from Cloudinary
        if (image.cloudinaryId) {
            await cloudinary.uploader.destroy(image.cloudinaryId);
        }

        await image.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Like/Unlike image
// @route   POST /api/images/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found',
            });
        }

        const index = image.likes.indexOf(req.user._id);

        if (index === -1) {
            // Like
            image.likes.push(req.user._id);
        } else {
            // Unlike
            image.likes.splice(index, 1);
        }

        await image.save();

        res.status(200).json({
            success: true,
            data: {
                likes: image.likes.length,
                isLiked: index === -1,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Save/Unsave image
// @route   POST /api/images/:id/save
// @access  Private
export const toggleSave = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found',
            });
        }

        const index = image.savedBy.indexOf(req.user._id);

        if (index === -1) {
            // Save
            image.savedBy.push(req.user._id);
        } else {
            // Unsave
            image.savedBy.splice(index, 1);
        }

        await image.save();

        res.status(200).json({
            success: true,
            data: {
                saves: image.savedBy.length,
                isSaved: index === -1,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Add comment to image
// @route   POST /api/images/:id/comments
// @access  Private
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'Please provide comment text',
            });
        }

        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found',
            });
        }

        image.comments.push({
            user: req.user._id,
            text,
        });

        await image.save();
        await image.populate('comments.user', 'name profileImage');

        res.status(201).json({
            success: true,
            data: image.comments[image.comments.length - 1],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete comment
// @route   DELETE /api/images/:id/comments/:commentId
// @access  Private
export const deleteComment = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found',
            });
        }

        const comment = image.comments.id(req.params.commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        // Check ownership or admin
        if (
            comment.user.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this comment',
            });
        }

        comment.deleteOne();
        await image.save();

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
