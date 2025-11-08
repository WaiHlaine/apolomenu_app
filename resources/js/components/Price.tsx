import { Branch } from '@/types/branch';
import { usePage } from '@inertiajs/react';

export default function Price({ price, className }: { price: number; className?: string }) {
    const { branch } = usePage<{
        branch: Branch;
    }>().props;
    return <span className={className}>{`${price} ${branch.currency.toUpperCase()}`}</span>;
}
