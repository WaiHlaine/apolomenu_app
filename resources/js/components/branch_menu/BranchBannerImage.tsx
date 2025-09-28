import { Branch } from '@/types/branch';
import { usePage } from '@inertiajs/react';

export default function BranchBannerImage() {
    const { branch } = usePage().props as unknown as {
        branch: Branch;
    };
    return (
        <div>
            <img className="h-[172px] w-full object-cover" src={branch.coverImage} alt={branch.name} />
        </div>
    );
}
