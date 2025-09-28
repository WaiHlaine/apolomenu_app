import { useSelectedTableStore } from '@/store/table/useSelectedTableStore';
import { router } from '@inertiajs/react';
import { DownloadIcon } from 'lucide-react';
import { Button } from '../ui/button';

export default function DownloadAllTables() {
    const tables = useSelectedTableStore((store) => store.tables);
    const downloadAllTables = () => {
        router.get(
            route('tables.qrcodes.download', {
                tables,
            }),
        );
    };
    if (tables.length === 0) {
        return null;
    }
    return (
        <div>
            <Button onClick={downloadAllTables}>
                <DownloadIcon />
                Download QR
            </Button>
        </div>
    );
}
