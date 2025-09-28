import { User } from '@/types/user';
import { create } from 'zustand';

type UserPasswordResetStore = {
    user: User | null;
    setUser: (user: User) => void;
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
};

export const useUserPasswordResetStore = create<UserPasswordResetStore>((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),
    openDialog: false,
    setOpenDialog: (open: boolean) => set({ openDialog: open }),
}));
