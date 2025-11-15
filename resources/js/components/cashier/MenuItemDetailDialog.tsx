import { useCashierOrderItemStore } from '@/store/cashier/useCashierOrderItemsStore';
import { Branch } from '@/types/branch';
import { MenuItem, MenuItemVariant } from '@/types/menu_item';
import { Textarea } from '@headlessui/react';
import { usePage } from '@inertiajs/react';
import { ImageOffIcon, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import ItemBadges from '../menu_item/ItemBadges';
import ItemPrices from '../menu_item/ItemPrices';
import ItemVariantsSelect from '../menu_item/ItemVariantsSelect';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
export default function MenuItemDetailDialog({ item }: { item: MenuItem }) {
    const [notes, setNotes] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [variant, setVariant] = useState(item.variants[0].id.toString());
    const {
        branch,
        filters: { table },
    } = usePage<{
        branch: Branch;
        filters: {
            table: string;
        };
    }>().props;
    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    const selectedVariant = item.variants.find((v) => v.id.toString() == variant);
    const orderUniqueKey = `${branch.id}-${table}`;
    console.log({
        orderUniqueKey,
    });
    const addOrUpdateOrderItem = useCashierOrderItemStore((store) => store.addOrUpdateOrderItem);
    const [open, setOpen] = useState(false);
    const handleAddToCartClick = (menuItem: MenuItem, variant: MenuItemVariant) => {
        console.log({
            menuItem: menuItem,
            quantity: quantity,
            notes: notes,
            variantId: variant.id,
            price: Number(variant.price),
        });
        addOrUpdateOrderItem(orderUniqueKey, {
            menuItem: menuItem,
            quantity: quantity,
            notes: notes,
            variantId: variant.id,
            price: Number(variant.price),
        });
        setOpen(false);
        setNotes('');
        setQuantity(1);
        setVariant(item.variants[0].id.toString());
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                {item.image ? (
                    <img className="h-32 w-32 rounded-md object-cover" src={item.image} alt={item.translations[0]?.name} />
                ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-md border">
                        <ImageOffIcon size={16} className="text-muted-foreground" />
                    </div>
                )}
            </DialogTrigger>
            <DialogContent className="p-0">
                <DialogHeader className="border-b p-4">
                    <DialogTitle>{item.translations[0]?.name}</DialogTitle>
                </DialogHeader>
                <div className="relative">
                    <div className="max-h-[80vh] overflow-y-auto p-4">
                        <div>
                            {item.image ? (
                                <img className="h-[300px] w-[468px] rounded-t-md object-cover" src={item.image} alt={item.translations[0]?.name} />
                            ) : (
                                <div className="flex h-[300px] w-[468px] items-center justify-center rounded-md border">
                                    <ImageOffIcon size={16} className="text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="mt-2">
                            <p>{item.translations[0]?.name}</p>
                            <p>{item.translations[0]?.description}</p>
                            <div className="mt-2 flex justify-between">
                                <ItemBadges badges={item.badges} />
                                <ItemPrices variants={item.variants} currency={branch.currency} className="text-sm text-muted-foreground" />
                            </div>
                        </div>
                        <div className="mt-4">
                            {item.variants.length > 1 && (
                                <ItemVariantsSelect
                                    onChange={setVariant}
                                    name={item.translations[0]?.name}
                                    currency={branch.currency}
                                    variants={item.variants}
                                />
                            )}
                        </div>
                        <div className="mt-6 mb-[100px]">
                            <p>Special instructions</p>
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className={'w-full'}
                                rows={4}
                                placeholder="Eg. no onions, please"
                            />
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 left-0 w-full rounded-md border bg-white p-4 shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Button onClick={decreaseQuantity}>
                                    <Minus />
                                </Button>
                                <span className="px-2 text-sm font-medium">{quantity}</span>
                                <Button onClick={increaseQuantity}>
                                    <Plus />
                                </Button>
                            </div>
                            <Button
                                onClick={() => {
                                    if (selectedVariant) {
                                        handleAddToCartClick(item, selectedVariant);
                                    }
                                }}
                            >
                                <span>Add to cart</span>
                                <span className="ml-2 uppercase">
                                    {branch.currency} {Number(selectedVariant?.price) * quantity}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
