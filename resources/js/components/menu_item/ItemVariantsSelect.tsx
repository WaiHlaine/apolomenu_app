import { MenuItem } from '@/types/menu_item';
import { useState } from 'react';
import Price from '../common/Price';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

export default function ItemVariantsSelect({
    variants,
    name,
    onChange,
}: {
    variants: MenuItem['variants'];
    name: string;
    onChange: (value: string) => void;
}) {
    const [value, setValue] = useState('');

    return (
        <div className="p-4">
            <p className="text-lg">
                <span className="font-bold capitalize">{name}</span> <span>type</span>
            </p>

            <RadioGroup
                onValueChange={(value) => {
                    setValue(value);
                    onChange(value);
                }}
                defaultValue={value}
                className="mt-2"
            >
                {variants.map((variant) => (
                    <div key={variant.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <RadioGroupItem
                                className="text-2xl"
                                disabled={variant.outOfStock}
                                value={variant.id.toString()}
                                id={variant.id.toString()}
                            />
                            {variant.outOfStock ? (
                                <div className="flex items-center gap-2">
                                    <p className="text-gray-500 capitalize">{variant.name.toString()}</p>
                                    <Badge variant={'secondary'}>Out of stock</Badge>
                                </div>
                            ) : (
                                <Label htmlFor={variant.id.toString()} className="text-[16px] capitalize">
                                    {variant.name.toString()}
                                </Label>
                            )}
                        </div>
                        <Price amount={Number(variant.price)} className="font-bold" />
                    </div>
                ))}
            </RadioGroup>

            <div className="mt-4 flex flex-col gap-4"></div>
        </div>
    );
}
