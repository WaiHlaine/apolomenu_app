import { Table } from '@/types/table';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TableDetailStore = {
    openTableDetailDialog: boolean;
    setOpenTableDetailDialog: (open: boolean) => void;
    table: Table | null;
    setTable: (table: Table) => void;
};

export const useTableDetailStore = create<TableDetailStore>()(
    persist(
        (set) => ({
            table: null,
            setTable: (table: Table) => set({ table: table }),
            openTableDetailDialog: false,
            setOpenTableDetailDialog: (open: boolean) => set({ openTableDetailDialog: open }),
        }),
        {
            name: 'multi-tenant-order-store',
        },
    ),
);
