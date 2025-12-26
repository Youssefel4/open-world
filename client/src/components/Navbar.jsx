import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
    FiSearch,
    FiUpload,
    FiLogOut,
    FiLogIn,
    FiUserPlus,
    FiMenu,
    FiX
} from 'react-icons/fi';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                Open World
            </Link>

            <form className="navbar-search" onSubmit={handleSearch}>
                <FiSearch style={{ position: 'absolute', right: '15px', color: 'var(--text-tertiary)' }} />
                <input
                    type="text"
                    placeholder="ابحث عن الصور، الوسوم، المستخدمين..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingRight: '45px' }}
                />
            </form>

            {/* Mobile Menu Toggle */}
            <button
                className="btn btn-icon btn-ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ display: 'none' }}
                id="mobile-menu-btn"
            >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <div className="navbar-actions">
                {isAuthenticated ? (
                    <>
                        <Link to="/upload" className="btn btn-primary btn-sm">
                            <FiUpload /> رفع صورة
                        </Link>
                        <Link to={`/profile/${user?._id}`}>
                            <img
                                src={user?.profileImage || 'https://via.placeholder.com/40'}
                                alt={user?.name}
                                className="navbar-avatar"
                            />
                        </Link>
                        <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                            <FiLogOut /> تسجيل خروج
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-ghost btn-sm">
                            <FiLogIn /> تسجيل دخول
                        </Link>
                        <Link to="/register" className="btn btn-primary btn-sm">
                            <FiUserPlus /> إنشاء حساب
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
