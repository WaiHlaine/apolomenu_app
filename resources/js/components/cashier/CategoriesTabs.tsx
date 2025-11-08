import { MenuCategory } from '@/types/category';
import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Button } from '../ui/button';

export default function CategoriesTabs() {
    const { categories, category, filters } = usePage<{
        categories: MenuCategory[];
        category: MenuCategory;
        filters: {
            categoryId: string;
        };
    }>().props;

    console.log({
        categories,
        category,
    });
    const handleCategoryClick = (categoryId: number) => {
        router.reload({
            data: {
                category_id: categoryId,
            },
        });
    };
    useEffect(() => {
        if (!category && categories.length > 0) {
            router.reload({
                data: {
                    category_id: categories[0].id,
                },
            });
        }
    }, [categories, category]);

    return (
        <div className="flex items-center gap-2 overflow-x-auto border-b px-8 py-2 shadow">
            {categories.map((category) => (
                <Button
                    variant={filters.categoryId == category.id.toString() ? 'default' : 'secondary'}
                    onClick={() => {
                        handleCategoryClick(category.id);
                    }}
                    size={'sm'}
                    key={category.id}
                >
                    {category.name}
                </Button>
            ))}
        </div>
    );
}
