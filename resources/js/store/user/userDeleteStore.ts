import { User } from '@/types/user';
import { create } from 'zustand';

type UserDeleteStore = {
    user: User | null;
    setUser: (user: User) => void;
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
};

export const useUserDeleteStore = create<UserDeleteStore>((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),
    openDialog: false,
    setOpenDialog: (open: boolean) => set({ openDialog: open }),
}));
