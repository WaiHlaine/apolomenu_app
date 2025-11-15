import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';

export default function BackButton() {
    const handleBack = () => {
        window.history.back();
    };
    return (
        <div>
            <Button onClick={handleBack} variant={'outline'}>
                <ChevronLeftIcon />
                Back
            </Button>
        </div>
    );
}
