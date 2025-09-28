'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';

interface DeleteSelectedTablesDialogProps {
    selectedTableIds: string[];
}

export default function DeleteSelectedTablesDialog({ selectedTableIds }: DeleteSelectedTablesDialogProps) {
    const [open, setOpenDialog] = useState(false);
    const handleDelete = () => {
        router.delete(route('tables.destroyMultiple'), {
            data: { tables: selectedTableIds },
            onSuccess: () => {
                setOpenDialog(false);
            },
        });
    };

    if (selectedTableIds.length === 0) return null;

    return (
        <Dialog open={open} onOpenChange={(opened) => setOpenDialog(opened)}>
            <DialogTrigger>
                <Button variant="outline">
                    <Trash2Icon className="text-red-500" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Delete Selected Tables</DialogTitle>
                <DialogDescription>Are you sure you want to delete {selectedTableIds.length} selected table(s)?</DialogDescription>
                <div className="mt-4 flex justify-end gap-2">
                    <DialogClose>Cancel</DialogClose>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
