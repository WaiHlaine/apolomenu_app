import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import RequestActionForm from './RequestActionForm';

export default function AddNewRequestActionDialog() {
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpenDialog(true)}>
                    <Plus size={16} />
                    Add new request action
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[720px]">
                <DialogHeader>
                    <DialogTitle>Add new request action</DialogTitle>
                </DialogHeader>

                <RequestActionForm defaultValues={{ name: '', icon: '' }} mode={'create'} onSuccesss={() => setOpenDialog(false)} />
            </DialogContent>
        </Dialog>
    );
}
