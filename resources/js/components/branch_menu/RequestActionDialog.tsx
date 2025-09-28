import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';

export default function RequestActionDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Request
                </Button>
            </DialogTrigger>
            <DialogContent>hello</DialogContent>
        </Dialog>
    );
}
