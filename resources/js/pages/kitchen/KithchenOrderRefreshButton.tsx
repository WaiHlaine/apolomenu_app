import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Loader, RefreshCcw } from 'lucide-react';
import { useState } from 'react';

export default function KitchenOrdersReloadButton() {
    const [refreshing, setRefreshing] = useState(false);
    const handleReload = () => {
        router.reload({
            onFinish: () => {
                setRefreshing(false);
            },
            onStart: () => {
                setRefreshing(true);
            },
        });
    };
    return (
        <div>
            <Button onClick={handleReload}>{refreshing ? <Loader /> : <RefreshCcw />}</Button>
        </div>
    );
}
