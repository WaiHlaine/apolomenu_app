import { MenuItem } from '@/types/menu_item';
import { create } from 'zustand';

type MenuItemUpdateStore = {
    menuItem: MenuItem;
    setUpdateItem: (newItem: MenuItem) => void;
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
};

export const useMenuItemUpdateStore = create<MenuItemUpdateStore>((set) => ({
    //filled with defaults so that we don't need to check null safety
    menuItem: {
        id: 0,
        categoryId: 0,
        image: '',
        variants: [],
        badges: [],
        translations: [],
        position: 0,
        createdAt: '',
        updatedAt: '',
        deletedAt: '',
        outOfStock: false,
    },
    setUpdateItem: (newItem: MenuItem) => set({ menuItem: newItem }),
    openDialog: false,
    setOpenDialog: (open: boolean) => set({ openDialog: open }),
}));
