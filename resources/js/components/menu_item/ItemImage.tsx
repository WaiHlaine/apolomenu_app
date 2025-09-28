import { ImageOffIcon } from 'lucide-react';

export default function ItemImage({ src, alt }: { src: string | null; alt: string }) {
    if (!src) {
        return (
            <div className="flex h-[220px] w-full items-center justify-center text-gray-400">
                <ImageOffIcon />
            </div>
        );
    }
    return (
        <div>
            <img className="h-[220px] w-full object-cover" src={src} alt={alt} />
        </div>
    );
}
