import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '../ui/button';
export default function DeleteRequestActionDialog({ id }: { id: string }) {
    const [open, onOpenChange] = useState(false);
    const handleDelete = () => {
        router.delete(route('request-actions.destroy', { id }), {
            onSuccess: () => onOpenChange(false),
        });
    };
    return (
        <Dialog open={open} onOpenChange={(opened) => onOpenChange(opened)}>
            <DialogTrigger onClick={() => onOpenChange(true)}>
                <Button variant={'destructive'}>Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>This action cannot be undone. This will permanently delete the request action.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose>
                        <Button variant={'outline'}>Cancel</Button>
                    </DialogClose>
                    <Button variant={'destructive'} onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
