import CategoryBody from '@/components/menu_category/CategoryBody';
import CategoryHeader from '@/components/menu_category/CategoryHeader';
import CategoryLayout from '@/layouts/menu_category/layout';
import { MenuCategory } from '@/types/category';
import { MenuItem } from '@/types/menu_item';
import { usePage } from '@inertiajs/react';

export default function CategoryDetailPage() {
    const { category, menuItems, currency } = usePage().props as unknown as {
        category: MenuCategory;
        menuItems: MenuItem[];
        currency: string;
    };
    return (
        <CategoryLayout>
            <div className="flex flex-col">
                <CategoryHeader title={category.name} totalItems={menuItems.length} />
                <CategoryBody menuItems={menuItems} currency={currency} />
            </div>
        </CategoryLayout>
    );
}
