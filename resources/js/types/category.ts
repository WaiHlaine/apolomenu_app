export type MenuCategory = {
    id: number;
    name: string;
    description: string;
    image: string;
    position: number;
    branchId: number;
    available: boolean;
    createdAt: string; // ISO datetime string
    updatedAt: string; // ISO datetime string
    deletedAt: string | null;
};
