import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { Button } from '../ui/button';
export default function DeleteMenuCategoryDialog({ id, onOpenChange, open }: { id: string; open: boolean; onOpenChange: (opened: boolean) => void }) {
    const handleDelete = () => {
        router.delete(route('menu_category.destroy', { id }), {
            onSuccess: () => onOpenChange(false),
        });
    };
    return (
        <Dialog open={open} onOpenChange={(opened) => onOpenChange(opened)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>This action cannot be undone. This will permanently delete the category.</DialogDescription>
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
