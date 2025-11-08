import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCashierOrderItemStore } from '@/store/cashier/useCashierOrderItemsStore';
import { Branch } from '@/types/branch';
import { MenuItem, MenuItemVariant } from '@/types/menu_item';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';

export default function MenuItemDialog() {
    const { branch } = usePage<{
        branch: Branch;
    }>().props;
    const menuItem = useCashierOrderItemStore((store) => store.menuItem);
    const [selectedVariant, setVariant] = useState<MenuItemVariant | undefined>(menuItem?.variants[0]);
    const [note, setNote] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const openMenuItemDetailDialog = useCashierOrderItemStore((store) => store.openMenuItemDetailModal);
    const setOpenDialog = useCashierOrderItemStore((store) => store.setOpenMenuItemDetailModal);
    const orderUniqueKey = `${branch.id}`;
    const addOrUpdateOrderItem = useCashierOrderItemStore((store) => store.addOrUpdateOrderItem);

    const handleAddToCartClick = (menuItem: MenuItem, variant: MenuItemVariant) => {
        addOrUpdateOrderItem(orderUniqueKey, {
            menuItem: menuItem,
            quantity: quantity,
            notes: note,
            variantId: variant.id,
            price: Number(variant.price),
        });
    };

    return (
        <Dialog
            key={menuItem?.id}
            open={openMenuItemDetailDialog}
            onOpenChange={(opened) => {
                setQuantity(1);
                setNote('');
                setOpenDialog(opened);
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{menuItem?.translations[0]?.name}</DialogTitle>
                </DialogHeader>

                <div>
                    <div>{menuItem?.translations[0]?.name}</div>
                    <div>{menuItem?.translations[0]?.description}</div>
                    <div className="border p-2">
                        <p>Variants</p>
                        <RadioGroup>
                            {(menuItem?.variants.length || 0) > 1 &&
                                menuItem?.variants.map((variant) => (
                                    <div key={variant.id}>
                                        <p>{variant.name}</p>
                                        <p>{variant.price}</p>
                                        <Label>{variant.outOfStock ? 'Out of stock' : 'In stock'}</Label>
                                        <RadioGroupItem
                                            checked={variant.id == selectedVariant?.id}
                                            disabled={variant.outOfStock}
                                            value={variant.id.toString()}
                                            id={variant.id.toString()}
                                            onChange={() => {
                                                setVariant(variant);
                                            }}
                                            onClick={() => {
                                                setVariant(variant);
                                            }}
                                        />
                                    </div>
                                ))}
                        </RadioGroup>
                        {/* textarea note */}
                        <div className="border p-2">
                            <p>Notes</p>
                            <Textarea placeholder="eg. No onion" value={note} onChange={(e) => setNote(e.target.value)} />
                        </div>
                    </div>
                    {/* actions */}
                    <DialogFooter>
                        {/* quantity */}
                        <div className="border p-2">
                            <p>Quantity</p>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => {
                                        if (quantity <= 1) return;
                                        setQuantity(quantity - 1);
                                    }}
                                >
                                    -
                                </Button>
                                <p>{quantity}</p>
                                <Button
                                    onClick={() => {
                                        setQuantity(quantity + 1);
                                    }}
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                        <Button
                            onClick={() => {
                                if (!selectedVariant) return;
                                if (!menuItem) return;
                                handleAddToCartClick(menuItem, selectedVariant);
                                setOpenDialog(false);
                            }}
                        >
                            Add to cart
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
