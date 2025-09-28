import ImageView from '@/components/ImageView';
import ItemBadges from '@/components/menu_item/ItemBadges';
import ItemPrices from '@/components/menu_item/ItemPrices';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Branch } from '@/types/branch';
import { MenuItem } from '@/types/menu_item';
import { Table } from '@/types/table';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function SearchMenuItems() {
    const {
        menuItems = [],
        branch,
        table,
    } = usePage<{
        menuItems: MenuItem[];
        branch: Branch;
        table: Table;
    }>().props;
    const [search, setSearch] = useState('');
    console.table(menuItems);
    console.log({ menuItems });
    const handleSubmit = () => {
        router.reload({
            data: {
                search,
            },
        });
    };
    const handleBackClick = () => {
        router.visit(
            route('branch_menu.index', {
                tenant_id: branch.tenantId,
                branch_id: branch.id,
                table_public_token: table.publicToken,
            }),
        );
    };
    return (
        <div className="p-4">
            <div className="flex items-center gap-2">
                <Button onClick={handleBackClick} variant={'outline'}>
                    Back
                </Button>
                <Input
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                    autoFocus
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    type="text"
                    placeholder="Search menu items"
                />
            </div>
            {menuItems.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {menuItems.map((item) => (
                        <MenuItemItem key={item.id} item={item} currency={branch.currency} />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center p-4">
                    <p className="text-sm text-muted-foreground">No items found</p>
                </div>
            )}
        </div>
    );
}

const MenuItemItem = ({ item, currency }: { item: MenuItem; currency: string }) => {
    const { table, branch } = usePage<{
        table: Table;
        branch: Branch;
    }>().props;
    const handleItemClick = () => {
        router.visit(
            route('menu_item.show', {
                tenant_id: branch.tenantId,
                branch_id: branch.id,
                table_public_token: table.publicToken,
                id: item.id,
            }),
        );
    };
    return (
        <div className="flex w-full cursor-pointer items-start gap-4 py-4" onClick={handleItemClick}>
            <div className="relative flex-shrink-0">
                <ImageView className="h-[120px] w-[120px] rounded-lg" src={item.image} alt={item.translations[0]?.name} />
            </div>
            <div className="flex-grow border-b pb-4">
                <div>
                    <p className="text-lg font-bold">{item.translations[0]?.name}</p>
                    <p className="text-gray-500">{item.translations[0]?.description}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <div>
                        <ItemPrices variants={item.variants} currency={currency} />
                    </div>
                    <div>
                        <ItemBadges badges={item.badges} />
                    </div>
                </div>
            </div>
        </div>
    );
};
