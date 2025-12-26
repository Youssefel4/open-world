import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';

const Upload = () => {
    const navigate = useNavigate();
    const { uploadImage, loading } = useImageStore();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('يرجى اختيار ملف صورة صحيح');
                return;
            }

            setImageFile(file);
            setError('');

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            setError('يرجى اختيار صورة');
            return;
        }

        const data = new FormData();
        data.append('image', imageFile);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('tags', formData.tags);

        try {
            await uploadImage(data);
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || 'فشل في رفع الصورة');
        }
    };

    return (
        <div className="main-layout">
            <div className="container">
                <div
                    className="card"
                    style={{
                        maxWidth: '800px',
                        margin: '2rem auto',
                        padding: 'var(--spacing-2xl)',
                    }}
                >
                    <h1 className="text-center mb-lg">رفع صورة جديدة</h1>

                    {error && (
                        <div
                            className="mb-lg"
                            style={{
                                padding: 'var(--spacing-md)',
                                backgroundColor: 'var(--color-error)',
                                color: 'white',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center',
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Image Upload */}
                        <div className="form-group">
                            <label className="form-label">الصورة *</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="form-input"
                                required
                            />
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-xs)' }}>
                                الحد الأقصى: 5 ميجابايت | الصيغ المدعومة: JPG, PNG, GIF, WEBP
                            </p>
                        </div>

                        {/* Preview */}
                        {preview && (
                            <div className="mb-lg">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{
                                        width: '100%',
                                        maxHeight: '400px',
                                        objectFit: 'contain',
                                        borderRadius: 'var(--radius-lg)',
                                    }}
                                />
                            </div>
                        )}

                        {/* Title */}
                        <div className="form-group">
                            <label className="form-label">العنوان *</label>
                            <input
                                type="text"
                                name="title"
                                className="form-input"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="أدخل عنواناً وصفياً للصورة"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">الوصف</label>
                            <textarea
                                name="description"
                                className="form-textarea"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="أضف وصفاً للصورة (اختياري)"
                                rows="4"
                            />
                        </div>

                        {/* Tags */}
                        <div className="form-group">
                            <label className="form-label">الوسوم</label>
                            <input
                                type="text"
                                name="tags"
                                className="form-input"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="أدخل الوسوم مفصولة بفواصل (مثال: تصميم، فن، طبيعة)"
                            />
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-xs)' }}>
                                الوسوم تساعد الآخرين في العثور على صورتك
                            </p>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-md">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                disabled={loading}
                            >
                                {loading ? 'جاري الرفع...' : 'رفع الصورة'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/')}
                                disabled={loading}
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Upload;
