import { MenuItem as TMenuItem } from '@/types/menu_item';
import EditMenuItemDialog from '../menu_item/EditMenuItemDialog';
import MenuItem from '../menu_item/MenuItem';
import { ScrollArea } from '../ui/scroll-area';

export default function CategoryBody({ menuItems, currency }: { menuItems: TMenuItem[]; currency: string }) {
    if (menuItems.length === 0) {
        return (
            <div className="flex h-[80vh] flex-grow items-center justify-center">
                <p className="text-gray-400">No menu items found</p>
            </div>
        );
    }

    return (
        <div className="flex-grow px-3">
            <ScrollArea className="h-[80vh]">
                {menuItems.map((menuItem) => (
                    <MenuItem key={menuItem.id} menuItem={menuItem} currency={currency} />
                ))}
            </ScrollArea>
            <EditMenuItemDialog />
        </div>
    );
}
