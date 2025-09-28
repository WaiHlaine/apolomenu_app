import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUserDeleteStore } from '@/store/user/userDeleteStore';
import { useUserPasswordResetStore } from '@/store/user/useUserPasswordResetStore';
import { User } from '@/types/user';
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { Button } from '../ui/button';
import UserPasswordResetDialog from './UserPasswordResetDialog';
export default function UserMoreActionsMenu({ user }: { user: User }) {
    const setDeleteUser = useUserDeleteStore((state) => state.setUser);
    const setOpenDeleteDialog = useUserDeleteStore((state) => state.setOpenDialog);
    const setOpenResetPasswordDialog = useUserPasswordResetStore((state) => state.setOpenDialog);
    const setUser = useUserPasswordResetStore((state) => state.setUser);
    const handleResetPasswordClick = () => {
        setUser(user);
        setOpenResetPasswordDialog(true);
    };
    const handleDeleteClick = () => {
        setDeleteUser(user);
        setOpenDeleteDialog(true);
    };
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'ghost'} size={'sm'}>
                        <MoreHorizontalIcon size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleResetPasswordClick}>
                        <PencilIcon />
                        Reset password
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDeleteClick}>
                        <Trash2Icon />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <UserPasswordResetDialog />
        </>
    );
}
