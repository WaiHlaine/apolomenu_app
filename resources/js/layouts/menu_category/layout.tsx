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
            <div className="flex h-full w-full flex-col items-start gap-5 overflow-y-auto p-8 md:flex-row">
                <div className="w-full shrink-0 rounded-md border md:w-[301px]">
                    <div className="border-b px-6 py-5">
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
