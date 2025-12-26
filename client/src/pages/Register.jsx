import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Register = () => {
    const navigate = useNavigate();
    const { register, loading, error } = useAuthStore();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [validationError, setValidationError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setValidationError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setValidationError('كلمات المرور غير متطابقة');
            return;
        }

        if (formData.password.length < 6) {
            setValidationError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const displayError = validationError || error;

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
                    <h1 className="text-center mb-lg">إنشاء حساب جديد</h1>

                    {displayError && (
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
                            {displayError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
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

                        <div className="form-group">
                            <label className="form-label">البريد الإلكتروني</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">كلمة المرور</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">تأكيد كلمة المرور</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                        </button>
                    </form>

                    <p className="text-center mt-lg">
                        لديك حساب بالفعل؟{' '}
                        <Link to="/login" style={{ fontWeight: 'bold' }}>
                            تسجيل الدخول
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
