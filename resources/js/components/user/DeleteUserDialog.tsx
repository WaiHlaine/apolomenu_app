import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUserDeleteStore } from '@/store/user/userDeleteStore';
import { router } from '@inertiajs/react';
import { Button } from '../ui/button';

export default function DeleteUserDialog() {
    const { openDialog, setOpenDialog, user } = useUserDeleteStore();
    const handleDelete = () => {
        router.delete(route('users.destroy', { id: user?.id }), {
            onSuccess: () => {
                setOpenDialog(false);
            },
        });
    };

    return (
        <Dialog open={openDialog} onOpenChange={(opened) => setOpenDialog(opened)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>This action cannot be undone. This will permanently delete the user.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose>
                        <Button variant={'ghost'}>Cancel</Button>
                    </DialogClose>
                    <Button variant={'destructive'} onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
