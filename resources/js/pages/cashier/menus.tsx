import MenuItemDialog from '@/components/cashier/MenuItemDialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { useCashierOrderItemStore } from '@/store/cashier/useCashierOrderItemsStore';
import { Branch } from '@/types/branch';
import { MenuCategory } from '@/types/category';
import { MenuItem } from '@/types/menu_item';
import { Table } from '@/types/table';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Menus() {
    const {
        menuItems = [],
        categories = [],
        category,
        branch,
        tables,
    } = usePage<{
        branch: Branch;
        menuItems: MenuItem[];
        categories: MenuCategory[];
        category: MenuCategory;
        tables: Table[];
    }>().props;
    console.log({
        tables,
    });
    const orders = useCashierOrderItemStore((store) => store.orders);
    const clearOrder = useCashierOrderItemStore((store) => store.clearOrder);
    const [selectedTable, setSelectedTable] = useState<string>('');
    const [selectedOrderType, setSelectedOrderType] = useState<string>('dine_in');
    const orderUniqueKey = `${branch.id}`;
    const currentBranchOrders = orders[orderUniqueKey];
    const handleCategoryClick = (categoryId: number) => {
        router.get(
            route('cashier.menus'),
            { category_id: categoryId },
            {
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleMenuItemOutOfStockClick = (menuItemId: number) => {
        router.post(route('cashier.menu_item.out_of_stock', menuItemId));
    };
    const handleMenuItemVariantOutOfStockClick = (menuItemVariantId: number) => {
        router.post(route('cashier.menu_item_variant.out_of_stock', menuItemVariantId));
    };

    const handlePlaceOrder = () => {
        router.post(
            route('order.storeByCashier'),
            {
                tableId: selectedTable,
                orderType: selectedOrderType,
                items: currentBranchOrders,
            },
            {
                onSuccess: () => {
                    clearOrder(orderUniqueKey);
                    setSelectedTable('');
                    setSelectedOrderType('dine_in');
                },
            },
        );
    };

    const setMenuItem = useCashierOrderItemStore((store) => store.setMenuItem);
    const setOpenDialog = useCashierOrderItemStore((store) => store.setOpenMenuItemDetailModal);
    return (
        <AppLayout>
            {categories.length > 0 ? (
                <div className="p-4">
                    <div className="flex gap-2 overflow-x-auto">
                        {categories.map((ctg) => (
                            <div key={ctg.id}>
                                <Button variant={ctg.id == category.id ? 'default' : 'secondary'} onClick={() => handleCategoryClick(ctg.id)}>
                                    {ctg.name}
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-4 p-4">
                        <div className="flex flex-grow gap-4">
                            {menuItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="border p-2 shadow"
                                    onClick={() => {
                                        setOpenDialog(true);
                                        setMenuItem(item);
                                    }}
                                >
                                    <div>
                                        <p>{item.translations[0]?.name}</p>
                                        <p>{item.translations[0]?.description}</p>
                                        <Label>{item.outOfStock ? 'Out of stock' : 'In stock'}</Label>
                                        <Switch checked={!item.outOfStock} onClick={() => handleMenuItemOutOfStockClick(item.id)} />
                                    </div>
                                    <div className="border p-2">
                                        <p>Variants</p>
                                        {item.variants.length > 1 &&
                                            item.variants.map((variant) => (
                                                <div key={variant.id}>
                                                    <p>{variant.name}</p>
                                                    <p>{variant.price}</p>
                                                    <Label>{variant.outOfStock ? 'Out of stock' : 'In stock'}</Label>
                                                    <Switch
                                                        checked={!variant.outOfStock}
                                                        onClick={() => handleMenuItemVariantOutOfStockClick(variant.id)}
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-[30vw]">
                            <Label>Table</Label>
                            <Select value={selectedTable} onValueChange={(value) => setSelectedTable(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select table" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tables.map((table) => (
                                        <SelectItem value={`${table.id}`} key={`${table.id}`}>
                                            {table.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Label>Order type</Label>
                            <Select value={selectedOrderType} onValueChange={(value) => setSelectedOrderType(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select order type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={'dine_in'}>Dine In</SelectItem>
                                    <SelectItem value={'take_out'}>Take Away</SelectItem>
                                    <SelectItem value={'delivery'}>Delivery</SelectItem>
                                </SelectContent>
                            </Select>
                            <pre>{JSON.stringify(currentBranchOrders, null, 2)}</pre>
                            <Button onClick={handlePlaceOrder}>Place order</Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    <p className="text-muted-foreground">No categories found</p>
                </div>
            )}
            <MenuItemDialog />
        </AppLayout>
    );
}
