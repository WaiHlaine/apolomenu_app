'use client';

import DeleteDialog from '@/components/DeleteDialog';
import AddNewRequestActionDialog from '@/components/request_action/AddNewRequestActionDialog';
import EditRequestActionDialog from '@/components/request_action/EditRequestActionDialog';
import SearchRequestAction from '@/components/request_action/SearchRequestAction';
import { getColumns } from '@/components/ui/columns';
import { DataTable } from '@/components/ui/data-table';
import { PaginationControls } from '@/components/ui/pagination-controls';
import AppLayout from '@/layouts/app-layout';
import { PaginatedResponse } from '@/types/pagination';
import { RequestAction } from '@/types/request-action';

const columns = getColumns<RequestAction>({
    withActions: true,
    renderIcon: (action) => <img src={`/storage/request_action/${action.icon}.svg`} alt={action.name} className="h-10 w-10" />,
    renderActions: (action) => (
        <div className="flex justify-end space-x-2">
            <EditRequestActionDialog action={action} />
            <DeleteDialog
                id={action.id}
                resource="request-actions"
                title="Delete Request Action?"
                description={`Are you sure you want to delete "${action.name}"?`}
            />
        </div>
    ),
});

export default function RequestActionsIndex({ actions }: { actions: PaginatedResponse<RequestAction> }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Request Actions', href: route('request-actions.index') }]}>
            <div className="space-y-4 p-6">
                {/* Top bar */}
                <div className="flex items-center justify-between">
                    <SearchRequestAction />
                    <AddNewRequestActionDialog />
                </div>

                {/* DataTable */}
                <DataTable columns={columns} data={actions.data} />

                {/* Pagination */}
                <PaginationControls links={actions.meta.links} />
            </div>
        </AppLayout>
    );
}
