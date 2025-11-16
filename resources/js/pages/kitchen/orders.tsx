import { ShowFlashMessageToast } from '@/components/ShowFlashToastMessage';
import { Branch } from '@/types/branch';
import { router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { toast } from 'sonner';
import KitchenOrdersView from './KitchenOrders';
import KitchenTopBar from './KitchenTopBar';

type KitchenOrdersProps = {
    tables: unknown;
    branch: Branch;
    summary: unknown;
};

export default function KitchenOrders({ branch }: KitchenOrdersProps) {
    // Echo live updates
    useEcho(`branch.${branch.id}.orders`, 'OrderCreatedEvent', () => {
        // Attempt to play notification sound
        window.orderAudio.play().catch(() => {
            toast.warning('Browser blocked the new order sound. Click anywhere to enable audio.');
        });
        router.reload();
    });

    return (
        <div className="flex w-[100vw] flex-col">
            <KitchenTopBar />
            <KitchenOrdersView />
            <ShowFlashMessageToast />
        </div>
    );
}
