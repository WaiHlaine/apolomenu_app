import { router, usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from '../ui/multi-select';

export default function OrdersFilter() {
    const { filters: flts } = usePage<{
        filters: {
            date?: string;
            type?: string;
            table?: string;
            status?: string[];
            search?: string;
        };
    }>().props;
    const [filters, setFilters] = useState<{
        date?: string;
        type?: string;
        table?: string;
        status?: string[];
        search?: string;
    }>({
        date: '',
        type: '',
        table: '',
        status: [],
        search: '',
    });

    const handleSubmit = (flts: Record<string, string | string[]>) => {
        router.reload({
            data: flts,
            only: ['orders'],
        });
    };
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, date: e.target.value });
        handleSubmit({
            date: e.target.value,
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, search: e.target.value });
    };

    const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && filters.search) {
            handleSubmit({
                search: filters.search,
            });
        } else {
            handleSubmit({ search: '' });
        }
    };

    const handleStatusChange = (newStatuses: string[]) => {
        setFilters({ ...filters, status: newStatuses });
        handleSubmit({
            status: newStatuses,
        });
        router.reload({
            data: {
                status: newStatuses,
            },
            only: ['orders'],
        });
    };

    const handleResetFilters = () => {
        const defaultValues = {
            date: '',
            type: '',
            table: '',
            status: [],
            search: '',
        };
        setFilters(defaultValues);
        handleSubmit(defaultValues);
    };

    useEffect(() => {
        setFilters(flts);
    }, [flts]);

    return (
        <div className="flex justify-between gap-4 p-4">
            <div className="flex items-center gap-4">
                <Input
                    onKeyDown={handleEnterKeyPress}
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e)}
                    type="search"
                    placeholder="Search orders"
                />
                <div className="shrink-0">
                    <MultiSelect values={filters.status} onValuesChange={handleStatusChange}>
                        <MultiSelectTrigger className="w-full">
                            <MultiSelectValue placeholder="Select status..." />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                            <MultiSelectGroup>
                                <MultiSelectItem value={'completed'}>Completed</MultiSelectItem>
                                <MultiSelectItem value={'pending'}>Pending</MultiSelectItem>
                                <MultiSelectItem value={'cancelled'}>Cancelled</MultiSelectItem>
                                <MultiSelectItem value={'ready'}>Ready</MultiSelectItem>
                            </MultiSelectGroup>
                        </MultiSelectContent>
                    </MultiSelect>
                </div>
                {filters.date || filters.type || filters.table || filters.status || filters.search ? (
                    <Button variant="ghost" onClick={handleResetFilters}>
                        Reset <X />
                    </Button>
                ) : null}
            </div>
            <div>
                <Input value={filters.date} onChange={(e) => handleDateChange(e)} type="date" placeholder="Select date" />
            </div>
        </div>
    );
}
