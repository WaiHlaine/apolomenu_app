import { Minus, Plus } from 'lucide-react';
import { Button } from '../ui/button';

export default function ItemQuantitySelect({
    enableAddToCart,
    onChange,
    onAddToCart,
    value,
}: {
    enableAddToCart: boolean;
    onChange: (value: number) => void;
    onAddToCart: () => void;
    value: number;
}) {
    return (
        <div className="flex w-full items-center gap-2 rounded-t-2xl border p-4 shadow">
            <div className="flex items-center gap-2">
                <Button
                    variant={'outline'}
                    className="rounded-full"
                    onClick={() => {
                        if (value > 1) {
                            onChange(value - 1);
                        }
                    }}
                >
                    <Minus />
                </Button>
                <p className="text-lg font-bold">{value}</p>
                <Button
                    variant={'outline'}
                    className="rounded-full"
                    onClick={() => {
                        onChange(value + 1);
                    }}
                >
                    <Plus />
                </Button>
            </div>
            <div className="flex-grow">
                <Button onClick={onAddToCart} size={'lg'} disabled={!enableAddToCart} className="w-full">
                    Add to cart
                </Button>
            </div>
        </div>
    );
}
