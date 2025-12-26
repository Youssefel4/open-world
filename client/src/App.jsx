import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import ProfileSettings from './pages/ProfileSettings';
import Collections from './pages/Collections';
import CollectionDetails from './pages/CollectionDetails';
import Search from './pages/Search';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <Router>
            <div className="app">
                <Navbar />
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/profile/:userId" element={<Profile />} />

                    {/* Protected Routes */}
                    <Route
                        path="/upload"
                        element={
                            <ProtectedRoute>
                                <Upload />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/collections"
                        element={
                            <ProtectedRoute>
                                <Collections />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/collections/:collectionId"
                        element={
                            <ProtectedRoute>
                                <CollectionDetails />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile/settings"
                        element={
                            <ProtectedRoute>
                                <ProfileSettings />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
