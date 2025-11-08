import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

export default function KitchenUserProfile() {
    const { auth } = usePage<SharedData>().props;
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex cursor-pointer items-center gap-2 rounded-md p-1 text-sidebar-accent-foreground hover:bg-gray-100">
                        <UserInfo user={auth.user} />
                        <ChevronsUpDown className="ml-auto size-4" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    align="end"
                    // side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}/
                >
                    <UserMenuContent user={auth.user} />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
