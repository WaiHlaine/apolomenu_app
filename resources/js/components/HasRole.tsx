import { User } from '@/types/user';
import { usePage } from '@inertiajs/react';

export default function HasRole({ role, children }: { role: 'admin' | 'cashier' | 'kitchen'; children: React.ReactNode }) {
    const {
        auth: { user },
    } = usePage<{
        auth: {
            user: User;
        };
    }>().props;

    if (!user) return null; // not logged in

    const roles = user.roles || [];

    const hasRole = role ? roles.map((role) => role.name).includes(role.toLowerCase()) : false;

    if (role && !hasRole) return null;

    return <>{children}</>;
}
