import { useSelectedTableStore } from '@/store/table/useSelectedTableStore';
import { Button } from '../ui/button';

export default function DownloadAllTables() {
    const tables = useSelectedTableStore((store) => store.tables);
    if (tables.length === 0) {
        return null;
    }
    return (
        <div>
            <Button>
                <a href={route('tables.qrcodes.download', { tables: tables })} target="_blank">
                    Download QR Codes
                </a>
            </Button>
        </div>
    );
}
