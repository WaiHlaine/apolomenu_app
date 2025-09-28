import { MenuItem } from '@/types/menu_item';
import ItemBadges from './ItemBadges';
import ItemPrices from './ItemPrices';

export default function ItemInfo({
    name,
    description,
    variants,
    badges,
    currency,
}: {
    name: string;
    description: string | null;
    variants: MenuItem['variants'];
    badges: MenuItem['badges'];
    currency: string;
}) {
    return (
        <div className="p-4">
            <p className="text-lg font-bold">{name}</p>
            <p className="text-gray-500">{description}</p>
            <div className="mt-2 flex items-center justify-between">
                <div>{variants.length == 1 ? <ItemPrices variants={variants} currency={currency} /> : <div></div>}</div>
                <div>
                    <ItemBadges badges={badges} />
                </div>
            </div>
        </div>
    );
}
