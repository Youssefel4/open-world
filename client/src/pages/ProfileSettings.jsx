import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { userService } from '../services/userService';
import { FiCamera, FiSave, FiX } from 'react-icons/fi';
import Loader from '../components/Loader';

const ProfileSettings = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(user?.profileImage || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

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
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Upload profile image if changed
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);
                await userService.uploadProfileImage(imageFormData);
            }

            // Update profile data
            await userService.updateProfile({
                name: formData.name,
                bio: formData.bio,
            });

            setSuccess('تم تحديث الملف الشخصي بنجاح!');

            // Refresh page after 1 second
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            setError(error.response?.data?.message || 'فشل في تحديث الملف الشخصي');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-layout">
            <div className="container">
                <div
                    className="card"
                    style={{
                        maxWidth: '600px',
                        margin: '2rem auto',
                        padding: 'var(--spacing-2xl)',
                    }}
                >
                    <div className="flex justify-between items-center mb-lg">
                        <h1>تعديل الملف الشخصي</h1>
                        <button
                            onClick={() => navigate(`/profile/${user?._id}`)}
                            className="btn btn-ghost btn-icon"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

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

                    {success && (
                        <div
                            className="mb-lg"
                            style={{
                                padding: 'var(--spacing-md)',
                                backgroundColor: 'var(--color-success)',
                                color: 'white',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center',
                            }}
                        >
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Profile Image */}
                        <div className="form-group text-center">
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <img
                                    src={preview || 'https://via.placeholder.com/150'}
                                    alt="Profile"
                                    style={{
                                        width: '150px',
                                        height: '150px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '4px solid var(--color-primary)',
                                    }}
                                />
                                <label
                                    htmlFor="profile-image"
                                    style={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        right: '10px',
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'white',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: 'var(--shadow-md)',
                                    }}
                                >
                                    <FiCamera size={20} />
                                </label>
                                <input
                                    type="file"
                                    id="profile-image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            <p style={{
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--text-tertiary)',
                                marginTop: 'var(--spacing-sm)'
                            }}>
                                انقر على الكاميرا لتغيير الصورة
                            </p>
                        </div>

                        {/* Name */}
                        <div className="form-group">
                            <label className="form-label">الاسم</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Bio */}
                        <div className="form-group">
                            <label className="form-label">نبذة عنك</label>
                            <textarea
                                name="bio"
                                className="form-textarea"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="أخبرنا عن نفسك..."
                                rows="4"
                                maxLength="200"
                            />
                            <p style={{
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--text-tertiary)',
                                marginTop: 'var(--spacing-xs)',
                                textAlign: 'left'
                            }}>
                                {formData.bio.length}/200
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
                                {loading ? (
                                    <>جاري الحفظ...</>
                                ) : (
                                    <>
                                        <FiSave /> حفظ التغييرات
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate(`/profile/${user?._id}`)}
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

export default ProfileSettings;
