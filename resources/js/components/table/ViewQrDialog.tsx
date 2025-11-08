import { Table } from '@/types/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

export default function ViewQrDialog({ table }: { table: Table }) {
    return (
        <Dialog>
            <DialogTrigger>
                <img src={table.qrCode} className="h-10 w-10" alt={table.name} />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Table - {table.name}</DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-center">
                    <img src={table.qrCode} className="h-[300px] w-[300px]" alt={table.name} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
