import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { useAuthStore } from '../store/authStore';
import MasonryGrid from '../components/MasonryGrid';
import ImageCard from '../components/ImageCard';
import ImageModal from '../components/ImageModal';
import Loader from '../components/Loader';
import { FiSettings, FiImage, FiBookmark } from 'react-icons/fi';

const Profile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();
    const [user, setUser] = useState(null);
    const [images, setImages] = useState([]);
    const [savedImages, setSavedImages] = useState([]);
    const [activeTab, setActiveTab] = useState('uploaded');
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    const isOwnProfile = currentUser?._id === userId;

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const userData = await userService.getUser(userId);
            setUser(userData.data);

            const imagesData = await userService.getUserImages(userId);
            setImages(imagesData.data);

            if (isOwnProfile) {
                const savedData = await userService.getUserSavedImages(userId);
                setSavedImages(savedData.data);
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="main-layout">
                <Loader />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="main-layout">
                <div className="container text-center">
                    <h2>المستخدم غير موجود</h2>
                </div>
            </div>
        );
    }

    const displayImages = activeTab === 'uploaded' ? images : savedImages;

    return (
        <div className="main-layout">
            <div className="container">
                {/* Profile Header */}
                <div className="text-center mb-xl">
                    <img
                        src={user.profileImage || 'https://via.placeholder.com/150'}
                        alt={user.name}
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '4px solid var(--color-primary)',
                            marginBottom: 'var(--spacing-md)',
                        }}
                    />
                    <h1>{user.name}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                    {user.bio && (
                        <p style={{
                            color: 'var(--text-secondary)',
                            maxWidth: '600px',
                            margin: '0 auto',
                            marginTop: 'var(--spacing-sm)'
                        }}>
                            {user.bio}
                        </p>
                    )}
                    <div className="flex gap-md justify-center mt-md">
                        <span className="badge badge-primary">
                            <FiImage size={14} /> {user.imageCount || 0} صورة
                        </span>
                        {user.role === 'admin' && (
                            <span className="badge badge-accent">👑 مدير</span>
                        )}
                    </div>

                    {/* Settings Button */}
                    {isOwnProfile && (
                        <button
                            onClick={() => navigate('/profile/settings')}
                            className="btn btn-secondary mt-md"
                        >
                            <FiSettings /> تعديل الملف الشخصي
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-md justify-center mb-xl">
                    <button
                        onClick={() => setActiveTab('uploaded')}
                        className={`btn ${activeTab === 'uploaded' ? 'btn-primary' : 'btn-secondary'
                            }`}
                    >
                        <FiImage /> الصور المرفوعة ({images.length})
                    </button>
                    {isOwnProfile && (
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`btn ${activeTab === 'saved' ? 'btn-primary' : 'btn-secondary'
                                }`}
                        >
                            <FiBookmark /> الصور المحفوظة ({savedImages.length})
                        </button>
                    )}
                </div>

                {/* Images Grid */}
                {displayImages.length === 0 ? (
                    <div className="text-center">
                        <p style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-tertiary)' }}>
                            {activeTab === 'uploaded'
                                ? 'لا توجد صور مرفوعة بعد'
                                : 'لا توجد صور محفوظة بعد'}
                        </p>
                    </div>
                ) : (
                    <MasonryGrid>
                        {displayImages.map((image) => (
                            <ImageCard
                                key={image._id}
                                image={image}
                                onClick={setSelectedImage}
                            />
                        ))}
                    </MasonryGrid>
                )}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <ImageModal
                    image={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </div>
    );
};

export default Profile;
