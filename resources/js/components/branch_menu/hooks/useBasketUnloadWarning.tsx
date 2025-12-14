import { useOrderItemStore } from '@/store/useOrderItemsStore';
import { useEffect } from 'react';

export function useBasketUnloadWarning() {
    const hasItems = useOrderItemStore((state) => Object.keys(state.orders).length > 0);
    const clearAllOrders = useOrderItemStore((state) => state.clearAllOrders);

    useEffect(() => {
        if (!hasItems) return;

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();

            // Required for Chrome / Safari
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasItems]);

    useEffect(() => {
        const handlePageHide = () => {
            clearAllOrders();
        };

        window.addEventListener('pagehide', handlePageHide);
        return () => window.removeEventListener('pagehide', handlePageHide);
    }, [clearAllOrders]);
}
