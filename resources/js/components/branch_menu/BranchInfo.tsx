import { Branch } from '@/types/branch';
import { Table } from '@/types/table';
import { usePage } from '@inertiajs/react';
import EmptyImage from '../EmptyImage';

export default function BranchInfo() {
    const { branch, table } = usePage<{
        branch: Branch;
        table: Table;
    }>().props;
    return (
        <div className="relative mb-[30px]">
            <BranchBannerImage src={branch.coverImage} alt={branch.name} />
            <div className="absolute right-0 bottom-[-60px] left-0 z-10 w-full px-4">
                <BranchLogoAndTable logo={branch.logoImage} table={table.name} name={branch.name} />
            </div>
        </div>
    );
}

const BranchBannerImage = ({ src, alt }: { src: string; alt: string }) => {
    if (!src) return <EmptyImage className="h-[172px] w-full" />;
    return <img className="h-[172px] w-full object-cover" src={src} alt={alt} />;
};

const BranchLogoAndTable = ({ logo, table, name }: { logo: string; table: string; name: string }) => {
    return (
        <div className="mb-[30px] flex items-center gap-3 rounded-md bg-white p-2 drop-shadow-sm">
            <div className="p-[3.2px ]">
                {logo ? (
                    <img className="h-[56px] w-[56px] object-cover" src={logo} alt={name} />
                ) : (
                    <EmptyImage className="h-[56px] w-[56px] rounded-full object-cover" />
                )}
            </div>
            <div>
                <p className="text-sm font-semibold capitalize">{name}</p>
                <p className="text-sm text-gray-500 capitalize">{table}</p>
            </div>
        </div>
    );
};
