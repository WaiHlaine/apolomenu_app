import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MenuCategory } from '@/types/category';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import ImageUpload from '../ImageUpload';

// ✅ Validation schema
const formSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    description: z.string().optional(),
    image: z.any().optional(), // file upload (no strict validation here)
});

type FormData = z.infer<typeof formSchema>;

export default function EditCategoryDialog({
    onOpenChange,
    open,
    menuCategory,
}: {
    open: boolean;
    onOpenChange: (opened: boolean) => void;
    menuCategory: MenuCategory;
}) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: menuCategory.name,
            description: menuCategory.description,
            image: menuCategory.image,
        },
    });

    const onSubmit = (data: FormData) => {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        if (data.image instanceof File) formData.append('image', data.image);

        router.post(route('menu_category.update', { id: menuCategory.id }), formData, {
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
    };

    const handleImageSlectButtonClick = () => {
        const input = document.getElementById('image') as HTMLInputElement;
        input.click();
    };

    useEffect(() => {
        if (menuCategory) {
            form.setValue('name', menuCategory.name);
            form.setValue('description', menuCategory.description);
            form.setValue('image', menuCategory.image);
        }
    }, [form, menuCategory]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit category</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...form.register('name')} placeholder="eg. Drink" />
                        {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" {...form.register('description')} />
                        {form.formState.errors.description && <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>}
                    </div>

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
                        ) : menuCategory.image ? (
                            // ✅ Existing DB image
                            <div onClick={handleImageSlectButtonClick} className="flex items-center justify-center">
                                <img src={menuCategory.image} alt={menuCategory.name} className="h-[220px] w-[220px] rounded-lg object-cover" />
                            </div>
                        ) : (
                            // ✅ No image at all
                            <div>
                                <ImageUpload onSelect={handleImageSlectButtonClick} />
                            </div>
                        )}

                        {form.formState.errors.image && <p className="text-xs text-red-500">{form.formState.errors.image.message as string}</p>}
                    </div>
                    {form.formState.errors.image && <p className="text-xs text-red-500">{form.formState.errors.image.message as string}</p>}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
