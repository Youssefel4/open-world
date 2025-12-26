import { create } from 'zustand';
import { imageService } from '../services/imageService';

export const useImageStore = create((set, get) => ({
    images: [],
    currentImage: null,
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
    total: 0,

    // Fetch images
    fetchImages: async (params = {}, append = false) => {
        set({ loading: true, error: null });
        try {
            const data = await imageService.getImages({
                page: params.page || get().page,
                limit: params.limit || 20,
                ...params,
            });
            set({
                images: append ? [...get().images, ...data.data] : data.data,
                total: data.total,
                page: data.page,
                hasMore: data.page < data.pages,
                loading: false,
            });
            return data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch images',
                loading: false,
            });
            throw error;
        }
    },

    // Load more images (infinite scroll)
    loadMore: async (params = {}) => {
        const nextPage = get().page + 1;
        await get().fetchImages({ ...params, page: nextPage }, true);
    },

    // Fetch single image
    fetchImage: async (id) => {
        set({ loading: true, error: null });
        try {
            const data = await imageService.getImage(id);
            set({ currentImage: data.data, loading: false });
            return data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch image',
                loading: false,
            });
            throw error;
        }
    },

    // Upload image
    uploadImage: async (formData) => {
        set({ loading: true, error: null });
        try {
            const data = await imageService.uploadImage(formData);
            set({
                images: [data.data, ...get().images],
                loading: false,
            });
            return data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to upload image',
                loading: false,
            });
            throw error;
        }
    },

    // Update image
    updateImage: async (id, updateData) => {
        set({ loading: true, error: null });
        try {
            const data = await imageService.updateImage(id, updateData);
            set({
                images: get().images.map((img) =>
                    img._id === id ? data.data : img
                ),
                currentImage: data.data,
                loading: false,
            });
            return data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to update image',
                loading: false,
            });
            throw error;
        }
    },

    // Delete image
    deleteImage: async (id) => {
        set({ loading: true, error: null });
        try {
            await imageService.deleteImage(id);
            set({
                images: get().images.filter((img) => img._id !== id),
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to delete image',
                loading: false,
            });
            throw error;
        }
    },

    // Toggle like
    toggleLike: async (id) => {
        try {
            const data = await imageService.toggleLike(id);
            set({
                images: get().images.map((img) =>
                    img._id === id
                        ? {
                            ...img,
                            likes: data.data.isLiked
                                ? [...img.likes, 'current-user']
                                : img.likes.filter((l) => l !== 'current-user'),
                        }
                        : img
                ),
            });
            return data;
        } catch (error) {
            throw error;
        }
    },

    // Toggle save
    toggleSave: async (id) => {
        try {
            const data = await imageService.toggleSave(id);
            set({
                images: get().images.map((img) =>
                    img._id === id
                        ? {
                            ...img,
                            savedBy: data.data.isSaved
                                ? [...img.savedBy, 'current-user']
                                : img.savedBy.filter((s) => s !== 'current-user'),
                        }
                        : img
                ),
            });
            return data;
        } catch (error) {
            throw error;
        }
    },

    // Add comment
    addComment: async (id, text) => {
        try {
            const data = await imageService.addComment(id, text);
            if (get().currentImage?._id === id) {
                set({
                    currentImage: {
                        ...get().currentImage,
                        comments: [...get().currentImage.comments, data.data],
                    },
                });
            }
            return data;
        } catch (error) {
            throw error;
        }
    },

    // Delete comment
    deleteComment: async (imageId, commentId) => {
        try {
            await imageService.deleteComment(imageId, commentId);
            if (get().currentImage?._id === imageId) {
                set({
                    currentImage: {
                        ...get().currentImage,
                        comments: get().currentImage.comments.filter(
                            (c) => c._id !== commentId
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

    // Reset state
    reset: () =>
        set({
            images: [],
            currentImage: null,
            page: 1,
            hasMore: true,
            total: 0,
        }),
}));
