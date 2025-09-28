import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import TableForm from './TableForm';

export default function AddNewTableDialog() {
    const [openDialog, setOpenDialog] = useState(false);
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpenDialog(true)}>
                    <Plus size={16} />
                    Add new table
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new table</DialogTitle>
                </DialogHeader>

                <TableForm
                    onSuccess={() => setOpenDialog(false)}
                    mode="create"
                    defaultValues={{
                        name: '',
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
