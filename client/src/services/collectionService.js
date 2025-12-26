import api from './api';

export const collectionService = {
    // Create collection
    createCollection: async (data) => {
        const response = await api.post('/collections', data);
        return response.data;
    },

    // Get collections
    getCollections: async (userId) => {
        const response = await api.get('/collections', {
            params: userId ? { user: userId } : {},
        });
        return response.data;
    },

    // Get single collection
    getCollection: async (id) => {
        const response = await api.get(`/collections/${id}`);
        return response.data;
    },

    // Update collection
    updateCollection: async (id, data) => {
        const response = await api.patch(`/collections/${id}`, data);
        return response.data;
    },

    // Delete collection
    deleteCollection: async (id) => {
        const response = await api.delete(`/collections/${id}`);
        return response.data;
    },

    // Add image to collection
    addImageToCollection: async (collectionId, imageId) => {
        const response = await api.post(`/collections/${collectionId}/images`, {
            imageId,
        });
        return response.data;
    },

    // Remove image from collection
    removeImageFromCollection: async (collectionId, imageId) => {
        const response = await api.delete(
            `/collections/${collectionId}/images/${imageId}`
        );
        return response.data;
    },
};
