import { ImageOffIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function EmptyImage({ className }: { className?: string }) {
    return (
        <div className={twMerge('flex h-full w-full items-center justify-center bg-gray-100', className)}>
            <ImageOffIcon className="text-muted-foreground" />
        </div>
    );
}
