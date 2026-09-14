import { create } from 'zustand';

export const useLoaderStore = create((set) => ({
    loader: false,
    showLoader: () => set({ loader: true }),
    hideLoader: () => set({ loader: false }),
}));