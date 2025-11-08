import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
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

export default function AddNewCategoryDialog() {
    const [openDialog, setOpenDialog] = useState(false);
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            image: undefined,
        },
    });

    const onSubmit = (data: FormData) => {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        if (data.image instanceof File) formData.append('image', data.image);

        router.post(route('menu_category.store'), formData, {
            onSuccess: () => {
                form.reset();
                setOpenDialog(false);
            },
        });
    };

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant={'ghost'} onClick={() => setOpenDialog(true)}>
                    <Plus size={16} />
                    Add new category
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new category</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...form.register('name')} placeholder="eg. Drink" />
                        {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">
                            Description<span className="text-muted-foreground"> (Optional)</span>
                        </Label>
                        <Input placeholder="eg. Drinks" id="description" {...form.register('description')} />
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

                        {/* {form.watch('image') instanceof File ? (
                            // ✅ New uploaded file → show preview
                            <div onClick={handleImageSlectButtonClick} className="flex items-center justify-center">
                                <img
                                    src={URL.createObjectURL(form.watch('image') as File)}
                                    alt="Preview"
                                    className="h-[220px] w-[220px] rounded-lg object-cover"
                                />
                            </div>
                        ) : (
                            
                        )} */}
                        <div>
                            <ImageUpload value={form.watch('image')} onSelect={(value) => form.setValue('image', value)} />
                        </div>

                        {form.formState.errors.image && <p className="text-xs text-red-500">{form.formState.errors.image.message as string}</p>}
                    </div>
                    {form.formState.errors.image && <p className="text-xs text-red-500">{form.formState.errors.image.message as string}</p>}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">Create category</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
