import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MenuCategory } from '@/types/category';
import { usePage } from '@inertiajs/react';
import { PencilIcon, SettingsIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import DeleteMenuCategoryDialog from './DeleteMenuCategoryDialog';
import EditCategoryDialog from './EditCategoryDialog';
export default function MenuCategorySettingsMenu() {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const { category } = usePage().props as unknown as {
        category: MenuCategory;
    };
    console.log({ category });
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'ghost'} size={'sm'}>
                        <SettingsIcon size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
                        <PencilIcon />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={() => setOpenDeleteDialog(true)}>
                        <Trash2Icon className="text-red-500" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <EditCategoryDialog onOpenChange={setOpenEditDialog} open={openEditDialog} menuCategory={category} />
            <DeleteMenuCategoryDialog onOpenChange={setOpenDeleteDialog} open={openDeleteDialog} id={category.id.toString()} />
        </>
    );
}
