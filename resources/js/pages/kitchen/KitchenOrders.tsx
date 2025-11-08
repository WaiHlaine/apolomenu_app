import { usePage } from '@inertiajs/react';
import KitchenOrderSummary from './KitchenOrderSummary';
import KitchenActiveOrderByTable from './KithcenActiveOrdersByTable';

export default function KitchenOrdersView() {
    const { tables = [] } = usePage<{
        tables: unknown[];
    }>().props;

    if (tables.length == 0) {
        return (
            <div className="flex h-full items-center justify-center px-2 py-3">
                <p className="text-muted-foreground">No orders</p>
            </div>
        );
    }
    return (
        <div className="flex h-full flex-grow gap-2 overflow-scroll px-2 py-3">
            <KitchenOrderSummary />
            <KitchenActiveOrderByTable />
        </div>
    );
}
