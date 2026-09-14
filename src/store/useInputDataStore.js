import { create } from "zustand";

export const useInputDataStore = create((set) => ({
  fieldsData: null,
  setFieldsData: (newData) => set({ fieldsData: newData }),
  showPreviewNode: false,
  setShowPreviewNode: (value) => set({ showPreviewNode: value }),
}));
