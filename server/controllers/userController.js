import User from '../models/User.js';
import Image from '../models/Image.js';

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Get user's image count
        const imageCount = await Image.countDocuments({ uploadedBy: user._id });

        res.status(200).json({
            success: true,
            data: {
                ...user.toObject(),
                imageCount,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Don't allow deleting yourself
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account',
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get user's uploaded images
// @route   GET /api/users/:id/images
// @access  Public
export const getUserImages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const images = await Image.find({ uploadedBy: req.params.id })
            .populate('uploadedBy', 'name email profileImage')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Image.countDocuments({ uploadedBy: req.params.id });

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

// @desc    Get user's saved images
// @route   GET /api/users/:id/saved
// @access  Private
export const getUserSavedImages = async (req, res) => {
    try {
        // Only allow users to see their own saved images
        if (req.params.id !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view saved images',
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const images = await Image.find({ savedBy: req.user._id })
            .populate('uploadedBy', 'name email profileImage')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Image.countDocuments({ savedBy: req.user._id });

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

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { name, bio, profileImage } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Update fields
        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (profileImage) user.profileImage = profileImage;

        await user.save();

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Upload profile image
// @route   POST /api/users/profile/image
// @access  Private
export const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image',
            });
        }

        const { cloudinary } = await import('../config/cloudinary.js');

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'openworld/profiles',
                    resource_type: 'image',
                    transformation: [
                        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                    ],
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        // Update user profile image
        const user = await User.findById(req.user._id);
        user.profileImage = result.secure_url;
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                profileImage: result.secure_url,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
