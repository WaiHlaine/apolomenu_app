import { Button } from '@/components/ui/button';
import { router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ImageOffIcon } from 'lucide-react';
dayjs.extend(relativeTime);

interface TableOrder {
    table_id: number;
    table_name: string;
    date: string;
    order_type: string;
    order_number: number;
    order_id: number;
    items: {
        id: number;
        menu_item_id: number;
        variant_id: number;
        menu_item_name: string;
        variant_name: string;
        quantity: number;
        notes: null | string;
        image: string;
        status: string;
    }[];
}
export default function KitchenActiveOrderByTable() {
    const { tables } = usePage<{
        tables: TableOrder[];
    }>().props;
    return (
        <div className="flex gap-2">
            {tables.map((table) => (
                <KitchenTableOrder table={table} key={table.table_id} />
            ))}
        </div>
    );
}

const ORDER_TYPES: Record<string, string> = {
    dine_in: 'Dine in',
    take_out: 'Take out',
    delivery: 'Delivery',
};
const KitchenTableOrder = ({ table }: { table: TableOrder }) => {
    const { filters } = usePage<{
        filters: {
            show_image: string;
        };
    }>().props;
    const handleOrderComplete = () => {
        router.post(route('kitchen.tables.orders.complete', table.table_id), undefined, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handleOrderItemComplete = (id: number) => {
        router.post(route('kitchen.order_item.complete', id), undefined, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    return (
        <div className="w-[309px] rounded-md border shadow">
            <div className="flex justify-between rounded-t-md border-b bg-lime-300 px-3 py-4">
                <div>
                    <p className="font-bold">{table.table_name}</p>
                    <p className="font-semibold text-muted-foreground">{ORDER_TYPES[table.order_type]}</p>
                </div>
                <div className="mt-auto">
                    <p className="font-semibold text-muted-foreground">{dayjs(table.date).fromNow()}</p>
                </div>
            </div>
            {table.items.map((item) => (
                <div key={`${item.id} ${item.menu_item_id} ${item.variant_id}`} className="border-b">
                    <div className="flex w-full gap-2 p-3">
                        {filters.show_image == 'true' && (
                            <div>
                                {item.image ? (
                                    <img src={item.image} className="h-16 w-16 rounded-lg object-cover" />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-md border">
                                        <ImageOffIcon size={16} className="text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex flex-grow justify-between">
                            <div>
                                <p>
                                    {item.variant_name && <span className="font-bold">({item.variant_name})</span>}
                                    <span>{item.menu_item_name}</span>
                                </p>
                                {item.notes && <p className="mt-1 text-red-500">{`"${item.notes} "`}</p>}
                            </div>
                            <div>
                                <p className="font-semibold">{item.quantity}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-2 text-end">
                        <Button
                            variant={'outline'}
                            size={'sm'}
                            onClick={() => {
                                handleOrderItemComplete(item.id);
                            }}
                        >
                            Complete
                        </Button>
                    </div>
                </div>
            ))}
            <div className="p-2">
                <Button onClick={handleOrderComplete} className="w-full">
                    Complete
                </Button>
            </div>
        </div>
    );
};
