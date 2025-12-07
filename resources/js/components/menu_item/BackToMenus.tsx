import { Branch } from '@/types/branch';
import { Table } from '@/types/table';
import { router, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';

export default function BackToMenus() {
    const { table, branch } = usePage<{
        table: Table;
        branch: Branch;
    }>().props;
    //go to menus page
    const handleBackClick = () => {
        router.visit(
            route('branch_menu.index', {
                tenant_id: branch.tenantId,
                branch_id: branch.id,
                table_public_token: table.publicToken,
            }),
        );
    };
    return (
        <div>
            <Button variant={'outline'} onClick={handleBackClick} size={'sm'}>
                <ChevronLeft />
                Back
            </Button>
        </div>
    );
}
