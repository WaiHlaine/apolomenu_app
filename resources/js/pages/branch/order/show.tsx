import Price from '@/components/common/Price';
import OrderItem from '@/components/order_detail/OrderItem';
import SelectPaymentMethod from '@/components/order_detail/SelectPaymentMethod';
import { Branch } from '@/types/branch';
import { Order } from '@/types/order';
import { router, usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';

export default function OrderDetail() {
    const { order, branch } = usePage<{
        order: Order;
        branch: Branch;
    }>().props;
    useEcho(`branch.${branch.id}.${order.tableId}.order_item_status_changed`, 'OrderItemStatusChangedEvent', () => {
        router.reload();
    });
    return (
        <div className="p-4">
            <p className="font-semibold">Order History</p>
            {(order.items?.length ?? 0) > 0 ? (
                <>
                    <div className="mt-3">
                        {order.items?.map((item) => (
                            <OrderItem key={item.id} orderItem={item} menuItem={item.menuItem} currency={branch.currency} />
                        ))}
                    </div>
                    <div className="bg-gray-100 p-3">
                        <div className="mb-4 border-b py-3 text-muted-foreground">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm">Sub total</span>
                                <Price className="text-sm" amount={order.subtotal} />
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-sm">Tax ({`${branch.tax}%`})</span>
                                <span className="text-sm">{`${branch.tax}%`}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <span className="text-lg font-medium">Total</span>
                            <Price className="text-lg font-medium" amount={order.total} />
                        </div>
                    </div>
                    <SelectPaymentMethod />
                </>
            ) : (
                <div className="p-4">
                    <p className="text-muted-foreground">No order items found</p>
                </div>
            )}
        </div>
    );
}
