import { ShowFlashMessageToast } from '@/components/ShowFlashToastMessage';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import { Branch } from '@/types/branch';
import { router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import KitchenOrdersView from './KitchenOrders';
import KitchenTopBar from './KitchenTopBar';

type KitchenOrdersProps = {
    tables: unknown;
    branch: Branch;
    summary: unknown;
};

export default function KitchenOrders({ branch }: KitchenOrdersProps) {
    const { play } = useAudioPlayer('/storage/sounds/new_order.mp3');
    // Echo live updates
    useEcho(`branch.${branch.id}.orders`, 'OrderCreatedEvent', () => {
        play();
        router.reload();
    });

    return (
        <div className="flex h-[100vh] w-[100vw] flex-col">
            <KitchenTopBar />
            <KitchenOrdersView />
            <ShowFlashMessageToast />
        </div>
    );
}
