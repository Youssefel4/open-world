import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useImageStore } from '../store/imageStore';
import { FiHeart, FiBookmark, FiDownload } from 'react-icons/fi';

const ImageCard = ({ image, onClick }) => {
    const { isAuthenticated, user } = useAuthStore();
    const { toggleLike, toggleSave } = useImageStore();

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            alert('يرجى تسجيل الدخول للإعجاب بالصور');
            return;
        }
        try {
            await toggleLike(image._id);
        } catch (error) {
            console.error('Failed to like image:', error);
        }
    };

    const handleSave = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            alert('يرجى تسجيل الدخول لحفظ الصور');
            return;
        }
        try {
            await toggleSave(image._id);
        } catch (error) {
            console.error('Failed to save image:', error);
        }
    };

    const handleDownload = async (e) => {
        e.stopPropagation();
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
            console.error('Failed to download image:', error);
            alert('فشل تحميل الصورة');
        }
    };

    const isLiked = image.likes?.includes(user?._id);
    const isSaved = image.savedBy?.includes(user?._id);

    return (
        <div className="image-card" onClick={() => onClick(image)}>
            <img src={image.imageUrl} alt={image.title} loading="lazy" />

            <div className="image-card-actions">
                <button
                    onClick={handleDownload}
                    className="btn btn-icon btn-secondary"
                    title="تحميل"
                >
                    <FiDownload size={18} />
                </button>
                {isAuthenticated && (
                    <>
                        <button
                            onClick={handleLike}
                            className="btn btn-icon btn-primary"
                            title="إعجاب"
                            style={{
                                backgroundColor: isLiked ? 'var(--color-error)' : 'var(--color-primary)',
                            }}
                        >
                            <FiHeart size={18} fill={isLiked ? 'white' : 'none'} />
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn btn-icon btn-accent"
                            title="حفظ"
                            style={{
                                backgroundColor: isSaved ? 'var(--color-warning)' : 'var(--color-accent)',
                            }}
                        >
                            <FiBookmark size={18} fill={isSaved ? 'white' : 'none'} />
                        </button>
                    </>
                )}
            </div>

            <div className="image-card-overlay">
                <h3 className="image-card-title">{image.title}</h3>
                <div className="flex gap-sm">
                    <span className="badge">
                        <FiHeart size={14} /> {image.likes?.length || 0}
                    </span>
                    <span className="badge">💬 {image.comments?.length || 0}</span>
                </div>
            </div>
        </div>
    );
};

export default ImageCard;
