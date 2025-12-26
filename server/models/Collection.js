import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
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
            maxlength: [300, 'Description cannot be more than 300 characters'],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        images: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Image',
            },
        ],
        isPrivate: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for user's collections
collectionSchema.index({ user: 1 });

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
