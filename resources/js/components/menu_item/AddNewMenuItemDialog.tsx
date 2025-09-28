import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
import { router, usePage } from '@inertiajs/react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import ImageUpload from '../ImageUpload';

type Variant = { name: string; price: string };

type FormData = {
    name: string;
    description?: string;
    image?: File;
    price?: string; // only if no variants
    variants?: Variant[];
    badges?: string[];
    categoryId: string;
};
// ✅ Validation schema
const formSchema = z
    .object({
        name: z.string().min(2, 'Name is required'),
        description: z.string().optional(),
        image: z.any().optional(), // file upload (no strict validation here)
        price: z.string().optional(),
        variants: z
            .array(
                z.object({
                    name: z.string().min(2, 'Variant name is required'),
                    price: z.string().min(1, 'Price is required'),
                }),
            )
            .optional(),
        badges: z.array(z.string()).optional(),
        categoryId: z.string(),
    })
    .refine(
        (data) => {
            const hasPrice = !!data.price?.trim();
            const hasVariants = data.variants && data.variants.length > 0;
            return hasPrice || hasVariants;
        },
        {
            message: 'Either price or at least one variant is required',
            path: ['price'], // 👈 attach error to `price` field (could also attach to variants if you want)
        },
    );

export default function AddNewMenuItemDialog() {
    const [openDialog, setOpenDialog] = useState(false);
    const { badges = [] } = usePage().props as unknown as {
        badges: Badge[];
    };

    const [variants, setVariants] = useState<Variant[]>([]);
    const { id } = route().params as { id: string };

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            price: '',
            image: undefined,
            variants: [],
            badges: [],
            categoryId: id,
        },
    });

    const onSubmit = (data: FormData) => {
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

        router.post(route('menu_item.store'), formData, {
            onSuccess: () => {
                form.reset();
                setVariants([]);
                setOpenDialog(false);
            },
        });
    };

    form.getValues();

    const updateVariant = (index: number, field: keyof Variant, value: string) =>
        setVariants((prev) => {
            const newVariants = prev.map((v, i) => (i === index ? { ...v, [field]: value } : v));
            form.setValue('variants', newVariants); // 👈 keep form in sync
            return newVariants;
        });

    const addVariant = () =>
        setVariants((prev) => {
            const newVariants = [...prev, { name: '', price: '' }];
            form.setValue('variants', newVariants); // 👈 sync
            return newVariants;
        });

    const removeVariant = (index: number) =>
        setVariants((prev) => {
            const newVariants = prev.filter((_, i) => i !== index);
            form.setValue('variants', newVariants); // 👈 sync
            return newVariants;
        });

    return (
        <Dialog open={openDialog} onOpenChange={(opened) => setOpenDialog(opened)}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpenDialog(true)}>
                    <PlusIcon size={16} />
                    Add new item
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new item</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* name */}
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input autoFocus id="name" {...form.register('name')} placeholder="eg. Pizza" />
                        {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
                    </div>

                    {/* description */}
                    <div>
                        <Label htmlFor="description">
                            Description <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                        <Input id="description" {...form.register('description')} />
                        {form.formState.errors.description && <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>}
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
                        {form.formState.errors.price && <p className="text-xs text-red-500">{form.formState.errors.price.message as string}</p>}
                        {form.formState.errors.variants && <p className="text-xs text-red-500">{form.formState.errors.variants.message as string}</p>}
                    </div>

                    {/* ✅ badge select */}
                    <div>
                        <Label>Badges</Label>
                        <MultiSelect onValuesChange={(values) => form.setValue('badges', values)}>
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
                        {form.formState.errors.badges && <p className="text-xs text-red-500">{form.formState.errors.badges.message as string}</p>}
                    </div>

                    {/* image */}
                    <div>
                        <Label htmlFor="image">Photo</Label>
                        <ImageUpload onSelect={(value) => form.setValue('image', value)} />

                        {form.formState.errors.image && <p className="text-xs text-red-500">{form.formState.errors.image.message as string}</p>}
                    </div>

                    {/* actions */}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                form.reset();
                                setVariants([]);
                                setOpenDialog(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Create item</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
