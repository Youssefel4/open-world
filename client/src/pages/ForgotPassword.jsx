import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetLink, setResetLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResetLink('');

        try {
            const data = await authService.forgotPassword(email);
            setResetLink(data.data.resetUrl);
        } catch (error) {
            setError(error.response?.data?.message || 'فشل في إرسال رابط إعادة التعيين');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(resetLink);
        alert('تم نسخ الرابط!');
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
                    <h1 className="text-center mb-md">نسيت كلمة المرور؟</h1>
                    <p className="text-center mb-lg" style={{ color: 'var(--text-secondary)' }}>
                        أدخل بريدك الإلكتروني وسنعطيك رابط لإعادة تعيين كلمة المرور
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
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {resetLink ? (
                        <div>
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
                                <FiCheck size={32} style={{ marginBottom: 'var(--spacing-sm)' }} />
                                <p style={{ margin: 0 }}>تم إنشاء رابط إعادة التعيين!</p>
                            </div>

                            <div
                                className="card"
                                style={{
                                    padding: 'var(--spacing-md)',
                                    backgroundColor: 'var(--bg-secondary)',
                                    marginBottom: 'var(--spacing-lg)',
                                }}
                            >
                                <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-sm)' }}>
                                    رابط إعادة التعيين (صالح لمدة 10 دقائق):
                                </p>
                                <div
                                    style={{
                                        padding: 'var(--spacing-sm)',
                                        backgroundColor: 'var(--bg-primary)',
                                        borderRadius: 'var(--radius-md)',
                                        wordBreak: 'break-all',
                                        fontSize: 'var(--font-size-sm)',
                                        marginBottom: 'var(--spacing-md)',
                                    }}
                                >
                                    {resetLink}
                                </div>
                                <button onClick={copyToClipboard} className="btn btn-secondary" style={{ width: '100%' }}>
                                    📋 نسخ الرابط
                                </button>
                            </div>

                            <a href={resetLink} className="btn btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                                انتقل لإعادة تعيين كلمة المرور
                            </a>

                            <p className="text-center mt-md" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
                                ⚠️ احفظ هذا الرابط! لن تتمكن من رؤيته مرة أخرى
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">
                                    <FiMail size={18} /> البريد الإلكتروني
                                </label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                disabled={loading}
                            >
                                {loading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
                            </button>
                        </form>
                    )}

                    <div className="text-center mt-lg">
                        <Link to="/login" className="flex items-center justify-center gap-sm" style={{ color: 'var(--text-secondary)' }}>
                            <FiArrowLeft /> العودة لتسجيل الدخول
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
