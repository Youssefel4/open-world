import api from './api';

export const imageService = {
    // Upload image
    uploadImage: async (formData) => {
        const response = await api.post('/images/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get all images with filters
    getImages: async (params = {}) => {
        const response = await api.get('/images', { params });
        return response.data;
    },

    // Get single image
    getImage: async (id) => {
        const response = await api.get(`/images/${id}`);
        return response.data;
    },

    // Update image
    updateImage: async (id, data) => {
        const response = await api.patch(`/images/${id}`, data);
        return response.data;
    },

    // Delete image
    deleteImage: async (id) => {
        const response = await api.delete(`/images/${id}`);
        return response.data;
    },

    // Toggle like
    toggleLike: async (id) => {
        const response = await api.post(`/images/${id}/like`);
        return response.data;
    },

    // Toggle save
    toggleSave: async (id) => {
        const response = await api.post(`/images/${id}/save`);
        return response.data;
    },

    // Add comment
    addComment: async (id, text) => {
        const response = await api.post(`/images/${id}/comments`, { text });
        return response.data;
    },

    // Delete comment
    deleteComment: async (imageId, commentId) => {
        const response = await api.delete(`/images/${imageId}/comments/${commentId}`);
        return response.data;
    },
};
