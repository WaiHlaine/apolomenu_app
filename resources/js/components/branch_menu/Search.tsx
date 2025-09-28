import { SearchIcon } from 'lucide-react';
import { Button } from '../ui/button';

export default function Search() {
    return (
        <div>
            <Button size={'sm'} variant={'ghost'}>
                <SearchIcon />
            </Button>
        </div>
    );
}
