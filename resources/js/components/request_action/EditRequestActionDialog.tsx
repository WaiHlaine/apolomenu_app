import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RequestAction } from '@/types/request-action';
import { PencilLine } from 'lucide-react';
import { useState } from 'react';
import RequestActionForm from './RequestActionForm';

export default function EditRequestActionDialog({ action }: { action: RequestAction }) {
    const [openDialog, setOpenDialog] = useState(false);
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant={'ghost'} onClick={() => setOpenDialog(true)}>
                    <PencilLine />
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[720px]">
                <DialogHeader>
                    <DialogTitle>Edit request action</DialogTitle>
                </DialogHeader>

                <RequestActionForm
                    defaultValues={{ name: action.name, icon: action.icon }}
                    action={action}
                    mode={'edit'}
                    onSuccesss={() => setOpenDialog(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
