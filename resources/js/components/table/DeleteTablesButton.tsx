import { useSelectedTableStore } from '@/store/table/useSelectedTableStore';
import { router } from '@inertiajs/react';
import { Trash2Icon } from 'lucide-react';
import { Button } from '../ui/button';

export default function DeleteTablesButton() {
    const tables = useSelectedTableStore((store) => store.tables);
    const deleteTables = () => {
        router.delete(
            route('tables.destroyMultiple', {
                tables,
            }),
        );
    };
    if (tables.length === 0) {
        return null;
    }
    return (
        <div>
            <Button onClick={deleteTables}>
                <Trash2Icon />
            </Button>
        </div>
    );
}
