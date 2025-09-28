import BranchInfo from '@/components/branch_menu/BranchInfo';
import BrowseMenuItems from '@/components/branch_menu/BrowseMenuItems';
import MenuCategoriesNavList from '@/components/branch_menu/MenuCategories';
import RequestActionsAndOrderHisotry from '@/components/branch_menu/RequestActionsAndOrderHistory';
import OrderCart from '@/components/menu_item/OrderCart';
import PublicLayout from '@/layouts/public-layout';

export default function BranchMenus() {
    return (
        <PublicLayout>
            <div className="relative h-[100vh]">
                <BranchInfo />
                <MenuCategoriesNavList />
                <BrowseMenuItems />
                <div className="sticky right-0 bottom-0 left-0">
                    <OrderCart />
                </div>
                <RequestActionsAndOrderHisotry />
            </div>
        </PublicLayout>
    );
}
