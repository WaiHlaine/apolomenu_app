import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue,
} from '@/components/ui/multi-select';
import { Badge } from '@/types/menu_item';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePage } from '@inertiajs/react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import ImageUpload from '../ImageUpload';
import { Textarea } from '../ui/textarea';

type Variant = { name: string; price: string };

export type MenuItemFormData = {
    name: string;
    description?: string;
    image?: File | string;
    price?: string; // only if no variants
    variants?: Variant[];
    badges?: string[];
    categoryId: string;
};
// ✅ Validation schema
const formSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    description: z.string().optional(),
    image: z.any().optional(), // file upload (no strict validation here)
    price: z.string().min(1, 'Price is required').optional(),
    categoryId: z.string(),
    variants: z
        .array(
            z.object({
                name: z.string().min(2, 'Variant name is required'),
                price: z.string().min(1, 'Price is required'),
            }),
        )
        .optional(),
    badges: z.array(z.string()).optional(),
});

export default function MenuItemForm({
    onSubmit,
    defaultValues,
    onCancel,
}: {
    defaultValues: MenuItemFormData;
    onSubmit: (data: globalThis.FormData) => void;
    onCancel: () => void;
}) {
    const { badges = [] } = usePage().props as unknown as {
        badges: Badge[];
    };

    const [variants, setVariants] = useState<Variant[]>([]);
    const { id } = route().params as { id: string };

    const form = useForm<MenuItemFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { ...defaultValues, categoryId: id },
    });

    const handleSubmit = (data: MenuItemFormData) => {
        alert('clicking');
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('categoryId', data.categoryId);
        if (data.description) formData.append('description', data.description);
        if (data.image instanceof File) formData.append('image', data.image);

        // ✅ Variants or single price
        if (variants.length > 0) {
            variants.forEach((variant, i) => {
                formData.append(`variants[${i}][name]`, variant.name);
                formData.append(`variants[${i}][price]`, variant.price);
            });
        } else if (data.price) {
            formData.append('price', data.price);
        }

        // ✅ Badges
        if (data.badges && data.badges.length > 0) {
            data.badges.forEach((badgeId, i) => {
                formData.append(`badges[${i}]`, String(badgeId));
            });
        }

        console.log({
            formData: formData.values(),
        });

        onSubmit(formData);
    };

    const addVariant = () => setVariants((prev) => [...prev, { name: '', price: '' }]);
    const removeVariant = (index: number) => setVariants((prev) => prev.filter((_, i) => i !== index));
    const updateVariant = (index: number, field: keyof Variant, value: string) =>
        setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));

    const handleImageSlectButtonClick = () => {
        const input = document.getElementById('image') as HTMLInputElement;
        input.click();
    };
    return (
        <form className="flex flex-col gap-4">
            {/* name */}
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...form.register('name')} placeholder="eg. Pizza" />
            </div>

            {/* description */}
            <div>
                <Label htmlFor="description">
                    Description <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Textarea id="description" {...form.register('description')} />
            </div>

            {/* price or variants */}
            <div className="flex flex-col gap-3">
                {variants.length === 0 ? (
                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input type="number" id="price" {...form.register('price')} placeholder="eg. 9.99" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="price">Variants</Label>

                        {variants.map((variant, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    autoFocus
                                    placeholder="Variant name (e.g. Small)"
                                    value={variant.name}
                                    onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                />
                                <Input
                                    placeholder="Price"
                                    type="number"
                                    step="0.01"
                                    value={variant.price}
                                    onChange={(e) => updateVariant(index, 'price', e.target.value)}
                                />
                                <Button type="button" size="icon" variant="ghost" onClick={() => removeVariant(index)}>
                                    <Trash2Icon className="text-red-500" size={16} />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                <div>
                    <Button type="button" variant="outline" onClick={addVariant}>
                        <PlusIcon />
                        Add variant
                    </Button>
                </div>
            </div>

            {/* ✅ badge select */}
            <div>
                <Label>Badges</Label>
                <MultiSelect
                    values={form.watch('badges')?.map((id) => id.toString()) || []}
                    onValuesChange={(values) => form.setValue('badges', values)}
                >
                    <MultiSelectTrigger className="w-full">
                        <MultiSelectValue placeholder="Select badges..." />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                        <MultiSelectGroup>
                            {badges.map((badge) => (
                                <MultiSelectItem key={badge.id} value={badge.id.toString()}>
                                    {badge.name}
                                </MultiSelectItem>
                            ))}
                        </MultiSelectGroup>
                    </MultiSelectContent>
                </MultiSelect>
            </div>

            {/* image */}
            <div>
                <Label htmlFor="image">Photo</Label>

                <Input className="hidden" id="image" type="file" accept="image/*" onChange={(e) => form.setValue('image', e.target.files?.[0])} />

                {form.watch('image') ? (
                    <div onClick={handleImageSlectButtonClick} className="flex items-center justify-center">
                        <img
                            src={URL.createObjectURL(form.watch('image') as File)}
                            alt="Preview"
                            className="h-[220px] w-[220px] rounded-lg object-cover"
                        />
                    </div>
                ) : (
                    <div>
                        <ImageUpload onSelect={handleImageSlectButtonClick} />
                    </div>
                )}
            </div>

            {/* actions */}
            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        onCancel?.();
                        form.reset();
                        setVariants([]);
                    }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    onClick={(e) => {
                        e.preventDefault();
                        form.handleSubmit(handleSubmit);
                    }}
                >
                    Create item
                </Button>
            </DialogFooter>
        </form>
    );
}
