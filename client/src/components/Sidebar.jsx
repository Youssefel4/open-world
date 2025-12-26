import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
    FiHome,
    FiUser,
    FiFolder,
    FiUpload,
    FiSettings
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, isAuthenticated } = useAuthStore();

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <nav className="sidebar-nav">
                <ul>
                    <li className="sidebar-nav-item">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `sidebar-nav-link ${isActive ? 'active' : ''}`
                            }
                            onClick={onClose}
                        >
                            <FiHome size={20} />
                            <span>الرئيسية</span>
                        </NavLink>
                    </li>

                    {isAuthenticated && (
                        <>
                            <li className="sidebar-nav-item">
                                <NavLink
                                    to={`/profile/${user?._id}`}
                                    className={({ isActive }) =>
                                        `sidebar-nav-link ${isActive ? 'active' : ''}`
                                    }
                                    onClick={onClose}
                                >
                                    <FiUser size={20} />
                                    <span>الملف الشخصي</span>
                                </NavLink>
                            </li>

                            <li className="sidebar-nav-item">
                                <NavLink
                                    to="/collections"
                                    className={({ isActive }) =>
                                        `sidebar-nav-link ${isActive ? 'active' : ''}`
                                    }
                                    onClick={onClose}
                                >
                                    <FiFolder size={20} />
                                    <span>المجموعات</span>
                                </NavLink>
                            </li>

                            <li className="sidebar-nav-item">
                                <NavLink
                                    to="/upload"
                                    className={({ isActive }) =>
                                        `sidebar-nav-link ${isActive ? 'active' : ''}`
                                    }
                                    onClick={onClose}
                                >
                                    <FiUpload size={20} />
                                    <span>رفع صورة</span>
                                </NavLink>
                            </li>

                            {user?.role === 'admin' && (
                                <li className="sidebar-nav-item">
                                    <NavLink
                                        to="/admin"
                                        className={({ isActive }) =>
                                            `sidebar-nav-link ${isActive ? 'active' : ''}`
                                        }
                                        onClick={onClose}
                                    >
                                        <FiSettings size={20} />
                                        <span>لوحة التحكم</span>
                                    </NavLink>
                                </li>
                            )}
                        </>
                    )}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
