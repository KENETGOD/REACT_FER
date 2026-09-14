import { create } from 'zustand';

export const useHeaderStore = create((set, get) => ({
    headerLogos: [],
    isLoading: true,
    setHeaderLogos: (logos) => set({ headerLogos: Array.isArray(logos) ? logos : [] }),
    setLoading: (loading) => set({ isLoading: loading }),
}));
