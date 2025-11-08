import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { router, usePage } from '@inertiajs/react';
import { ChevronsDown, SettingsIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function KitchenOrderViewEdit() {
    const { filters } = usePage<{
        filters: {
            show_image: string;
            show_summary: string;
        };
    }>().props;
    const [showImage, setShowImage] = useState(filters.show_image == 'true' ? true : false);
    const [showSummary, setShowSummary] = useState(filters.show_summary == 'true' ? true : false);
    console.log({
        showImage,
        showSummary,
    });
    const handleToggleShowImage = (checked: boolean) => {
        setShowImage(checked);
        router.reload({
            data: {
                show_image: checked,
            },
        });
    };
    const handleToggleShowSummary = (chekced: boolean) => {
        setShowSummary(chekced);
        router.reload({
            data: {
                show_summary: chekced,
            },
        });
    };

    useEffect(() => {
        setShowImage(filters.show_image == 'true' ? true : false);
        setShowSummary(filters.show_summary == 'true' ? true : false);
    }, [filters.show_image, filters.show_summary]);
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="group flex cursor-pointer items-center gap-2 rounded-md p-1 text-sidebar-accent-foreground hover:bg-gray-100 data-[state=open]:bg-sidebar-accent">
                        <SettingsIcon />
                        <span className="text-sm">Edit View</span>
                        <ChevronsDown className="ml-auto size-4" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" align="end">
                    <DropdownMenuItem className="flex items-center justify-between p-4">
                        <span className="font-medium">Show Image</span>
                        <Switch checked={showImage} onCheckedChange={handleToggleShowImage} />
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center justify-between p-4">
                        <span className="font-medium">Show Summary</span>
                        <Switch checked={showSummary} onCheckedChange={handleToggleShowSummary} />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
