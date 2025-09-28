import OrderItem from '@/components/order_detail/OrderItem';
import SelectPaymentMethod from '@/components/order_detail/SelectPaymentMethod';
import { Branch } from '@/types/branch';
import { Order } from '@/types/order';
import { Table } from '@/types/table';
import { usePage } from '@inertiajs/react';

export default function TableOrders() {
    const { orders, branch, totals } = usePage<{
        orders: Order[];
        totals: {
            [key: string]: number;
        };
        branch: Branch;
        table: Table;
    }>().props;

    return (
        <div className="p-4">
            <p className="font-semibold">Order History</p>
            <div className="mt-3">
                {orders.map((order) => {
                    return order.items?.map((item) => (
                        <OrderItem key={item.id} orderItem={item} menuItem={item.menuItem} currency={branch.currency} />
                    ));
                })}
            </div>
            <div className="bg-gray-100 p-3">
                <div className="border-b py-3 text-muted-foreground">
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Sub total</span>
                        <span className="text-sm">{totals['subtotal']}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Vat</span>
                        <span className="text-sm">{totals['vat']}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-sm font-medium">{totals['total']}</span>
                </div>
            </div>
            <SelectPaymentMethod />
        </div>
    );
}
