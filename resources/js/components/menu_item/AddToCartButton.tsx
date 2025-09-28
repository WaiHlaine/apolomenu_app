import { Button } from '@/components/ui/button';
import { useOrderItemStore } from '@/store/useOrderItemsStore';
import { MenuItem } from '@/types/menu_item';
import { usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function AddToCartButton({ menuItem }: { menuItem: MenuItem }) {
    const { table, branch } = usePage<{ table: { id: number }; branch: { id: number } }>().props;

    // ✅ create a unique key for tenant + table
    const key = `${branch.id}-${table.id}`;

    const addOrUpdateOrderItem = useOrderItemStore((store) => store.addOrUpdateOrderItem);
    const allSessionOrders = useOrderItemStore((store) => store.orders);
    const orderItems = allSessionOrders[key] ?? [];
    const existingItem = orderItems.find((item) => item.menuItemId === menuItem.id);

    const handleAddToCart = () => {
        const selectedVariant =
            menuItem.variants.find((v) => v.id === existingItem?.variantId) ?? (menuItem.variants.length === 1 ? menuItem.variants[0] : undefined);

        if (!selectedVariant) {
            toast.error('Please select a variant');
            return;
        }

        addOrUpdateOrderItem(key, {
            menuItemId: menuItem.id,
            quantity: existingItem ? existingItem.quantity + 1 : 1,
            notes: '',
            variantId: selectedVariant.id,
            price: Number(selectedVariant.price), // ✅ cast to number
        });

        toast.success('Item added to cart');
    };

    return (
        <div>
            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                }}
                size="icon"
                variant="outline"
            >
                <Plus size={12} />
            </Button>
        </div>
    );
}
