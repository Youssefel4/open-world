import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCollectionStore } from '../store/collectionStore';
import { useAuthStore } from '../store/authStore';
import Loader from '../components/Loader';

const Collections = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { collections, loading, fetchCollections, createCollection, deleteCollection } =
        useCollectionStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isPrivate: false,
    });

    useEffect(() => {
        fetchCollections(user?._id);
    }, [user]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createCollection(formData);
            setShowCreateModal(false);
            setFormData({ title: '', description: '', isPrivate: false });
        } catch (error) {
            alert('فشل في إنشاء المجموعة');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذه المجموعة؟')) {
            try {
                await deleteCollection(id);
            } catch (error) {
                alert('فشل في حذف المجموعة');
            }
        }
    };

    if (loading && collections.length === 0) {
        return (
            <div className="main-layout">
                <Loader />
            </div>
        );
    }

    return (
        <div className="main-layout">
            <div className="container">
                <div className="flex justify-between items-center mb-xl">
                    <h1>مجموعاتي</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-primary"
                    >
                        ➕ إنشاء مجموعة جديدة
                    </button>
                </div>

                {collections.length === 0 ? (
                    <div className="text-center">
                        <p style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-tertiary)' }}>
                            لا توجد مجموعات بعد
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn btn-primary mt-lg"
                        >
                            إنشاء مجموعة جديدة
                        </button>
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: 'var(--spacing-lg)',
                        }}
                    >
                        {collections.map((collection) => (
                            <div
                                key={collection._id}
                                className="card hover-lift"
                                style={{ cursor: 'pointer' }}
                            >
                                <div
                                    onClick={() => navigate(`/collections/${collection._id}`)}
                                    style={{ padding: 'var(--spacing-lg)' }}
                                >
                                    {/* Preview Images */}
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: collection.images?.length > 1 ? '1fr 1fr' : '1fr',
                                            gap: 'var(--spacing-xs)',
                                            marginBottom: 'var(--spacing-md)',
                                            height: '200px',
                                            backgroundColor: 'var(--bg-secondary)',
                                            borderRadius: 'var(--radius-md)',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {collection.images?.slice(0, 4).map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img.imageUrl}
                                                alt=""
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        ))}
                                        {(!collection.images || collection.images.length === 0) && (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 'var(--font-size-3xl)',
                                                }}
                                            >
                                                📁
                                            </div>
                                        )}
                                    </div>

                                    <h3>{collection.title}</h3>
                                    {collection.description && (
                                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                            {collection.description}
                                        </p>
                                    )}
                                    <div className="flex gap-sm mt-md">
                                        <span className="badge">
                                            📸 {collection.images?.length || 0} صورة
                                        </span>
                                        {collection.isPrivate && (
                                            <span className="badge badge-accent">🔒 خاصة</span>
                                        )}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        padding: 'var(--spacing-md)',
                                        borderTop: '1px solid var(--color-gray-200)',
                                    }}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(collection._id);
                                        }}
                                        className="btn btn-ghost btn-sm"
                                        style={{ width: '100%' }}
                                    >
                                        🗑️ حذف
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div
                    className="modal-backdrop"
                    onClick={() => setShowCreateModal(false)}
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">إنشاء مجموعة جديدة</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowCreateModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreate}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">العنوان *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">الوصف</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        rows="3"
                                    />
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.isPrivate}
                                            onChange={(e) =>
                                                setFormData({ ...formData, isPrivate: e.target.checked })
                                            }
                                        />
                                        <span>مجموعة خاصة</span>
                                    </label>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    إلغاء
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    إنشاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Collections;
