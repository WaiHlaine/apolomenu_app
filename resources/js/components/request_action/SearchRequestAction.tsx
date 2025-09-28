import { router } from '@inertiajs/react';
import { Input } from '../ui/input';

export default function SearchRequestAction() {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get(route('request-actions.index'), { search: e.currentTarget.value }, { preserveState: true });
        }
    };

    return (
        <div>
            <Input type="search" placeholder="Search request actions..." onKeyDown={handleKeyDown} />
        </div>
    );
}
