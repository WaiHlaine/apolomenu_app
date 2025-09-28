import { MenuItem } from '@/types/menu_item';
import { OrderItem as TOrderItem } from '@/types/order';
import ImageView from '../ImageView';

export default function OrderItem({ orderItem, menuItem, currency }: { orderItem: TOrderItem; menuItem?: MenuItem; currency: string }) {
    const selectedVariant = menuItem?.variants.find((variant) => variant.id === orderItem.variantId);

    return (
        <div className="flex items-start gap-2 border-b py-3">
            <ImageView className="h-[96px] w-[96px] rounded-lg" src={menuItem?.image || ''} alt={menuItem?.translations[0].name || ''} />
            <div className="flex-grow">
                {orderItem.notes && <p className="text-sm font-medium">{orderItem.notes}</p>}
                {menuItem?.translations[0].name !== '' ? (
                    <span className="text-lg font-bold">{`(${menuItem?.translations[0].name})`}</span>
                ) : (
                    <span className="text-lg font-bold">{`${menuItem?.translations[0].name}`}</span>
                )}

                {selectedVariant && selectedVariant.name && <span className="font-bold">{`(${selectedVariant.name})`}</span>}
                <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">x{orderItem.quantity}</p>
                    <p className="text-sm font-semibold">
                        {orderItem.totalPrice}
                        {` `}
                        {currency.toUpperCase()}
                    </p>
                </div>
            </div>
        </div>
    );
}
