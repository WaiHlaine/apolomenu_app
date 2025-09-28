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
import { Button } from '../ui/button';

export default function DeleteMenuItemDialog({ id }: { id: number }) {
    const handleDelete = () => {
        router.delete(route('menu_item.destroy', { id }));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'ghost'} size={'sm'} className="text-red-500">
                    <Trash2Icon size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>This action cannot be undone. This will permanently delete the menu item.</DialogDescription>
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
