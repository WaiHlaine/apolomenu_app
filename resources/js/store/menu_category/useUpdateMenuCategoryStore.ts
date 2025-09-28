import { MenuCategory } from '@/types/category';
import { create } from 'zustand';

type MenuCategoryUpdateStore = {
    menuCategory: MenuCategory;
    setUpdateCategory: (newCategory: MenuCategory) => void;
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
};

export const useMenuCategoryUpdateStore = create<MenuCategoryUpdateStore>((set) => ({
    //filled with defaults so that we don't need to check null safety
    menuCategory: {
        id: 0,
        image: '',
        name: '',
        description: '',
        position: 0,
        createdAt: '',
        updatedAt: '',
        deletedAt: '',
        available: true,
        branchId: 0,
    },
    setUpdateCategory: (menuCategory: MenuCategory) => set({ menuCategory }),
    openDialog: false,
    setOpenDialog: (open: boolean) => set({ openDialog: open }),
}));
