import CategoryLayout from '@/layouts/menu_category/layout';

export default function CategoryCreatePage() {
    return (
        <CategoryLayout>
            <div className="flex h-full w-full items-center justify-center">
                <p className="text-muted-foreground">No category</p>
            </div>
        </CategoryLayout>
    );
}
