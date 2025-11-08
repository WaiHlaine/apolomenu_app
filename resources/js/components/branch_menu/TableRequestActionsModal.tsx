import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Branch } from '@/types/branch';
import { RequestAction } from '@/types/request-action';
import { Table } from '@/types/table';
import { Deferred, router, usePage } from '@inertiajs/react';
import { ConciergeBell } from 'lucide-react';
import { useState } from 'react';
import { REQUEST_ACTION_ICON_NAMES } from '../request_action/RequestActionForm';
import { Button } from '../ui/button';
export default function TableRequestActionsModal() {
    const [open, setOpen] = useState(false);
    const {
        requestActions = [],
        branch,
        table,
    } = usePage<{
        requestActions: RequestAction[];
        table: Table;
        branch: Branch;
    }>().props;

    const handleRequestActionItemClick = (id: number) => {
        router.post(
            route('table_request_actions.store'),
            {
                table_id: table.id,
                branch_id: branch.id,
                request_action_id: id,
            },
            {
                onFinish: () => {
                    setOpen(false);
                },
            },
        );
    };
    return (
        <Dialog open={open} onOpenChange={(opened) => setOpen(opened)}>
            <DialogTrigger onClick={() => setOpen(true)} asChild>
                <Button size={'icon'} className="rounded-full">
                    <ConciergeBell />
                </Button>
            </DialogTrigger>
            <DialogContent className="z-[100]">
                {/* <DialogHeader>
                    <DialogTitle className="hidden">Are you absolutely sure?</DialogTitle>
                    <DialogDescription className="hidden">
                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader> */}
                <div>
                    <Deferred data={['requestActions']} fallback={<div>Loading...</div>}>
                        <div className="flex flex-col gap-2">
                            {requestActions.length > 0 ? (
                                requestActions.map((requestAction) => (
                                    <div
                                        onClick={() => handleRequestActionItemClick(requestAction.id)}
                                        className="flex cursor-pointer items-center gap-2 p-2"
                                        key={requestAction.id}
                                    >
                                        <div className="rounded-full bg-gray-100 p-2">
                                            {/* <img
                                            className="h-[52px] w-[52px]"
                                            src={`/storage/request_action/${requestAction.icon}.svg`}
                                            alt={`${requestAction.name} icon`}
                                        /> */}
                                            {REQUEST_ACTION_ICON_NAMES.find((icon) => icon.name === requestAction.icon)?.component}
                                        </div>
                                        <p className="text-sm font-medium">{requestAction.name}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center">
                                    <p className="text-muted-foreground">No request actions found</p>
                                </div>
                            )}
                        </div>
                    </Deferred>
                </div>
            </DialogContent>
        </Dialog>
    );
}
