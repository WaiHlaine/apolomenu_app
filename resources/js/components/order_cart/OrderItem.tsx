import ImageView from '@/components/ImageView';
import { Button } from '@/components/ui/button';
import { OrderItem as OrderItemType, useOrderItemStore } from '@/store/useOrderItemsStore';
import { MenuItem } from '@/types/menu_item';
import { usePage } from '@inertiajs/react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';

export default function OrderItem({ orderItem, menuItem, currency }: { orderItem: OrderItemType; menuItem: MenuItem; currency: string }) {
    const { table, branch } = usePage<{ table: { id: number }; branch: { id: number } }>().props;

    // ✅ scoped key for multi-tenant
    const key = `${branch.id}-${table.id}`;

    const selectedVariant = menuItem.variants.find((v) => v.id == orderItem.variantId);
    const totalPrice = orderItem.price * orderItem.quantity;

    const addOrUpdateOrderItem = useOrderItemStore((store) => store.addOrUpdateOrderItem);
    const removeOrderItem = useOrderItemStore((store) => store.removeOrderItem);

    const handleQuantityChange = (value: number) => {
        addOrUpdateOrderItem(key, {
            ...orderItem,
            quantity: value,
        });
    };

    return (
        <div className="flex items-start gap-2 border-b py-3">
            <ImageView className="h-[96px] w-[96px] rounded-lg" src={menuItem.image} alt={menuItem.translations[0].name} />
            <div className="flex-grow">
                <span className="text-lg font-bold">{menuItem.translations[0].name}</span>
                {selectedVariant && selectedVariant.name && <span className="ml-1 font-bold">{`(${selectedVariant.name})`}</span>}

                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {orderItem.quantity > 1 ? (
                            <Button size="icon" variant="outline" onClick={() => handleQuantityChange(orderItem.quantity - 1)}>
                                <Minus />
                            </Button>
                        ) : (
                            <Button size="icon" variant="outline" onClick={() => removeOrderItem(key, orderItem.menuItemId, orderItem.variantId)}>
                                <Trash2 />
                            </Button>
                        )}
                        <p className="text-sm font-medium">{orderItem.quantity}</p>
                        <Button size="icon" variant="outline" onClick={() => handleQuantityChange(orderItem.quantity + 1)}>
                            <Plus />
                        </Button>
                    </div>
                    <div>
                        <p>
                            {totalPrice} {currency}
                        </p>
                        <div className="text-end">
                            <Button size="icon" variant="outline" onClick={() => removeOrderItem(key, orderItem.menuItemId, orderItem.variantId)}>
                                <Trash2 />
                            </Button>
                        </div>
                    </div>
                </div>
                {orderItem.notes && (
                    <div className="mt-2">
                        <Badge variant={'destructive'}>{orderItem.notes}</Badge>
                    </div>
                )}
            </div>
        </div>
    );
}
