import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useImageStore } from '../store/imageStore';
import MasonryGrid from '../components/MasonryGrid';
import ImageCard from '../components/ImageCard';
import ImageModal from '../components/ImageModal';
import Loader from '../components/Loader';
import { FiFilter, FiX } from 'react-icons/fi';

const Home = () => {
    const { images, loading, hasMore, fetchImages, loadMore } = useImageStore();
    const [selectedImage, setSelectedImage] = useState(null);
    const [filter, setFilter] = useState('');
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);

    const handleFilter = (e) => {
        e.preventDefault();
        if (filter.trim()) {
            fetchImages({ tags: filter });
            setShowFilter(false);
        }
    };

    const clearFilter = () => {
        setFilter('');
        fetchImages();
    };

    return (
        <div className="main-layout">
            <div className="container">
                <div className="flex justify-between items-center mb-lg">
                    <h1>استكشف الصور</h1>
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="btn btn-secondary"
                    >
                        <FiFilter /> فلترة
                    </button>
                </div>

                {/* Filter */}
                {showFilter && (
                    <form onSubmit={handleFilter} className="mb-xl">
                        <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                            <div className="flex gap-md items-center">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="ابحث بالوسوم (مثال: تصميم، فن، طبيعة)"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button type="submit" className="btn btn-primary">
                                    بحث
                                </button>
                                {filter && (
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        onClick={clearFilter}
                                    >
                                        <FiX /> مسح
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                )}

                {/* Images Grid */}
                {loading && (!images || images.length === 0) ? (
                    <Loader />
                ) : (!images || images.length === 0) ? (
                    <div className="text-center">
                        <p style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-tertiary)' }}>
                            لا توجد صور بعد
                        </p>
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={images?.length || 0}
                        next={loadMore}
                        hasMore={hasMore}
                        loader={<Loader />}
                    >
                        <MasonryGrid>
                            {images?.map((image) => (
                                <ImageCard
                                    key={image._id}
                                    image={image}
                                    onClick={setSelectedImage}
                                />
                            ))}
                        </MasonryGrid>
                    </InfiniteScroll>
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

export default Home;
