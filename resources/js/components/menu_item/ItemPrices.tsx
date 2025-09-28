import { MenuItem } from '@/types/menu_item';
import { twMerge } from 'tailwind-merge';

export default function ItemPrices({ variants, currency, className }: { variants: MenuItem['variants']; currency: string; className?: string }) {
    const prices = variants.map((v) => parseFloat(v.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const priceDisplay = prices.length === 1 ? `${minPrice} ${currency}` : `${minPrice} - ${maxPrice} ${currency}`;
    return (
        <div>
            <p className={twMerge('text-lg font-bold', className)}>{priceDisplay}</p>
        </div>
    );
}
