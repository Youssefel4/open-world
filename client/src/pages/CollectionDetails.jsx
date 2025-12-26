import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCollectionStore } from '../store/collectionStore';
import MasonryGrid from '../components/MasonryGrid';
import ImageCard from '../components/ImageCard';
import ImageModal from '../components/ImageModal';
import Loader from '../components/Loader';

const CollectionDetails = () => {
    const { collectionId } = useParams();
    const navigate = useNavigate();
    const { currentCollection, loading, fetchCollection, removeImageFromCollection } =
        useCollectionStore();
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchCollection(collectionId);
    }, [collectionId]);

    const handleRemoveImage = async (imageId) => {
        if (window.confirm('هل تريد إزالة هذه الصورة من المجموعة؟')) {
            try {
                await removeImageFromCollection(collectionId, imageId);
            } catch (error) {
                alert('فشل في إزالة الصورة');
            }
        }
    };

    if (loading) {
        return (
            <div className="main-layout">
                <Loader />
            </div>
        );
    }

    if (!currentCollection) {
        return (
            <div className="main-layout">
                <div className="container text-center">
                    <h2>المجموعة غير موجودة</h2>
                    <button onClick={() => navigate('/collections')} className="btn btn-primary mt-lg">
                        العودة للمجموعات
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="main-layout">
            <div className="container">
                {/* Header */}
                <div className="mb-xl">
                    <button onClick={() => navigate('/collections')} className="btn btn-ghost mb-md">
                        ← العودة للمجموعات
                    </button>
                    <h1>{currentCollection.title}</h1>
                    {currentCollection.description && (
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {currentCollection.description}
                        </p>
                    )}
                    <div className="flex gap-sm mt-md">
                        <span className="badge">
                            📸 {currentCollection.images?.length || 0} صورة
                        </span>
                        {currentCollection.isPrivate && (
                            <span className="badge badge-accent">🔒 خاصة</span>
                        )}
                    </div>
                </div>

                {/* Images Grid */}
                {!currentCollection.images || currentCollection.images.length === 0 ? (
                    <div className="text-center">
                        <p style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-tertiary)' }}>
                            لا توجد صور في هذه المجموعة بعد
                        </p>
                    </div>
                ) : (
                    <MasonryGrid>
                        {currentCollection.images.map((image) => (
                            <div key={image._id} style={{ position: 'relative' }}>
                                <ImageCard image={image} onClick={setSelectedImage} />
                                <button
                                    onClick={() => handleRemoveImage(image._id)}
                                    className="btn btn-icon btn-ghost"
                                    style={{
                                        position: 'absolute',
                                        top: 'var(--spacing-sm)',
                                        left: 'var(--spacing-sm)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    }}
                                    title="إزالة من المجموعة"
                                >
                                    ✖️
                                </button>
                            </div>
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

export default CollectionDetails;
