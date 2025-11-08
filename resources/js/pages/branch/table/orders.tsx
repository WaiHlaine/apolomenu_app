import BackToMenus from '@/components/menu_item/BackToMenus';
import OrderItem from '@/components/order_detail/OrderItem';
import SelectPaymentMethod from '@/components/order_detail/SelectPaymentMethod';
import Price from '@/components/Price';
import PublicLayout from '@/layouts/public-layout';
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
                            <div className="border-b py-3 text-muted-foreground">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Sub total</span>
                                    <Price price={totals['subtotal']} className="text-sm" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Vat</span>
                                    <span className="text-sm">{`${branch.vat}%`}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-sm font-medium">Total</span>
                                <Price price={totals['total']} className="text-sm font-medium" />
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
