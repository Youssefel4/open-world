import { create } from 'zustand';
import { collectionService } from '../services/collectionService';

export const useCollectionStore = create((set, get) => ({
    collections: [],
    currentCollection: null,
    loading: false,
    error: null,

    // Fetch collections
    fetchCollections: async (userId) => {
        set({ loading: true, error: null });
        try {
            const data = await collectionService.getCollections(userId);
            set({ collections: data.data, loading: false });
            return data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch collections',
                loading: false,
            });
            throw error;
        }
    },

    // Fetch single collection
    fetchCollection: async (id) => {
        set({ loading: true, error: null });
        try {
            const data = await collectionService.getCollection(id);
            set({ currentCollection: data.data, loading: false });
            return data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch collection',
                loading: false,
            });
            throw error;
        }
    },

    // Create collection
    createCollection: async (collectionData) => {
        set({ loading: true, error: null });
        try {
            const data = await collectionService.createCollection(collectionData);
            set({
                collections: [data.data, ...get().collections],
                loading: false,
            });
            return data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to create collection',
                loading: false,
            });
            throw error;
        }
    },

    // Update collection
    updateCollection: async (id, updateData) => {
        set({ loading: true, error: null });
        try {
            const data = await collectionService.updateCollection(id, updateData);
            set({
                collections: get().collections.map((col) =>
                    col._id === id ? data.data : col
                ),
                currentCollection: data.data,
                loading: false,
            });
            return data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to update collection',
                loading: false,
            });
            throw error;
        }
    },

    // Delete collection
    deleteCollection: async (id) => {
        set({ loading: true, error: null });
        try {
            await collectionService.deleteCollection(id);
            set({
                collections: get().collections.filter((col) => col._id !== id),
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to delete collection',
                loading: false,
            });
            throw error;
        }
    },

    // Add image to collection
    addImageToCollection: async (collectionId, imageId) => {
        try {
            const data = await collectionService.addImageToCollection(
                collectionId,
                imageId
            );
            set({
                collections: get().collections.map((col) =>
                    col._id === collectionId ? data.data : col
                ),
            });
            return data;
        } catch (error) {
            throw error;
        }
    },

    // Remove image from collection
    removeImageFromCollection: async (collectionId, imageId) => {
        try {
            await collectionService.removeImageFromCollection(collectionId, imageId);
            if (get().currentCollection?._id === collectionId) {
                set({
                    currentCollection: {
                        ...get().currentCollection,
                        images: get().currentCollection.images.filter(
                            (img) => img._id !== imageId
                        ),
                    },
                });
            }
        } catch (error) {
            throw error;
        }
    },

    // Clear error
    clearError: () => set({ error: null }),
}));
