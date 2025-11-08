import { Button } from '@/components/ui/button';

export default function BackButton() {
    const handleBack = () => {
        window.history.back();
    };
    return (
        <div>
            <Button onClick={handleBack} variant={'outline'}>
                Back
            </Button>
        </div>
    );
}
