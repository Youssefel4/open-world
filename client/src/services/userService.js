import api from './api';

export const userService = {
    // Get all users (admin only)
    getUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    // Get user by ID
    getUser: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    // Delete user (admin only)
    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    // Get user's images
    getUserImages: async (id, params = {}) => {
        const response = await api.get(`/users/${id}/images`, { params });
        return response.data;
    },

    // Get user's saved images
    getUserSavedImages: async (id, params = {}) => {
        const response = await api.get(`/users/${id}/saved`, { params });
        return response.data;
    },

    // Update profile
    updateProfile: async (data) => {
        const response = await api.patch('/users/profile', data);
        return response.data;
    },

    // Upload profile image
    uploadProfileImage: async (formData) => {
        const response = await api.post('/users/profile/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
