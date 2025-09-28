import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table } from '@/types/table';
import { PencilLine } from 'lucide-react';
import { useState } from 'react';
import TableForm from './TableForm';

export default function EditTableDialog({ table }: { table: Table }) {
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button size={'sm'} variant={'ghost'} onClick={() => setOpenDialog(true)}>
                    <PencilLine size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit table</DialogTitle>
                </DialogHeader>

                <TableForm
                    onSuccess={() => setOpenDialog(false)}
                    mode="edit"
                    table={table}
                    defaultValues={{
                        name: table.name,
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
