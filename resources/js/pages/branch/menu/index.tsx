import BranchInfo from '@/components/branch_menu/BranchInfo';
import BrowseMenuItems from '@/components/branch_menu/BrowseMenuItems';
import MenuCategoriesNavList from '@/components/branch_menu/MenuCategories';
import RequestActionsAndOrderHisotry from '@/components/branch_menu/RequestActionsAndOrderHistory';
import OrderCart from '@/components/menu_item/OrderCart';
import PublicLayout from '@/layouts/public-layout';

export default function BranchMenus() {
    return (
        <PublicLayout>
            <div className="relative flex h-full flex-col overflow-y-auto">
                <BranchInfo />
                <MenuCategoriesNavList />
                <BrowseMenuItems />
                <OrderCart />
                <RequestActionsAndOrderHisotry />
            </div>
        </PublicLayout>
    );
}
