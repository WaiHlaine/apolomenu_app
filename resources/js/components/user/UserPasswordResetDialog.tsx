import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUserPasswordResetStore } from '@/store/user/useUserPasswordResetStore';
import { router } from '@inertiajs/react';
import { AlertTriangleIcon } from 'lucide-react';

export default function UserPasswordResetDialog() {
    const { user, openDialog, setOpenDialog } = useUserPasswordResetStore();

    const onSubmit = () => {
        router.patch(
            route('users.reset_password', {
                id: user?.id.toString(),
            }),
            undefined,
            {
                onSuccess: () => {
                    setOpenDialog(false);
                },
            },
        );
    };

    if (!user) return null;

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl font-semibold text-red-600">
                        <AlertTriangleIcon size={40} />
                        Reset password
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <div>
                        <p>
                            Are you sure you want to reset
                            <span className="font-semibold">
                                {` `}
                                {user.name}
                            </span>
                            <span>'s password?</span>
                        </p>
                    </div>

                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setOpenDialog(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            variant={'destructive'}
                            onClick={(e) => {
                                e.preventDefault();
                                onSubmit();
                            }}
                        >
                            Reset password
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
