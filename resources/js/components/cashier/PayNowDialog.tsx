import { router } from '@inertiajs/react';
import { CheckCircle2Icon, DollarSignIcon } from 'lucide-react';
import Price from '../common/Price';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from '../ui/dialog';

export default function PayNowDialog({
    totalAmount,
    taxAmount,
    subTotalAmount,
    paymentMethod = 'cash',
    tableId,
}: {
    totalAmount?: number;
    taxAmount?: number;
    subTotalAmount?: number;
    paymentMethod?: string;
    tableId: number;
}) {
    console.log({ totalAmount, taxAmount, subTotalAmount, paymentMethod });
    const handlePayNow = () => {
        router.post(route('cashier.tables.pay_bill', tableId), undefined, {
            onSuccess: () => {
                router.reload({
                    data: {
                        table: undefined,
                    },
                });
            },
        });
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full">
                    <DollarSignIcon className="mr-2 h-4 w-4" />
                    Pay Now
                </Button>
            </DialogTrigger>
            <DialogContent>
                <div>
                    <CheckCircle2Icon className="mx-auto h-16 w-16 rounded-full bg-primary text-white" />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-semibold">Payment Done?</h2>
                    <p className="text-muted-foreground">Dont' forget to say thank you to the customer!</p>
                </div>
                <div>
                    <div className="mt-4 flex justify-between">
                        <span className="text-gray-900">Subtotal</span>
                        <Price amount={subTotalAmount || 0} className="font-bold" />
                    </div>
                    <div className="mt-4 flex justify-between">
                        <span className="text-gray-900">Tax</span>
                        <Price amount={taxAmount || 0} className="font-bold" />
                    </div>
                    <div className="mt-4 border border-b border-dashed"></div>
                    <div className="mt-4 flex justify-between">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <Price amount={totalAmount || 0} className="text-lg font-bold" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className="w-full" onClick={handlePayNow}>
                        Confirm Payment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
