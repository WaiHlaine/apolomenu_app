import BackToMenus from '@/components/menu_item/BackToMenus';
import ItemImage from '@/components/menu_item/ItemImage';
import ItemInfo from '@/components/menu_item/ItemInfo';
import ItemQuantitySelect from '@/components/menu_item/ItemQuantitySelect';
import ItemSpecialInstructions from '@/components/menu_item/ItemSpecialInstructions';
import ItemVariantsSelect from '@/components/menu_item/ItemVariantsSelect';
import PublicLayout from '@/layouts/public-layout';
import { useOrderItemStore } from '@/store/useOrderItemsStore';
import { Branch } from '@/types/branch';
import { MenuItem } from '@/types/menu_item';
import { Table } from '@/types/table';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ItemDetail() {
    const { menuItem, branch, table } = usePage().props as unknown as {
        menuItem: MenuItem;
        branch: Branch;
        table: Table;
    };

    // ✅ scoped key for cart
    const key = `${branch.id}-${table.id}`;
    const addOrUpdateOrderItem = useOrderItemStore((store) => store.addOrUpdateOrderItem);

    const [orderItem, setOrderItem] = useState({
        menuItemId: menuItem.id,
        quantity: 1,
        notes: '',
        variantId: menuItem.variants.length === 1 ? menuItem.variants[0].id : '',
    });

    const handleOrderItemChange = (field: keyof typeof orderItem, value: string | number) => {
        const selectedVariant = menuItem.variants.find((v) => v.id == orderItem.variantId);

        if (field !== 'variantId' && !selectedVariant) {
            toast.error('Please select a variant');
            return;
        }

        setOrderItem((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddToCart = () => {
        const selectedVariant = menuItem.variants.find((v) => v.id == orderItem.variantId);
        if (!selectedVariant) {
            toast.error('Please select a variant');
            return;
        }

        addOrUpdateOrderItem(key, {
            ...orderItem,
            price: parseFloat(selectedVariant.price), // ✅ store price
        });

        toast.success('Item added to cart');
    };

    return (
        <PublicLayout>
            <div className="relative h-[100vh]">
                <div className="border-[0.5px]">
                    <ItemImage src={menuItem.image} alt={menuItem.translations[0].name} />
                </div>

                <ItemInfo
                    name={menuItem.translations[0].name}
                    description={menuItem.translations[0].description}
                    variants={menuItem.variants}
                    badges={menuItem.badges}
                    currency={branch.currency.toUpperCase()}
                />

                {menuItem.variants.length > 1 ? (
                    <ItemVariantsSelect
                        onChange={(value) => handleOrderItemChange('variantId', value)}
                        variants={menuItem.variants}
                        currency={branch.currency.toUpperCase()}
                        name={menuItem.translations[0].name}
                    />
                ) : (
                    <div />
                )}

                <ItemSpecialInstructions value={orderItem.notes} onChange={(value) => handleOrderItemChange('notes', value)} />

                <div className="absolute right-0 bottom-0 left-0">
                    <ItemQuantitySelect
                        value={orderItem.quantity}
                        onAddToCart={handleAddToCart}
                        enableAddToCart={!menuItem.outOfStock && !!orderItem.variantId}
                        onChange={(value) => handleOrderItemChange('quantity', value)}
                    />
                </div>

                <div className="absolute top-0 left-0 pt-2 pl-4">
                    <BackToMenus />
                </div>
            </div>
        </PublicLayout>
    );
}
