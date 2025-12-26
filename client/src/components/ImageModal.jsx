import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useImageStore } from '../store/imageStore';
import { useCollectionStore } from '../store/collectionStore';
import CommentBox from './CommentBox';
import {
    FiHeart,
    FiBookmark,
    FiDownload,
    FiTrash2,
    FiX,
    FiFolderPlus
} from 'react-icons/fi';

const ImageModal = ({ image, onClose }) => {
    const { user, isAuthenticated } = useAuthStore();
    const { toggleLike, toggleSave, deleteImage } = useImageStore();
    const { collections, addImageToCollection, fetchCollections } = useCollectionStore();
    const [showCollections, setShowCollections] = useState(false);

    React.useEffect(() => {
        if (isAuthenticated && showCollections && collections.length === 0) {
            fetchCollections(user?._id);
        }
    }, [showCollections, isAuthenticated]);

    if (!image) return null;

    const handleLike = async () => {
        if (!isAuthenticated) {
            alert('يرجى تسجيل الدخول');
            return;
        }
        try {
            await toggleLike(image._id);
        } catch (error) {
            console.error('Failed to like:', error);
        }
    };

    const handleSave = async () => {
        if (!isAuthenticated) {
            alert('يرجى تسجيل الدخول');
            return;
        }
        try {
            await toggleSave(image._id);
        } catch (error) {
            console.error('Failed to save:', error);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(image.imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${image.title || 'image'}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download:', error);
            alert('فشل تحميل الصورة');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
            try {
                await deleteImage(image._id);
                onClose();
            } catch (error) {
                console.error('Failed to delete:', error);
            }
        }
    };

    const handleAddToCollection = async (collectionId) => {
        try {
            await addImageToCollection(collectionId, image._id);
            alert('تمت إضافة الصورة إلى المجموعة');
            setShowCollections(false);
        } catch (error) {
            alert(error.response?.data?.message || 'فشل في إضافة الصورة');
        }
    };

    const isOwner = user?._id === image.uploadedBy?._id;
    const isLiked = image.likes?.includes(user?._id);
    const isSaved = image.savedBy?.includes(user?._id);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{image.title}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <FiX size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="flex gap-lg" style={{ flexDirection: 'column' }}>
                        {/* Image */}
                        <img
                            src={image.imageUrl}
                            alt={image.title}
                            style={{
                                width: '100%',
                                borderRadius: 'var(--radius-lg)',
                                maxHeight: '500px',
                                objectFit: 'contain',
                            }}
                        />

                        {/* Info */}
                        <div>
                            <div className="flex items-center gap-md mb-md">
                                <img
                                    src={
                                        image.uploadedBy?.profileImage ||
                                        'https://via.placeholder.com/40'
                                    }
                                    alt={image.uploadedBy?.name}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                    }}
                                />
                                <div>
                                    <h4 style={{ margin: 0 }}>{image.uploadedBy?.name}</h4>
                                    <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>
                                        {image.uploadedBy?.email}
                                    </p>
                                </div>
                            </div>

                            {image.description && (
                                <p className="mb-md">{image.description}</p>
                            )}

                            {/* Tags */}
                            {image.tags && image.tags.length > 0 && (
                                <div className="flex gap-sm mb-lg" style={{ flexWrap: 'wrap' }}>
                                    {image.tags.map((tag, index) => (
                                        <span key={index} className="tag">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-md mb-lg" style={{ flexWrap: 'wrap' }}>
                                <button onClick={handleDownload} className="btn btn-secondary">
                                    <FiDownload /> تحميل
                                </button>
                                {isAuthenticated && (
                                    <>
                                        <button
                                            onClick={handleLike}
                                            className="btn btn-primary"
                                            style={{
                                                backgroundColor: isLiked ? 'var(--color-error)' : 'var(--color-primary)',
                                            }}
                                        >
                                            <FiHeart fill={isLiked ? 'white' : 'none'} /> إعجاب ({image.likes?.length || 0})
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="btn btn-accent"
                                            style={{
                                                backgroundColor: isSaved ? 'var(--color-warning)' : 'var(--color-accent)',
                                            }}
                                        >
                                            <FiBookmark fill={isSaved ? 'white' : 'none'} /> حفظ
                                        </button>
                                        <button
                                            onClick={() => setShowCollections(!showCollections)}
                                            className="btn btn-secondary"
                                        >
                                            <FiFolderPlus /> إضافة لمجموعة
                                        </button>
                                    </>
                                )}
                                {(isOwner || user?.role === 'admin') && (
                                    <button onClick={handleDelete} className="btn btn-ghost">
                                        <FiTrash2 /> حذف
                                    </button>
                                )}
                            </div>

                            {/* Collections Dropdown */}
                            {showCollections && (
                                <div
                                    className="card mb-lg"
                                    style={{ padding: 'var(--spacing-md)' }}
                                >
                                    <h4>اختر مجموعة:</h4>
                                    {collections.length === 0 ? (
                                        <p style={{ color: 'var(--text-tertiary)' }}>
                                            لا توجد مجموعات. قم بإنشاء مجموعة أولاً.
                                        </p>
                                    ) : (
                                        collections.map((col) => (
                                            <button
                                                key={col._id}
                                                onClick={() => handleAddToCollection(col._id)}
                                                className="btn btn-ghost"
                                                style={{ width: '100%', marginBottom: 'var(--spacing-sm)' }}
                                            >
                                                {col.title}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Comments */}
                            <CommentBox imageId={image._id} comments={image.comments || []} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
