import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import ImageUpload from '../ImageUpload';
import { Textarea } from '../ui/textarea';
import { useMenuItemUpdateStore } from './store/useUpdateMenuItemStore';

type Variant = { name: string; price: string };

type FormData = {
    name: string;
    description?: string;
    image?: File | string;
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

export default function EditMenuItemDialog() {
    const { openDialog, setOpenDialog, menuItem } = useMenuItemUpdateStore();
    const { badges = [] } = usePage().props as unknown as {
        badges: Badge[];
    };

    const [variants, setVariants] = useState<Variant[]>(menuItem.variants.map((variant) => ({ name: variant.name, price: variant.price })));
    const { id } = route().params as { id: string };
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: menuItem.translations[0]?.name,
            description: menuItem.translations[0]?.description ?? '',
            price: menuItem.variants.length == 1 ? menuItem.variants[0].price : '',
            image: menuItem.image ? menuItem.image : '',
            variants: variants,
            badges: menuItem.badges.map((badge) => badge.id.toString()),
            categoryId: id,
        },
    });

    const onSubmit = (data: FormData) => {
        const formData = new FormData();
        formData.append('categoryId', data.categoryId);
        formData.append('name', data.name);
        formData.append('description', data.description || '');
        formData.append('price', data.price || '');

        // Only append image if it’s a new File
        if (data.image instanceof File) {
            formData.append('image', data.image);
        }

        const filteredVariants = variants.filter((v) => v.name.trim() && v.price.trim());

        // Append variants
        filteredVariants.forEach((variant, i) => {
            formData.append(`variants[${i}][name]`, variant.name);
            formData.append(`variants[${i}][price]`, variant.price);
        });

        // Append badges
        (data.badges || []).forEach((badgeId, i) => {
            formData.append(`badges[${i}]`, badgeId.toString());
        });

        router.post(route('menu_item.update', { id: menuItem.id }), formData, {
            onSuccess: () => {
                form.reset();
                setVariants([]);
                setOpenDialog(false);
            },
        });
    };

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

    const handleImageSlectButtonClick = () => {
        const input = document.getElementById('image') as HTMLInputElement;
        input.click();
    };

    useEffect(() => {
        //if menu item is changed, update the form fields
        if (menuItem && openDialog) {
            form.setValue('name', menuItem.translations[0]?.name);
            form.setValue('description', menuItem.translations[0]?.description || '');
            form.setValue('price', menuItem.variants.length == 1 ? menuItem.variants[0].price : '');
            form.setValue('image', menuItem.image ? menuItem.image : '');
            form.setValue(
                'variants',
                menuItem.variants.length > 1 ? menuItem.variants.map((variant) => ({ name: variant.name, price: variant.price })) : [],
            );
            form.setValue(
                'badges',
                menuItem.badges.map((badge) => badge.id.toString()),
            );
            form.setValue('categoryId', id);
            setVariants(menuItem.variants.length > 1 ? menuItem.variants.map((variant) => ({ name: variant.name, price: variant.price })) : []);
        }
    }, [form, id, menuItem, openDialog]);

    return (
        <Dialog open={openDialog} onOpenChange={(opened) => setOpenDialog(opened)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit item</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* name */}
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...form.register('name')} placeholder="eg. Pizza" />
                        {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
                    </div>

                    {/* description */}
                    <div>
                        <Label htmlFor="description">
                            Description <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                        <Textarea id="description" {...form.register('description')} />
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
                        <MultiSelect
                            defaultValues={menuItem.badges.map((badge) => badge.id.toString())}
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
                        {form.formState.errors.badges && <p className="text-xs text-red-500">{form.formState.errors.badges.message as string}</p>}
                    </div>

                    {/* image */}
                    {/* image */}
                    <div>
                        <Label htmlFor="image">Photo</Label>

                        <Input
                            className="hidden"
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => form.setValue('image', e.target.files?.[0])}
                        />

                        {form.watch('image') instanceof File ? (
                            // ✅ New uploaded file → show preview
                            <div onClick={handleImageSlectButtonClick} className="flex items-center justify-center">
                                <img
                                    src={URL.createObjectURL(form.watch('image') as File)}
                                    alt="Preview"
                                    className="h-[220px] w-[220px] rounded-lg object-cover"
                                />
                            </div>
                        ) : menuItem.image ? (
                            // ✅ Existing DB image
                            <div onClick={handleImageSlectButtonClick} className="flex items-center justify-center">
                                <img
                                    src={menuItem.image}
                                    alt={menuItem.translations[0].name}
                                    className="h-[220px] w-[220px] rounded-lg object-cover"
                                />
                            </div>
                        ) : (
                            // ✅ No image at all
                            <div>
                                <ImageUpload onSelect={handleImageSlectButtonClick} />
                            </div>
                        )}

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
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
