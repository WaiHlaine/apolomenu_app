import { MenuCategory } from '@/types/category';
import { router, usePage } from '@inertiajs/react';
// import { GripVerticalIcon } from 'lucide-react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Switch } from '../ui/switch';

export default function CategoryNavList() {
    const props = usePage().props as unknown as {
        categories: MenuCategory[];
    };
    const { id } = route().params as { id: string };
    if (!props.categories) return null;
    return (
        <div className="flex flex-col gap-3 border-b px-2 py-3">
            {(props.categories ?? []).map((category) => {
                return <CategoryNavItem key={category.id} category={category} isActive={category.id.toString() === id} />;
            })}
        </div>
    );
}

const CategoryNavItem = ({ category, isActive }: { category: MenuCategory; isActive: boolean }) => {
    // Keep local state for optimistic update
    const [available, setAvailable] = useState(category.available);

    const toggleAvailability = () => {
        // Optimistically update UI
        setAvailable((prev) => !prev);

        router.put(
            route('menu_category.toggle_availability', { id: category.id }),
            {},
            {
                onError: () => {
                    // Rollback if request fails
                    setAvailable(category.available);
                },
            },
        );
    };

    const navigateToCategory = () => {
        router.get(route('menu_category.show', { id: category.id }));
    };

    return (
        <div
            onClick={navigateToCategory}
            className={twMerge(
                'flex cursor-pointer items-center justify-between gap-2 rounded-md px-4 py-1.5 hover:bg-gray-100',
                isActive ? 'bg-gray-100' : '',
            )}
        >
            {/* <GripVerticalIcon className="h-6 w-6 text-gray-400" /> */}
            <p className="max-w-[150px] flex-grow truncate capitalize">{category.name}</p>
            <Switch checked={available} onClick={toggleAvailability} />
        </div>
    );
};
