import { create } from 'zustand';

type OpenDrawerStore = {
    openDrawer: boolean;
    setOpenDrawer: (open: boolean) => void;
};

export const useOpenDrawerStore = create<OpenDrawerStore>((set) => ({
    openDrawer: false,
    setOpenDrawer: (open: boolean) => set({ openDrawer: open }),
}));
