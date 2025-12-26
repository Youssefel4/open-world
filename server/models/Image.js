import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: [true, 'Comment text is required'],
            trim: true,
            maxlength: [500, 'Comment cannot be more than 500 characters'],
        },
    },
    {
        timestamps: true,
    }
);

const imageSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot be more than 500 characters'],
        },
        tags: {
            type: [String],
            default: [],
            validate: {
                validator: function (tags) {
                    return tags.length <= 10;
                },
                message: 'Cannot have more than 10 tags',
            },
        },
        imageUrl: {
            type: String,
            required: [true, 'Image URL is required'],
        },
        cloudinaryId: {
            type: String, // Store Cloudinary public_id for deletion
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        savedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        comments: [commentSchema],
    },
    {
        timestamps: true,
    }
);

// Index for search performance
imageSchema.index({ tags: 1 });
imageSchema.index({ title: 'text', description: 'text' });

const Image = mongoose.model('Image', imageSchema);

export default Image;
