import AddNewCategoryDialog from '@/components/menu_category/AddNewCategoryDialog';
import CategoryNavList from '@/components/menu_category/CategoryNavList';
import CategoryTitle from '@/components/menu_category/CategoryTitle';
import { PropsWithChildren } from 'react';
import AppLayout from '../app-layout';

export default function CategoryLayout({ children }: PropsWithChildren) {
    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Category',
                    href: route('menu_category.index'),
                },
            ]}
        >
            <div className="flex h-full w-full items-start gap-5 p-8">
                <div className="w-[301px] shrink-0 rounded-md border">
                    <div className="border-b px-5 py-4">
                        <CategoryTitle />
                    </div>
                    <CategoryNavList />
                    <div className="p-2">
                        <AddNewCategoryDialog />
                    </div>
                </div>
                <div className="h-full flex-grow rounded-md border">{children}</div>
            </div>
        </AppLayout>
    );
}
