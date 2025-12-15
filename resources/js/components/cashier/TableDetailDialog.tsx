import { useAppearance } from '@/hooks/use-appearance';
import { orderTypes } from '@/lib/utils';
import { Branch } from '@/types/branch';
import { Order } from '@/types/order';
import { Table } from '@/types/table';
import { router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { ImageOffIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Price from '../common/Price';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import AddNewOrderDialog from './AddNewOrderDialog';
import PaymentDialog from './PaymentDialog';
export default function TableDetailDialog() {
    const { appearance } = useAppearance();
    const { filters, tableOrders, table, isTableOrdersInProgress } = usePage<{
        filters: {
            table: string;
        };
        tableOrders: Order[];
        table: Table;
        branch: Branch;
        isTableOrdersInProgress: boolean;
    }>().props;
    const [open, setOpen] = useState(!!filters.table);

    useEffect(() => {
        if (filters.table) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [filters]);
    const firstOrder = tableOrders[0];
    const totalItems = tableOrders.reduce((acc, order) => acc + (order.items?.length || 0), 0);
    const tableOrderTotal = tableOrders.reduce((acc, order) => acc + (Number(order.total) || 0), 0);
    const tableOrderSubTotal = tableOrders.reduce((acc, order) => acc + (Number(order.subtotal) || 0), 0);
    const tableOrderTaxTotal = tableOrders.reduce((acc, order) => acc + (Number(order.tax) || 0), 0);
    return (
        <Dialog
            open={open}
            onOpenChange={(opened) => {
                if (!opened) {
                    router.reload({
                        data: {
                            table: undefined,
                        },
                    });
                }
                setOpen(opened);
            }}
        >
            <DialogContent className="w-[60vw] p-0">
                <DialogHeader>
                    <DialogTitle className="border-b p-4">Table Detail</DialogTitle>
                </DialogHeader>
                <div className="relative flex h-[80vh] flex-col overflow-auto">
                    <div className="grow">
                        <div className="flex items-center justify-between border-b px-4 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="rounded-md bg-blue-600 p-2">
                                    <span className="font-bold text-white">{table?.name}</span>
                                </div>
                                <div>
                                    <p>
                                        <span className="text-sm font-medium text-muted-foreground">Order Id: </span>
                                        <span className="text-sm font-medium">
                                            {firstOrder?.orderNumber}/{orderTypes[firstOrder?.orderType]}
                                        </span>
                                    </p>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {dayjs(firstOrder?.createdAt).format('MMM, DD YYYY . hh:mm:ss A')}
                                    </p>
                                </div>
                            </div>
                            <div className={twMerge('flex items-center justify-between gap-6 rounded-lg border px-3 py-2 text-sm text-yellow-700')}>
                                <>
                                    <div className="flex items-center gap-2">
                                        <span>Serving</span>
                                    </div>
                                    <div>
                                        <span>{totalItems} items</span>
                                    </div>
                                </>
                            </div>
                        </div>
                        {/* <pre>{JSON.stringify(tableOrders, null, 2)}</pre> */}
                        <div className="px-6">
                            {tableOrders.length > 0 ? (
                                tableOrders.map((order) => {
                                    return order.items?.map((item) => (
                                        <div key={item.id} className="flex gap-2 border-b py-4">
                                            <div>
                                                {item.menuItem?.image ? (
                                                    <img
                                                        className="h-24 w-24 rounded-md object-cover"
                                                        src={item.menuItem?.image}
                                                        alt={item.menuItem?.translations[0]?.name}
                                                    />
                                                ) : (
                                                    <div className="flex h-24 w-24 items-center justify-center rounded-md border bg-gray-50">
                                                        <ImageOffIcon size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-grow flex-col justify-between">
                                                <div>
                                                    <p className="mb-auto text-sm font-medium">
                                                        <span>{item.menuItem?.translations[0]?.name}</span>
                                                        {item.variant?.name ? (
                                                            <span className="font-semibold">({item.variant?.name})</span>
                                                        ) : (
                                                            <span></span>
                                                        )}
                                                    </p>
                                                    {item.notes && (
                                                        <div>
                                                            <p className="text-sm font-medium text-red-500">Note: {item.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex w-full items-center justify-between text-sm font-medium">
                                                    <span>{item.quantity}</span>
                                                    <p className="font-semibold">
                                                        <Price amount={item.totalPrice} className="font-semibold" />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ));
                                })
                            ) : (
                                <div className="flex items-center justify-center p-4">
                                    <p className="text-sm text-muted-foreground">No orders yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        className={twMerge(
                            'sticky bottom-0 z-10 w-full rounded-md border bg-white shadow',
                            appearance == 'dark' ? 'bg-black' : 'bg-white',
                        )}
                    >
                        {firstOrder && (
                            <div className="flex items-center justify-between px-6 py-2">
                                <p className="font-bold">Sub Total</p>
                                <p className="font-bold">
                                    <Price amount={tableOrderSubTotal} className="font-bold" />
                                </p>
                            </div>
                        )}

                        {firstOrder && (
                            <div className="flex items-center justify-between px-6 py-2">
                                <p className="font-bold">Tax</p>
                                <p className="font-bold">
                                    <span></span>
                                    <Price amount={tableOrderTaxTotal} className="font-bold" />
                                </p>
                            </div>
                        )}

                        {firstOrder && (
                            <div className="flex items-center justify-between px-6 py-2">
                                <p className="font-bold">Total Payment</p>
                                <p className="font-bold">
                                    <Price amount={tableOrderTotal} className="font-bold" />
                                </p>
                            </div>
                        )}

                        <div className="flex w-full items-center gap-2 px-6 py-4">
                            <div className="flex-grow">
                                <AddNewOrderDialog />
                            </div>
                            {firstOrder && (
                                <div className="flex-grow">
                                    {isTableOrdersInProgress ? (
                                        <Button className="w-full cursor-not-allowed bg-gray-300 text-white hover:bg-gray-300">Processing...</Button>
                                    ) : (
                                        <PaymentDialog />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
