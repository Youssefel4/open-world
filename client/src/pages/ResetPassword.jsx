import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { FiLock, FiCheck, FiAlertCircle } from 'react-icons/fi';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            return;
        }

        if (formData.password.length < 6) {
            setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authService.resetPassword(token, formData.password);
            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'فشل في إعادة تعيين كلمة المرور');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="main-layout full-width">
                <div className="container">
                    <div
                        className="card"
                        style={{
                            maxWidth: '500px',
                            margin: '4rem auto',
                            padding: 'var(--spacing-2xl)',
                            textAlign: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-success)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto var(--spacing-lg)',
                            }}
                        >
                            <FiCheck size={48} color="white" />
                        </div>
                        <h1 className="mb-md">تم بنجاح!</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            تم إعادة تعيين كلمة المرور بنجاح
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                            جاري تحويلك للصفحة الرئيسية...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-layout full-width">
            <div className="container">
                <div
                    className="card"
                    style={{
                        maxWidth: '500px',
                        margin: '4rem auto',
                        padding: 'var(--spacing-2xl)',
                    }}
                >
                    <h1 className="text-center mb-md">إعادة تعيين كلمة المرور</h1>
                    <p className="text-center mb-lg" style={{ color: 'var(--text-secondary)' }}>
                        أدخل كلمة المرور الجديدة
                    </p>

                    {error && (
                        <div
                            className="mb-lg"
                            style={{
                                padding: 'var(--spacing-md)',
                                backgroundColor: 'var(--color-error)',
                                color: 'white',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'var(--spacing-sm)',
                            }}
                        >
                            <FiAlertCircle />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">
                                <FiLock size={18} /> كلمة المرور الجديدة
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="أدخل كلمة المرور الجديدة"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FiLock size={18} /> تأكيد كلمة المرور
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="أعد إدخال كلمة المرور"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                        </button>
                    </form>

                    <div className="text-center mt-lg">
                        <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                            العودة لتسجيل الدخول
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
