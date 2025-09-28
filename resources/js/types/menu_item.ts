export type MenuItemTranslation = {
    id: number;
    menuItem_Id: number;
    languageId: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
};

export type MenuItemVariant = {
    id: number;
    name: string;
    price: string; // Laravel returns decimal as string
    position: number;
    menuItemId: number;
    outOfStock: boolean;
    createdAt: string;
    updatedAt: string;
};

export type Badge = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
};

export type MenuItem = {
    id: number;
    image: string | null;
    position: number;
    outOfStock: boolean;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    translations: MenuItemTranslation[];
    variants: MenuItemVariant[];
    badges: Badge[];
};
