import { Branch } from '@/types/branch';
import { MenuCategory } from '@/types/category';
import { MenuItem } from '@/types/menu_item';
import { router, usePage } from '@inertiajs/react';
import { ImageOffIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import ItemBadges from '../menu_item/ItemBadges';
import ItemPrices from '../menu_item/ItemPrices';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Switch } from '../ui/switch';
export default function MenuItemsByCategory() {
    const { category, menuItems, branch } = usePage<{
        category: MenuCategory;
        menuItems: MenuItem[];
        branch: Branch;
    }>().props;

    const handleMenuItemOutOfStockClick = (menuItemId: number) => {
        router.post(route('cashier.menu_item.out_of_stock', menuItemId));
    };

    const handleMenuItemVariantOutOfStockClick = (menuItemVariantId: number) => {
        router.post(route('cashier.menu_item_variant.out_of_stock', menuItemVariantId));
    };

    return (
        <div className="px-4 py-5 sm:px-6 md:px-8">
            <div className="py-2">
                <p className="text-lg font-semibold">{category?.name}</p>
            </div>

            {/* Grid layout — mobile first */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {menuItems.map((item) => (
                    <div key={item.id} className="flex flex-col">
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="relative">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.translations[0]?.name}
                                            className="h-[160px] w-full rounded-lg object-cover sm:h-[180px]"
                                        />
                                    ) : (
                                        <div className="flex h-[160px] w-full items-center justify-center rounded-md border">
                                            <ImageOffIcon size={16} className="text-muted-foreground" />
                                        </div>
                                    )}
                                    {item.outOfStock && (
                                        <>
                                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50"></div>
                                            <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                                                <Badge variant="destructive">Out of stock</Badge>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </DialogTrigger>

                            <DialogContent className="max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Stock</DialogTitle>
                                </DialogHeader>

                                <DialogFooter>
                                    <div className="w-full space-y-4">
                                        {item.image ? (
                                            <img src={item.image} alt={item.translations[0]?.name} className="w-full rounded-lg object-cover" />
                                        ) : (
                                            <div className="flex h-[309px] w-full items-center justify-center rounded-md border">
                                                <ImageOffIcon size={16} className="text-muted-foreground" />
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <p className="mt-2 font-medium">{item.translations[0]?.name}</p>
                                            <div className="flex items-center gap-2">
                                                {item.outOfStock && <span className="text-sm font-medium text-red-500">Out of stock</span>}
                                                <Switch checked={item.outOfStock} onClick={() => handleMenuItemOutOfStockClick(item.id)} />
                                            </div>
                                        </div>

                                        <div className="mt-2">
                                            <ItemBadges badges={item.badges} />
                                        </div>

                                        {item.variants.length > 1 && (
                                            <div className="mt-4">
                                                <p className="font-medium text-muted-foreground">Variants</p>
                                                <div className="flex flex-col gap-2 p-2">
                                                    {item.variants.map((variant) => (
                                                        <div key={variant.id} className="flex items-center justify-between">
                                                            <p
                                                                className={twMerge(
                                                                    'text-sm font-medium',
                                                                    variant.outOfStock && 'text-muted-foreground',
                                                                )}
                                                            >
                                                                {variant.name}
                                                            </p>
                                                            <div className="flex items-center gap-2">
                                                                {variant.outOfStock && (
                                                                    <span className="text-sm font-medium text-red-500">Out of stock</span>
                                                                )}
                                                                <Switch
                                                                    checked={variant.outOfStock}
                                                                    onClick={() => handleMenuItemVariantOutOfStockClick(variant.id)}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <p className="mt-2 truncate text-sm font-medium">{item.translations[0]?.name}</p>
                        <ItemPrices variants={item.variants} className="text-sm text-muted-foreground" currency={branch.currency} />
                    </div>
                ))}
            </div>
        </div>
    );
}
