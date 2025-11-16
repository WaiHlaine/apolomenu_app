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
    // Echo live updates
    const { play } = useAudioPlayer('/storage/sounds/new_order.mp3');
    useEcho(`branch.${branch.id}.orders`, 'OrderCreatedEvent', () => {
        // Attempt to play notification sound
        play();
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
