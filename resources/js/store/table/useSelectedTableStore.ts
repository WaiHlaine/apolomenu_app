import { create } from 'zustand';

type SelectedTableStore = {
    tables: string[];
    addTable: (table: string) => void;
    removeTable: (table: string) => void;
    setTables: (tables: string[]) => void;
};

export const useSelectedTableStore = create<SelectedTableStore>((set) => ({
    tables: [],
    addTable: (table: string) => set((state) => ({ tables: [...state.tables, table] })),
    removeTable: (table: string) => set((state) => ({ tables: state.tables.filter((t) => t !== table) })),
    setTables: (tables: string[]) => set({ tables }),
}));
