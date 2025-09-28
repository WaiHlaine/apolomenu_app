import OrderItem from '@/components/order_cart/OrderItem';
import { Button } from '@/components/ui/button';
import { useOrderItemStore } from '@/store/useOrderItemsStore';
import { Branch } from '@/types/branch';
import { MenuItem } from '@/types/menu_item';
import { Table } from '@/types/table';
import { router, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

export default function OrderItemsCart() {
    const { table, branch, items } = usePage<{
        table: Table;
        branch: Branch;
        items: MenuItem[];
    }>().props;

    // ✅ create a unique key for tenant + table
    const key = `${branch.id}-${table.id}`;

    // ✅ fetch scoped items
    const allSessionOrderItems = useOrderItemStore((store) => store.orders);
    const orderItems = allSessionOrderItems[key] ?? [];

    const handleOrderClick = () => {
        if (table.publicToken && branch) {
            router.post(
                route('order.store'),
                {
                    branchId: branch.id,
                    tablePublicToken: table.publicToken,
                    items: orderItems,
                    orderType: 'dine_in',
                },
                {
                    onSuccess: () => {
                        // ✅ clear cart + session for this table
                        useOrderItemStore.getState().clearOrder(key);
                        useOrderItemStore.getState().clearSession(key);

                        router.visit(route('branch_menu.index'));
                    },
                },
            );
        }
    };

    // ✅ calculate total per this table
    const totalPrice = orderItems.reduce((acc, item) => {
        const menuItem = items.find((i) => i.id === item.menuItemId);
        const variant = menuItem?.variants.find((v) => v.id === item.variantId);
        const price = Number(variant?.price ?? item.price ?? 0);
        return acc + price * item.quantity;
    }, 0);

    if (orderItems.length == 0)
        return (
            <div className="relative h-[100vh]">
                <div className="p-4">
                    <p className="mb-3 font-semibold">Your cart</p>
                    <div>
                        <p>Your cart is empty</p>
                    </div>
                </div>
            </div>
        );

    return (
        <div className="relative h-[100vh]">
            <div className="p-4">
                <p className="mb-3 font-semibold">Your cart</p>
                {orderItems?.map((item) => {
                    const menuItem = items.find((i) => i.id === item.menuItemId);
                    if (!menuItem) return null;
                    return <OrderItem key={item.variantId} orderItem={item} menuItem={menuItem} currency={branch.currency.toUpperCase()} />;
                })}
            </div>
            {orderItems?.length > 0 && (
                <div className="absolute right-0 bottom-0 left-0 mt-3 rounded-t-md border bg-white p-4 shadow-md">
                    <Button className="flex w-full justify-between" onClick={handleOrderClick}>
                        <div className="flex items-center gap-1">
                            <ShoppingCart />
                            <span className="text-sm font-medium">Place order</span>
                        </div>
                        <p className="text-sm font-medium">
                            {totalPrice} {branch.currency.toUpperCase()}
                        </p>
                    </Button>
                </div>
            )}
        </div>
    );
}
