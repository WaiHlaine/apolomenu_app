import CategoriesTabs from '@/components/cashier/CategoriesTabs';
import MenuItemsByCategory from '@/components/cashier/MenuItemsByCategory';
import AppLayout from '@/layouts/app-layout';

export default function CashierStock() {
    return (
        <AppLayout>
            <CategoriesTabs />
            <MenuItemsByCategory />
        </AppLayout>
    );
}
