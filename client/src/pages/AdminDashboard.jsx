import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { useImageStore } from '../store/imageStore';
import Loader from '../components/Loader';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const { images, fetchImages, deleteImage } = useImageStore();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const usersData = await userService.getUsers();
            setUsers(usersData.data);
            await fetchImages({ limit: 100 });
        } catch (error) {
            console.error('Failed to load admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            try {
                await userService.deleteUser(userId);
                setUsers(users.filter((u) => u._id !== userId));
                alert('تم حذف المستخدم بنجاح');
            } catch (error) {
                alert(error.response?.data?.message || 'فشل في حذف المستخدم');
            }
        }
    };

    const handleDeleteImage = async (imageId) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
            try {
                await deleteImage(imageId);
                alert('تم حذف الصورة بنجاح');
            } catch (error) {
                alert('فشل في حذف الصورة');
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

    return (
        <div className="main-layout">
            <div className="container">
                <h1 className="mb-xl">لوحة تحكم المدير</h1>

                {/* Stats */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 'var(--spacing-lg)',
                        marginBottom: 'var(--spacing-2xl)',
                    }}
                >
                    <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                        <h3>👥 المستخدمين</h3>
                        <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', margin: 0 }}>
                            {users.length}
                        </p>
                    </div>
                    <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                        <h3>📸 الصور</h3>
                        <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', margin: 0 }}>
                            {images.length}
                        </p>
                    </div>
                    <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                        <h3>👑 المدراء</h3>
                        <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', margin: 0 }}>
                            {users.filter((u) => u.role === 'admin').length}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-md mb-lg">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        إدارة المستخدمين
                    </button>
                    <button
                        onClick={() => setActiveTab('images')}
                        className={`btn ${activeTab === 'images' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        إدارة الصور
                    </button>
                </div>

                {/* Users Table */}
                {activeTab === 'users' && (
                    <div className="card" style={{ overflow: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>الاسم</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>البريد</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>الدور</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>تاريخ التسجيل</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr
                                        key={user._id}
                                        style={{ borderBottom: '1px solid var(--color-gray-200)' }}
                                    >
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <div className="flex items-center gap-sm">
                                                <img
                                                    src={user.profileImage || 'https://via.placeholder.com/40'}
                                                    alt={user.name}
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '50%',
                                                    }}
                                                />
                                                {user.name}
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>{user.email}</td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <span
                                                className={`badge ${user.role === 'admin' ? 'badge-accent' : 'badge-primary'
                                                    }`}
                                            >
                                                {user.role === 'admin' ? '👑 مدير' : '👤 مستخدم'}
                                            </span>
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="btn btn-ghost btn-sm"
                                                disabled={user.role === 'admin'}
                                            >
                                                🗑️ حذف
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Images Table */}
                {activeTab === 'images' && (
                    <div className="card" style={{ overflow: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>الصورة</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>العنوان</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>المستخدم</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>الإعجابات</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>التعليقات</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {images.map((image) => (
                                    <tr
                                        key={image._id}
                                        style={{ borderBottom: '1px solid var(--color-gray-200)' }}
                                    >
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <img
                                                src={image.imageUrl}
                                                alt={image.title}
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    borderRadius: 'var(--radius-md)',
                                                }}
                                            />
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>{image.title}</td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            {image.uploadedBy?.name}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            ❤️ {image.likes?.length || 0}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            💬 {image.comments?.length || 0}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <button
                                                onClick={() => handleDeleteImage(image._id)}
                                                className="btn btn-ghost btn-sm"
                                            >
                                                🗑️ حذف
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
