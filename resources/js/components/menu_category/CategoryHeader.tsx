import AddNewMenuItemDialog from '../menu_item/AddNewMenuItemDialog';
import { Separator } from '../ui/separator';
import MenuCategorySettingsMenu from './MenuCategorySettingsMenu';

export default function CategoryHeader({ title, totalItems }: { title: string; totalItems: number }) {
    return (
        <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-4">
                <p className="font-semibold">{title}</p>
                <Separator orientation="vertical" />
                <p className="text-sm text-gray-400">{totalItems} items</p>
            </div>
            <div className="flex gap-2">
                <AddNewMenuItemDialog />
                <MenuCategorySettingsMenu />
            </div>
        </div>
    );
}
