import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import MasonryGrid from '../components/MasonryGrid';
import ImageCard from '../components/ImageCard';
import ImageModal from '../components/ImageModal';
import Loader from '../components/Loader';
import { useState } from 'react';

const Search = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q');
    const { images, loading, fetchImages } = useImageStore();
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (query) {
            fetchImages({ search: query });
        }
    }, [query]);

    return (
        <div className="main-layout">
            <div className="container">
                <div className="mb-xl">
                    <button onClick={() => navigate('/')} className="btn btn-ghost mb-md">
                        ← العودة للرئيسية
                    </button>
                    <h1>نتائج البحث عن: "{query}"</h1>
                </div>

                {loading ? (
                    <Loader />
                ) : images.length === 0 ? (
                    <div className="text-center">
                        <p style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-tertiary)' }}>
                            لم يتم العثور على نتائج
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="mb-lg" style={{ color: 'var(--text-secondary)' }}>
                            تم العثور على {images.length} صورة
                        </p>
                        <MasonryGrid>
                            {images.map((image) => (
                                <ImageCard
                                    key={image._id}
                                    image={image}
                                    onClick={setSelectedImage}
                                />
                            ))}
                        </MasonryGrid>
                    </>
                )}
            </div>

            {selectedImage && (
                <ImageModal
                    image={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </div>
    );
};

export default Search;
