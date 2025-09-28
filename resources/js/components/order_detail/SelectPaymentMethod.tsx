import { Branch } from '@/types/branch';
import { RequestAction } from '@/types/request-action';
import { Table } from '@/types/table';
import { router, usePage } from '@inertiajs/react';
import { CheckCircle2Icon } from 'lucide-react';
import { Button } from '../ui/button';

export default function SelectPaymentMethod() {
    const { branch, table } = usePage<{
        requestAction: RequestAction;
        branch: Branch;
        table: Table;
    }>().props;
    const handlePayBill = () => {
        router.post(
            route('table_request_actions.pay_bill', {
                tenant_id: branch.tenantId,
                branch_id: branch.id,
                table_public_token: table.publicToken,
            }),
        );
    };

    return (
        <div className="mt-10 rounded-md border bg-gray-100 p-4">
            <p className="font-semibold">Select Payment Method</p>
            <div className="flex items-center gap-2 py-3">
                <CheckCircle2Icon className="rounded-full bg-green-600 text-white" />
                <p className="text-sm font-medium">Pay with cash</p>
            </div>
            <div>
                <Button onClick={handlePayBill} className="w-full">
                    Pay bill
                </Button>
            </div>
        </div>
    );
}
