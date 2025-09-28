'use client';

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
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface DeleteDialogProps {
    id: string | number;
    resource: string; // e.g., "request-actions", "users"
    title?: string; // optional custom title
    description?: string; // optional custom description
    onDeleted?: () => void; // callback after deletion
}

export default function DeleteDialog({ id, resource, title, description, onDeleted }: DeleteDialogProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route(`${resource}.destroy`, { id }), {
            onSuccess: () => {
                setOpen(false);
                onDeleted?.();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger onClick={() => setOpen(true)}>
                <Button variant={'ghost'}>
                    <Trash2Icon className="text-red-500" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title ?? 'Are you absolutely sure?'}</DialogTitle>
                    <DialogDescription>{description ?? 'This action cannot be undone. This will permanently delete this item.'}</DialogDescription>
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
