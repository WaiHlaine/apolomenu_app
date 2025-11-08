import { useOpenDrawerStore } from '@/store/admin/useOpenDrawer';
import { router } from '@inertiajs/react';
import { Eye } from 'lucide-react';

export default function OrderRowAction({ orderNumber }: { orderNumber: number }) {
    const setOpenDrawer = useOpenDrawerStore((store) => store.setOpenDrawer);
    return (
        <div className="flex justify-end gap-2">
            <Eye
                className="h-4 w-4 cursor-pointer"
                onClick={() => {
                    setOpenDrawer(true);
                    router.reload({
                        data: {
                            order_number: orderNumber,
                        },
                        only: ['order'],
                    });
                }}
            />
        </div>
    );
}
