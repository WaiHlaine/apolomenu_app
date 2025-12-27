import { useAppearance } from '@/hooks/use-appearance';
import { OrderItem, useEditOrderItemsStore } from '@/store/cashier/useEditOrderItemsStore';
import { Branch } from '@/types/branch';
import { Order } from '@/types/order';
import { router, usePage } from '@inertiajs/react';
import { ImageOffIcon, Minus, Plus, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Price from '../common/Price';
import OrderStatusBadge from '../OrderStatusBadge';
import { Button } from '../ui/button';

export default function PreviouslyOrderedItems() {
    // const [] = useState(false);
    const [addedPreviousOrders, setAddedPreviouspOrders] = useState(false);
    const {
        tableOrders,
        branch,
        filters: { table },
    } = usePage<{
        filters: {
            table: string;
            categoryId: string;
        };
        tableOrders: Order[];
        branch: Branch;
    }>().props;

    const { appearance } = useAppearance();

    const allOrders = useEditOrderItemsStore((store) => store.orders);
    const uniqueKey = `${branch.id}`;
    const orders = allOrders[uniqueKey];
    // const clearOrder = useEditOrderItemsStore((store) => store.clearOrder);
    const setOrderItems = useEditOrderItemsStore((store) => store.setOrderItems);
    const addOrUpdateOrderItem = useEditOrderItemsStore((store) => store.addOrUpdateOrderItem);
    const decreaseOrderItem = useEditOrderItemsStore((store) => store.decreaseOrderItem);
    const removeOrderItem = useEditOrderItemsStore((store) => store.removeOrderItem);
    const getTotalAmount = useEditOrderItemsStore((store) => store.getTotalAmount);
    // const handleClearOrder = () => {
    //     clearOrder(uniqueKey);
    // };
    const handleIncreaseOrderItem = (orderItem: OrderItem) => {
        addOrUpdateOrderItem(uniqueKey, {
            menuItem: orderItem.menuItem,
            quantity: 1,
            notes: orderItem.notes,
            variantId: orderItem.variantId,
            price: orderItem.price,
            status: orderItem.status,
        });
    };

    const handleDecreaseOrderItem = (orderItem: OrderItem) => {
        decreaseOrderItem(uniqueKey, {
            menuItem: orderItem.menuItem,
            quantity: orderItem.quantity > 1 ? orderItem.quantity - 1 : 1,
            notes: orderItem.notes,
            variantId: orderItem.variantId,
            price: orderItem.price,
            status: orderItem.status,
        });
    };

    const handleRemoveOrderItem = (orderItem: OrderItem) => {
        removeOrderItem(uniqueKey, orderItem.menuItem.id, orderItem.variantId);
    };

    const subtotal = getTotalAmount(uniqueKey);
    const taxAmount = subtotal * (branch.tax / 100);
    const total = subtotal + taxAmount;

    useEffect(() => {
        if (tableOrders && tableOrders.length > 0 && !addedPreviousOrders) {
            setAddedPreviouspOrders(true);
            const previousOrders: OrderItem[] = [];
            tableOrders.forEach((order) => {
                const items = order.items ?? [];
                return items.forEach((orderItem) => {
                    previousOrders.push({
                        menuItem: orderItem.menuItem!,
                        quantity: orderItem.quantity,
                        notes: orderItem.notes || '',
                        variantId: orderItem.variantId!,
                        price: Number(orderItem.variant?.price || 0),
                        status: orderItem.status,
                    });
                });
            });
            setOrderItems(uniqueKey, previousOrders);
        }
    }, [addedPreviousOrders, setOrderItems, tableOrders, uniqueKey]);

    const handleSaveOrderItems = () => {
        const items = orders
            ?.filter((orderItem) => orderItem.status != 'completed')
            .map((orderItem) => {
                return {
                    menuItemId: orderItem.menuItem.id,
                    variantId: orderItem.variantId,
                    quantity: orderItem.quantity,
                    notes: orderItem.notes,
                };
            });
        router.patch(
            route('cashier.tables.replace-items', {
                table: table,
            }),
            {
                tableId: table,
                items: items,
                notes: '',
                orderType: 'dine_in',
            },
        );
    };

    return (
        <div className="relative h-[80vh] overflow-y-auto px-6">
            <div className="flex items-center justify-between border-b py-2">
                <p className="text-sm font-semibold">Added items</p>
                {/* <Button onClick={handleClearOrder} variant={'outline'}>
                    <Trash2Icon />
                    Reset
                </Button> */}
            </div>
            <div>
                {orders?.map((orderItem) => {
                    const isOrderCompleted = orderItem.status == 'completed';
                    return (
                        <div key={orderItem.menuItem?.id} className="flex gap-2 border-b py-2">
                            <div>
                                {orderItem.menuItem?.image ? (
                                    <img
                                        className="h-24 w-24 rounded-md object-cover"
                                        src={orderItem.menuItem.image}
                                        alt={orderItem.menuItem.translations[0].name}
                                    />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-md border">
                                        <ImageOffIcon size={16} className="text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-grow flex-col justify-between text-sm">
                                <div>
                                    <p>
                                        {orderItem.menuItem?.translations[0].name}
                                        {orderItem.menuItem?.variants?.find((v) => v.id == orderItem.variantId)?.name && (
                                            <span className="text-sm font-semibold">
                                                ({orderItem.menuItem.variants.find((v) => v.id == orderItem.variantId)?.name})
                                            </span>
                                        )}
                                    </p>
                                    {orderItem.notes && (
                                        <p>
                                            <span className="text-sm font-medium text-red-500">Note: {orderItem.notes}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-4">
                                        {orderItem.quantity == 1 ? (
                                            <Button disabled={isOrderCompleted} onClick={() => handleRemoveOrderItem(orderItem)}>
                                                <Trash2Icon />
                                            </Button>
                                        ) : (
                                            <Button disabled={isOrderCompleted} onClick={() => handleDecreaseOrderItem(orderItem)}>
                                                <Minus />
                                            </Button>
                                        )}
                                        <p className="font-semibold">{orderItem.quantity}</p>
                                        <Button
                                            disabled={isOrderCompleted}
                                            onClick={() => {
                                                handleIncreaseOrderItem(orderItem);
                                            }}
                                        >
                                            <Plus />
                                        </Button>
                                    </div>
                                    <div className="flex gap-2">
                                        <OrderStatusBadge status={orderItem.status} />
                                        <Price amount={Number(orderItem.price) * orderItem.quantity} className="font-bold" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className={twMerge('mt-6 rounded-md border bg-white p-3 text-sm', appearance == 'dark' ? 'bg-black' : 'bg-white')}>
                <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <Price amount={subtotal} className="font-bold" />
                </div>
                <div className="mt-4 flex items-center justify-between border-b border-dashed pb-5">
                    <span>Tax ({branch.tax}%)</span>
                    <Price amount={taxAmount} className="font-bold" />
                </div>
                <div className="mt-5 flex items-center justify-between">
                    <span className="font-bold">Total</span>
                    <Price amount={total} className="font-bold" />
                </div>

                <Button onClick={handleSaveOrderItems} className="mt-2 mb-5 w-full">
                    Save and send to kitchen
                </Button>
            </div>
        </div>
    );
}
