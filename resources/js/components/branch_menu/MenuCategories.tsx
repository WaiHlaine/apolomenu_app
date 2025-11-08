import { Branch } from '@/types/branch';
import { MenuCategory } from '@/types/category';
import { Table } from '@/types/table';
import { router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';

export default function MenuCategoriesNavList() {
    const { categories, category, branch, table } = usePage().props as unknown as {
        categories: MenuCategory[];
        category?: MenuCategory;
        branch: Branch;
        table: Table;
    };

    const handleCategoryClick = (categoryId: number) => {
        router.get(
            route('branch_menu.index', {
                tenant_id: branch.tenantId,
                branch_id: branch.id,
                table_public_token: table.publicToken,
            }),
            { category_id: categoryId },
            { preserveScroll: true, preserveState: true },
        );
    };

    const handleSearchClick = () => {
        router.visit(
            route('menu_item.filter', {
                tenant_id: branch.tenantId,
                branch_id: branch.id,
                table_public_token: table.publicToken,
            }),
        );
    };

    return (
        <div className="sticky top-0 z-50 flex w-full items-center gap-2 border-b bg-white p-4 shadow-sm">
            <div className="flex-shrink-0">
                <Button onClick={handleSearchClick} size={'icon'} variant={'outline'}>
                    <Search />
                </Button>
            </div>
            <div className="flex flex-grow items-center gap-2 overflow-x-auto">
                {categories.map((c) => (
                    <Button key={c.id} onClick={() => handleCategoryClick(c.id)} variant={category?.id === c.id ? 'default' : 'secondary'}>
                        {c.name}
                    </Button>
                ))}
            </div>
        </div>
    );
}
