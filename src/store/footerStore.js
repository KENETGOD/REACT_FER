import { create } from 'zustand';

export const useFooterStore = create((set, get) => ({
    footerLogos: [],
    isLoading: true,
    setFooterLogos: (logos) => set({ footerLogos: Array.isArray(logos) ? logos : [] }),
    setLoading: (loading) => set({ isLoading: loading }),
}));