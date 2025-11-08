import { Branch } from '@/types/branch';
import { Table } from '@/types/table';
import { router, usePage } from '@inertiajs/react';
import { Notebook } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import TableRequestActionsModal from './TableRequestActionsModal';

export default function RequestActionsAndOrderHisotry() {
    const { activeOrderCount, table, branch } = usePage<{
        table: Table;
        branch: Branch;
        activeOrderCount: number;
    }>().props;

    const handleTableOrdersHistoryClick = () => {
        router.visit(
            route('order.active', {
                tenant_id: branch.tenantId,
                table_public_token: table.publicToken,
                branch_id: branch.id,
            }),
        );
    };
    return (
        <div className="absolute top-0 right-0 flex items-center gap-2 p-4">
            <TableRequestActionsModal />
            <div className="relative">
                <Button onClick={handleTableOrdersHistoryClick} size={'icon'} className="rounded-full">
                    <Notebook />
                </Button>
                {activeOrderCount > 0 && (
                    <div className="absolute top-[-4px] right-[-16px]">
                        <Badge className="rounded-full" variant={'destructive'}>
                            {activeOrderCount}
                        </Badge>
                    </div>
                )}
            </div>
        </div>
    );
}
