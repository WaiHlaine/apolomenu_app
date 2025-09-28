import { UserCircle2Icon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function UserAvatar({
    image,
    iconSize = 40,
    name,
    className,
}: {
    image?: string;
    iconSize?: number;
    name: string;
    className?: string;
}) {
    return image ? (
        <img src={image || '/default-avatar.png'} className={twMerge('h-10 w-10 rounded-full', className)} alt={name} />
    ) : (
        <UserCircle2Icon size={iconSize} className="rounded-full" />
    );
}
