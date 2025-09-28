import { Branch } from '@/types/branch';
import { Order } from '@/types/order';
import { usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { useState } from 'react';

export default function KitchenOrders({ orders: initialOrders }: { orders: Order[] }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const { branch } = usePage<{
        branch: Branch;
    }>().props;

    useEcho(`branch.${branch.id}.orders`, 'OrderCreatedEvent', (e) => {
        console.log(e.order);
        setOrders((prev) => [...prev, e.order]);
    });

    return (
        <div>
            <h1 className="mb-4 text-xl font-bold">Kitchen Orders</h1>
            <pre>{JSON.stringify({ orders }, null, 2)}</pre>
        </div>
    );
}
