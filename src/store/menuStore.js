import { create } from 'zustand';
import { getMenuItems } from '@/utils/menuItems';

export const useMenuStore = create((set, get) => ({
    collapsed: false,
    mobileOpen: false,
    setCollapsed: (collapsed) => set({ collapsed }),
    toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
    showMenu: () => set({ mobileOpen: true }),
    hideMenu: () => set({ mobileOpen: false }),

    menuItems: [],
    menuLoaded: false,
    menuLoading: false,

    fetchMenuItems: async () => {
        const { menuLoaded, menuLoading } = get();
        if (menuLoaded || menuLoading) return;

        set({ menuLoading: true });
        set({ menuItems: getMenuItems(), menuLoaded: true, menuLoading: false });
    },

    resetMenu: () => set({ menuItems: [], menuLoaded: false, menuLoading: false }),
}));
