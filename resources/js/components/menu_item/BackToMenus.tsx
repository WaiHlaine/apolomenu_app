import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '../ui/button';

export default function BackToMenus() {
    //go to menus page
    const handleBackClick = () => {
        window.history.back();
    };
    return (
        <div>
            <Button onClick={handleBackClick} size={'sm'}>
                <ArrowLeftIcon />
                Back
            </Button>
        </div>
    );
}
