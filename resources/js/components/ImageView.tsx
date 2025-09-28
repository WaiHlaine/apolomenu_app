import { twMerge } from 'tailwind-merge';

export default function ImageView({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
    if (!src) {
        return (
            <div>
                <div className={twMerge('rounded-lg bg-gray-300', className)} />
            </div>
        );
    }
    return (
        <div>
            <img src={src} alt={alt} className={twMerge('border-[0.5px] object-cover', className)} />
        </div>
    );
}
