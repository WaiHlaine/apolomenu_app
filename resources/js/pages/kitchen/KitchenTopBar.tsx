import { Button } from '@/components/ui/button';
import { QrCodeIcon } from 'lucide-react';
import BackButton from './BackButton';
import KitchenOrderStatusFilterTab from './KitchenOrderStatusFilterTab';
import KitchenOrderViewEdit from './KitchenOrderViewEdit';
import KitchenUserProfile from './KitchUserProfile';
import KitchenOrdersReloadButton from './KithchenOrderRefreshButton';

export default function KitchenTopBar() {
    return (
        <div className="flex justify-between border-b p-3 shadow">
            <div className="flex items-center gap-2">
                <div className="flex gap-2">
                    <BackButton />
                    <div className="flex flex-grow items-center gap-2">
                        <Button
                            onClick={() => {
                                window.location.href = '/';
                            }}
                        >
                            <QrCodeIcon />
                        </Button>
                        <p className="font-bold">Apolo Menu</p>
                    </div>
                </div>
                <div>
                    <KitchenOrderStatusFilterTab />
                </div>
            </div>
            <div className="flex items-center justify-between gap-2">
                <KitchenOrdersReloadButton />
                <KitchenOrderViewEdit />
                <KitchenUserProfile />
            </div>
        </div>
    );
}
