import { OrderDetailDrawer } from '@/components/admin/OrderDetailDrawer';
import OrdersFilter from '@/components/admin/OrderFilters';
import OrderRowAction from '@/components/admin/OrderRowAction';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { SortableHeader } from '@/components/SortableHeader';
import { Badge } from '@/components/ui/badge';
import { getColumns } from '@/components/ui/columns';
import { DataTable } from '@/components/ui/data-table';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import AppLayout from '@/layouts/app-layout';
import { useOpenDrawerStore } from '@/store/admin/useOpenDrawer';
import { Branch } from '@/types/branch';
import { Order } from '@/types/order';
import { PaginatedResponse } from '@/types/pagination';
import { router, usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';

import { useCallback } from 'react';

export default function AdminOrders() {
    const setOpenDrawer = useOpenDrawerStore((store) => store.setOpenDrawer);
    const { orders, filters, branch } = usePage<{
        orders: PaginatedResponse<Order>;
        order: Order | null;
        filters: {
            search?: string;
            date?: string;
            status?: string;
            type?: string;
            sortField?: string;
            sortDirection?: 'asc' | 'desc';
        };
        branch: Branch;
    }>().props;
    const { play } = useAudioPlayer('/storage/sounds/new_order.mp3');

    useEcho(`branch.${branch.id}.orders`, 'OrderCreatedEvent', () => {
        play();
        router.reload({
            only: ['orders'],
        });
    });

    // Sorting handler
    const handleSort = useCallback(
        (field: string) => {
            const isSameField = filters.sortField === field;
            const newDirection = isSameField && filters.sortDirection === 'asc' ? 'desc' : 'asc';

            router.get(route('admin.orders'), {
                ...filters,
                sortField: field,
                sortDirection: newDirection,
            });
        },
        [filters],
    );
    const handleOrderRowClick = (orderNumber: number) => {
        setOpenDrawer(true);
        router.reload({
            data: {
                order_number: orderNumber,
            },
            only: ['order'],
        });
    };

    const columns = getColumns<Order>({
        withActions: true,
        withBaseColumns: false,
        renderActions: (order: Order) => <OrderRowAction orderNumber={order.orderNumber} />,
        additionalColumns: [
            {
                header: () => (
                    <SortableHeader
                        label="Order Number"
                        field="order_number"
                        currentField={filters.sortField}
                        currentDirection={filters.sortDirection}
                        onSort={handleSort}
                    />
                ),
                accessorKey: 'orderNumber',
                cell: ({ row }) => row.original.orderNumber,
            },
            {
                header: () => (
                    <SortableHeader
                        label="Table"
                        field="table"
                        currentField={filters.sortField}
                        currentDirection={filters.sortDirection}
                        onSort={handleSort}
                    />
                ),
                accessorKey: 'table',
                cell: ({ row }) => <Badge>{row.original.table?.name}</Badge>,
            },
            {
                header: () => (
                    <SortableHeader
                        label="Status"
                        field="status"
                        currentField={filters.sortField}
                        currentDirection={filters.sortDirection}
                        onSort={handleSort}
                    />
                ),
                accessorKey: 'status',
                cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
            },
            {
                header: () => (
                    <SortableHeader
                        label="Quantity"
                        field="quantity"
                        currentField={filters.sortField}
                        currentDirection={filters.sortDirection}
                        onSort={handleSort}
                    />
                ),
                accessorKey: 'quantity',
                cell: ({ row }) => row.original.quantity,
            },
            {
                header: () => {
                    return (
                        <SortableHeader
                            label="Type"
                            field="order_type"
                            currentField={filters.sortField}
                            currentDirection={filters.sortDirection}
                            onSort={handleSort}
                        />
                    );
                },
                accessorKey: 'orderType',
                cell: ({ row }) => {
                    const types: Record<string, string> = {
                        dine_in: 'Dine In',
                        take_away: 'Take Away',
                        delivery: 'Delivery',
                    };

                    if (row.original.orderType in types) {
                        return types[row.original.orderType];
                    } else {
                        return row.original.orderType;
                    }
                },
            },

            {
                header: () => (
                    <SortableHeader
                        label="Sub total"
                        field="subtotal"
                        currentField={filters.sortField}
                        currentDirection={filters.sortDirection}
                        onSort={handleSort}
                    />
                ),
                accessorKey: 'subtotal',
                cell: ({ row }) => row.original.subtotal,
            },

            {
                header: () => (
                    <SortableHeader
                        label="Total"
                        field="total"
                        currentField={filters.sortField}
                        currentDirection={filters.sortDirection}
                        onSort={handleSort}
                    />
                ),
                accessorKey: 'total',
                cell: ({ row }) => row.original.total,
            },
            {
                header: () => (
                    <SortableHeader
                        label="Date"
                        field="created_at"
                        currentField={filters.sortField}
                        currentDirection={filters.sortDirection}
                        onSort={handleSort}
                    />
                ),
                accessorKey: 'createdAt',
                cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
            },
            {
                header: () => (
                    <SortableHeader
                        label="Last updated"
                        field="updated_at"
                        currentField={filters.sortField}
                        currentDirection={filters.sortDirection}
                        onSort={handleSort}
                    />
                ),
                accessorKey: 'updatedAt',
                cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
            },
        ],
    });

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Orders',
                    href: route('admin.orders'),
                },
            ]}
        >
            <OrdersFilter />

            <div className="overflow-x-auto rounded-md p-4">
                <DataTable onRowClick={(order) => handleOrderRowClick(order.orderNumber)} columns={columns} data={orders.data} />
            </div>

            <div className="px-4">
                <p>
                    Total: <span className="font-medium">{orders.meta.total}</span> orders
                </p>
            </div>
            <div className="pb-4">
                <PaginationControls links={orders.meta.links} />
            </div>

            <OrderDetailDrawer />
        </AppLayout>
    );
}
