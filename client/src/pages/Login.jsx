import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Login = () => {
    const navigate = useNavigate();
    const { login, loading, error } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

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
                    <h1 className="text-center mb-lg">تسجيل الدخول</h1>

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

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                        </button>
                    </form>

                    <p className="text-center mt-lg">
                        ليس لديك حساب؟{' '}
                        <Link to="/register" style={{ fontWeight: 'bold' }}>
                            إنشاء حساب جديد
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
