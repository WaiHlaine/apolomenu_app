import { MenuItem } from '@/types/menu_item';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

export default function ItemVariantsSelect({
    variants,
    currency,
    name,
    onChange,
}: {
    variants: MenuItem['variants'];
    currency: string;
    name: string;
    onChange: (value: string) => void;
}) {
    const [value, setValue] = useState('');

    return (
        <div className="p-4">
            <p className="text-lg font-bold capitalize">{name} type</p>

            <RadioGroup
                onValueChange={(value) => {
                    setValue(value);
                    onChange(value);
                }}
                defaultValue={value}
            >
                {variants.map((variant) => (
                    <div key={variant.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <RadioGroupItem disabled={variant.outOfStock} value={variant.id.toString()} id={variant.id.toString()} />
                            {variant.outOfStock ? (
                                <div className="flex items-center gap-2">
                                    <p className="text-gray-500">{variant.name.toString()}</p>
                                    <Badge variant={'secondary'}>Out of stock</Badge>
                                </div>
                            ) : (
                                <Label htmlFor={variant.id.toString()}>{variant.name.toString()}</Label>
                            )}
                        </div>
                        <div>
                            <p className="text-lg font-bold">
                                {variant.price} {currency}
                            </p>
                        </div>
                    </div>
                ))}
            </RadioGroup>

            <div className="mt-4 flex flex-col gap-4"></div>
        </div>
    );
}
