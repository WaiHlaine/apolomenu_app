import { Button } from '@/components/ui/button';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function KitchenOrderStatusFilterTab() {
    const {
        filters: { order_type },
    } = usePage<{
        filters: {
            order_type: string;
        };
    }>().props;
    const [tab, setTab] = useState<string | undefined>(order_type || 'all');
    const handleTabChange = (value: string | undefined) => {
        setTab(value);
        router.visit(route('kitchen.orders'), {
            data: {
                order_type: value === 'all' ? undefined : value,
            },
        });
    };
    return (
        <div className="flex gap-2 rounded-md bg-gray-100 p-2">
            <Button
                variant={tab === 'all' ? 'default' : 'ghost'}
                onClick={() => {
                    handleTabChange('all');
                }}
            >
                All
            </Button>
            <Button
                variant={tab === 'dine_in' ? 'default' : 'ghost'}
                onClick={() => {
                    handleTabChange('dine_in');
                }}
            >
                Dine in
            </Button>
            <Button
                variant={tab === 'take_out' ? 'default' : 'ghost'}
                onClick={() => {
                    handleTabChange('take_out');
                }}
            >
                Take away
            </Button>
        </div>
    );
}
