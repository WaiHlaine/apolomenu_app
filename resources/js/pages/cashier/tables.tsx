import CreateNewOrderButton from '@/components/cashier/CreateNewOrder';
import TableDetailDialog from '@/components/cashier/TableDetailDialog';
import TableStatus from '@/components/cashier/TableStatus';
import AppLayout from '@/layouts/app-layout';
import { Branch } from '@/types/branch';
import { Table } from '@/types/table';
import { router, usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';

export default function Tables() {
    const { tables, branch } = usePage<{
        tables: Table[];
        branch: Branch;
    }>().props;
    useEcho(`branch.${branch.id}.orders`, 'OrderCreatedEvent', () => {
        router.reload();
    });

    return (
        <AppLayout>
            {/* Header */}
            <div className="flex items-center justify-between border-b p-3 shadow">
                <div>
                    <p className="text-lg font-semibold">Tables</p>
                </div>
                <div className="flex items-center gap-2">
                    <TableStatus />
                    <CreateNewOrderButton />
                </div>
            </div>

            {/* Tables Grid */}
            <div className="p-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {tables.map((table) => {
                        const isAvailable = table.status === 'available';
                        return (
                            <div
                                onClick={() => {
                                    router.reload({
                                        data: {
                                            table: table.id,
                                        },
                                    });
                                }}
                                key={table.id}
                                className={`flex aspect-square items-center justify-center rounded-2xl text-center text-lg font-medium shadow transition duration-200 ${
                                    isAvailable ? 'bg-white text-gray-800 hover:shadow-md' : 'bg-yellow-300 text-gray-800 hover:brightness-95'
                                } `}
                            >
                                {table.name}
                            </div>
                        );
                    })}
                </div>
                <TableDetailDialog />
            </div>
        </AppLayout>
    );
}
