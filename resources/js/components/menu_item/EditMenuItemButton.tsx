import { MenuItem } from '@/types/menu_item';
import { PencilLine } from 'lucide-react';
import { Button } from '../ui/button';
import { useMenuItemUpdateStore } from './store/useUpdateMenuItemStore';

export default function EditMenuitemButton({ menuItem }: { menuItem: MenuItem }) {
    const setUpdateItem = useMenuItemUpdateStore((state) => state.setUpdateItem);
    const setOpenDialog = useMenuItemUpdateStore((state) => state.setOpenDialog);
    return (
        <Button
            onClick={() => {
                setUpdateItem(menuItem);
                setOpenDialog(true);
            }}
            size={'sm'}
            variant={'ghost'}
        >
            <PencilLine />
        </Button>
    );
}
