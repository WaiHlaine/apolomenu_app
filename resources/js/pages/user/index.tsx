'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getColumns } from '@/components/ui/columns';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger } from '@/components/ui/multi-select';
import { PaginationControls } from '@/components/ui/pagination-controls';
import AddNewUserDialog from '@/components/user/AddNewUserDialog';
import DeleteUserDialog from '@/components/user/DeleteUserDialog';
import EditUserDialog from '@/components/user/EditUserDialog';
import UserMoreActionsMenu from '@/components/user/UserMoreActionsMenu';
import AppLayout from '@/layouts/app-layout';
import { useUserEditStore } from '@/store/user/useUserEditStore';
import { PaginatedResponse } from '@/types/pagination';
import { Role, User } from '@/types/user';
import { router, usePage } from '@inertiajs/react';
import { Pencil, PlusCircleIcon, UserCircle2Icon, XIcon } from 'lucide-react';
import { useState } from 'react';

export default function UserListPage() {
    const { users, roles } = usePage().props as unknown as {
        users: PaginatedResponse<User>;
        roles: Role[];
    };

    const [rolesFilter, setRolesFilter] = useState<string[]>([]);
    const [search, setSearch] = useState('');

    const resetFilters = () => {
        setRolesFilter([]);
        setSearch('');
        router.get(route('users.index'), {}, { replace: true, preserveState: true });
    };

    const filterUsers = ({ rolesFilter, search }: { rolesFilter: string[]; search: string }) => {
        router.get(route('users.index'), { roles: rolesFilter, search }, { replace: false, preserveState: true });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') filterUsers({ rolesFilter, search: e.currentTarget.value });
    };

    const handleRolesFilterChange = (values: string[]) => {
        setRolesFilter(values);
        filterUsers({ rolesFilter: values, search });
    };

    const setOpenDialog = useUserEditStore((store) => store.setOpenDialog);
    const setUser = useUserEditStore((store) => store.setUser);

    // Columns for the DataTable
    const columns = getColumns<User>({
        renderIcon: (user) =>
            user.image ? <img src={user.image} alt={user.name} className="h-10 w-10 rounded-full" /> : <UserCircle2Icon size={40} />,
        withActions: true,
        renderActions: (user) => (
            <div className="flex items-center justify-end gap-2">
                <Pencil
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => {
                        setUser(user);
                        setOpenDialog(true);
                    }}
                />
                <UserMoreActionsMenu user={user} />
            </div>
        ),
        additionalColumns: [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ row }) => row.original.name,
            },
            {
                header: 'Roles',
                accessorKey: 'roles',
                cell: ({ row }) => (
                    <div className="flex gap-1">
                        {row.original.roles.map((role) => (
                            <Badge key={role.id} variant="default">
                                {role.name}
                            </Badge>
                        ))}
                    </div>
                ),
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'Last updated',
                accessorKey: 'updatedAt',
                cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
            },
        ],
    });

    return (
        <AppLayout breadcrumbs={[{ title: 'Users', href: '/users' }]}>
            <div className="space-y-4 px-8 py-5">
                {/* Filters */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-grow items-center gap-3">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search in user"
                            className="w-64"
                            onKeyDown={handleKeyDown}
                        />
                        <div className="flex items-center gap-2">
                            <MultiSelect values={rolesFilter} onValuesChange={handleRolesFilterChange}>
                                <MultiSelectTrigger className="w-full">
                                    <PlusCircleIcon />
                                    <span className="border-r pr-2">Role</span>
                                    <span className="text-muted-foreground">{`${rolesFilter.length} selected`}</span>
                                </MultiSelectTrigger>
                                <MultiSelectContent>
                                    <MultiSelectGroup>
                                        {roles.map((role) => (
                                            <MultiSelectItem key={role.id} value={role.id.toString()}>
                                                {role.name}
                                            </MultiSelectItem>
                                        ))}
                                    </MultiSelectGroup>
                                </MultiSelectContent>
                            </MultiSelect>
                        </div>
                        {rolesFilter.length > 0 && (
                            <Button variant="ghost" onClick={resetFilters}>
                                Reset <XIcon />
                            </Button>
                        )}
                    </div>
                    <AddNewUserDialog />
                </div>

                {/* DataTable */}
                <div className="overflow-x-auto rounded-md">
                    <DataTable columns={columns} data={users.data} />
                </div>

                {/* Pagination */}
                <PaginationControls links={users.meta.links} />
            </div>

            <EditUserDialog />
            <DeleteUserDialog />
        </AppLayout>
    );
}
