import Price from '@/components/common/Price';
import BackToMenus from '@/components/menu_item/BackToMenus';
import OrderItem from '@/components/order_detail/OrderItem';
import SelectPaymentMethod from '@/components/order_detail/SelectPaymentMethod';
import PublicLayout from '@/layouts/public-layout';
import { Branch } from '@/types/branch';
import { Order } from '@/types/order';
import { Table } from '@/types/table';
import { router, usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';

export default function TableOrders() {
    const { orders, branch, totals, table } = usePage<{
        orders: Order[];
        totals: {
            [key: string]: number;
        };
        branch: Branch;
        table: Table;
    }>().props;

    const tableOrderTaxTotal = orders.reduce((acc, order) => acc + (Number(order.tax) || 0), 0);

    useEcho(
        `branch.${branch.id}.${table.id}.order_item_status_changed`,
        'OrderItemStatusChangedEvent',
        () => {
            router.reload();
        },
        undefined,
        'public',
    );

    useEcho(
        `branch.${branch.id}.${table.id}.order_completed`,
        'OrderCompletedEvent',
        () => {
            router.reload();
        },
        undefined,
        'public',
    );

    return (
        <PublicLayout>
            <div className="p-4">
                <BackToMenus />
                <p className="mt-2 font-semibold">Order History</p>
                {orders.length > 0 ? (
                    <>
                        <div className="mt-3">
                            {orders.map((order) => {
                                return order.items?.map((item) => (
                                    <OrderItem key={item.id} orderItem={item} menuItem={item.menuItem} currency={branch.currency} />
                                ));
                            })}
                        </div>
                        <div className="bg-gray-100 p-3">
                            <div className="mb-4 border-b py-3 text-muted-foreground">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-sm">Sub total</span>
                                    <Price amount={totals['subtotal']} className="text-sm" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Tax ({`${branch.tax}%`})</span>
                                    <Price amount={tableOrderTaxTotal} className="text-sm" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-lg font-semibold">Total</span>
                                <Price amount={totals['total']} className="text-lg font-medium" />
                            </div>
                        </div>
                        <SelectPaymentMethod />
                    </>
                ) : (
                    <div className="p-4 text-center">
                        <p className="text-muted-foreground">No order items found</p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
