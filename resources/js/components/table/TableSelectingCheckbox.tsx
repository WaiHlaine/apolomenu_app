import { useSelectedTableStore } from '@/store/table/useSelectedTableStore';
import { Table } from '@/types/table';
import { Checkbox } from '@radix-ui/react-checkbox';

export default function TableSelectingCheckbox({ allTables }: { allTables: Table[] }) {
    const { tables, setTables } = useSelectedTableStore();
    // const checkboxRef = useRef<HTMLInputElement | null>(null);

    const allIds = allTables.map((t) => t.id.toString());
    // const hasSomeSelected = tables.length > 0;
    const isAllSelected = tables.length === allTables.length;

    // ✅ Handle indeterminate state
    // useEffect(() => {
    //     if (checkboxRef.current) {
    //         checkboxRef.current.indeterminate = hasSomeSelected && !isAllSelected;
    //     }
    // }, [hasSomeSelected, isAllSelected]);

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setTables([]); // deselect all
        } else {
            setTables(allIds); // select all
        }
    };

    return (
        <Checkbox
            // ref={checkboxRef}
            checked={isAllSelected}
            onCheckedChange={toggleSelectAll}
            className="h-4 w-4 rounded border border-gray-400 data-[state=checked]:bg-blue-600"
        />
    );
}
