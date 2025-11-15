import { usePage } from '@inertiajs/react';
import { ImageOffIcon } from 'lucide-react';
interface SummaryItem {
    menu_item_name: string;
    variant_name: string;
    display_name: string;
    total_quantity: number;
    image: string;
}
export default function KitchenOrderSummary() {
    const { summary, filters, tables } = usePage<{
        summary: SummaryItem[];
        filters: {
            show_summary: string;
        };
        tables: unknown[];
    }>().props;

    if (filters.show_summary == 'false' || tables.length == 0) {
        return null;
    }
    return (
        <div className="w-[309px] flex-shrink-0 rounded-md border shadow">
            <div className="border-b">
                <p className="px-2 py-3 text-center font-bold">Order Summary</p>
            </div>
            <div>
                {summary.map((summary) => (
                    <OrderSummaryItem key={`${summary.display_name} ${summary.menu_item_name}`} summary={summary} />
                ))}
            </div>
        </div>
    );
}

const OrderSummaryItem = ({ summary }: { summary: SummaryItem }) => {
    const { filters } = usePage<{
        summary: SummaryItem[];
        filters: {
            show_image: string;
        };
    }>().props;
    return (
        <div className="flex gap-2 border-b p-3">
            {filters.show_image == 'true' && (
                <div>
                    {summary.image ? (
                        <img src={summary.image} className="h-16 w-16 rounded-lg object-cover" />
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-md border">
                            <ImageOffIcon size={16} className="text-muted-foreground" />
                        </div>
                    )}
                </div>
            )}
            <div className="flex-grow">
                <div className="flex justify-between">
                    <p>
                        {summary.variant_name && <span className="font-bold">({summary.variant_name})</span>}
                        <span>{summary.menu_item_name}</span>
                    </p>
                    <p className="font-bold">{summary.total_quantity}</p>
                </div>
            </div>
        </div>
    );
};
