import { create } from 'zustand';


export const useAuthStore = create((set) => ({
  showChangePassword: false, 
  
  
  setShowChangePassword: (value) => set({ showChangePassword: value }),
  
  resetAuthStore: () => set({ showChangePassword: false }),
}));