import { Branch } from '@/types/branch';
import { router, usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';

export default function NotificationsEventListener() {
    const { branch } = usePage<{
        branch: Branch;
    }>().props;
    useEcho(`branch.${branch.id}.orders`, 'OrderCreatedEvent', () => {
        router.reload({
            only: ['notifications'],
        });
    });
    return null;
}
