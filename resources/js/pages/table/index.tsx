'use client';

import AddNewTableDialog from '@/components/table/AddNewTableDialog';
import DeleteSelectedTablesDialog from '@/components/table/DeleteSelectedTableDialog';
import DownloadAllTables from '@/components/table/DownloadAllTablesButton';
import EditTableDialog from '@/components/table/EditTableDialog';
import ViewQrDialog from '@/components/table/ViewQrDialog';
import { Checkbox } from '@/components/ui/checkbox';
import { getColumns } from '@/components/ui/columns';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { PaginationControls } from '@/components/ui/pagination-controls';
import AppLayout from '@/layouts/app-layout';
import { useSelectedTableStore } from '@/store/table/useSelectedTableStore';
import { PaginatedResponse } from '@/types/pagination';
import { Table } from '@/types/table';
import { router } from '@inertiajs/react';
import { DownloadIcon } from 'lucide-react';
import { useState } from 'react';

interface TableAndQrProps {
    tables: PaginatedResponse<Table>;
}

export default function TableAndQr({ tables }: TableAndQrProps) {
    const [search, setSearch] = useState('');
    const addTable = useSelectedTableStore((store) => store.addTable);
    const removeTable = useSelectedTableStore((store) => store.removeTable);
    const selectedTables = useSelectedTableStore((store) => store.tables);

    const handleFilter = () => {
        router.get(route('tables.index'), { search }, { replace: false, preserveState: true });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleFilter();
    };

    const columns = getColumns<Table>({
        renderIcon: (row) => <ViewQrDialog table={row} />,
        renderIconName: 'Qr',
        withActions: true,
        renderActions: (row) => (
            <div className="flex items-center justify-end gap-2">
                <EditTableDialog table={row} />
                <a href={route('table.qrcode.download', row.id)} target="_blank">
                    <DownloadIcon className="cursor-pointer" />
                </a>
            </div>
        ),
    });

    const rowSelectionColumn = {
        id: 'select',
        header: () => (
            <Checkbox
                checked={selectedTables.length === tables.data.length}
                onCheckedChange={(checked) => {
                    if (checked) tables.data.forEach((t) => addTable(t.id.toString()));
                    else tables.data.forEach((t) => removeTable(t.id.toString()));
                }}
            />
        ),
        cell: ({ row }: { row: { original: Table } }) => {
            const table = row.original as Table;
            const isSelected = selectedTables.includes(table.id.toString());
            return (
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                        if (checked) addTable(table.id.toString());
                        else removeTable(table.id.toString());
                    }}
                />
            );
        },
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tables', href: '/table' }]}>
            <div className="space-y-4 p-6">
                {/* Top bar */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-grow items-center gap-3">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search in table"
                            className="w-64"
                            onKeyDown={handleKeyDown}
                        />
                        <DownloadAllTables />
                        <DeleteSelectedTablesDialog selectedTableIds={selectedTables} />
                    </div>
                    <AddNewTableDialog />
                </div>

                {/* DataTable */}
                <DataTable columns={[rowSelectionColumn, ...columns]} data={tables.data} />

                {/* Pagination */}
                <PaginationControls links={tables.meta.links} />
            </div>
        </AppLayout>
    );
}
