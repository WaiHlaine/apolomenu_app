import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table } from '@/types/table';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// ✅ Validation schema
const formSchema = z.object({
    name: z.string().min(2, 'Name is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function TableForm({
    mode,
    table,
    defaultValues,
    onSuccess,
}: {
    mode: 'create' | 'edit';
    table?: Table;
    defaultValues: {
        name: string;
    };
    onSuccess?: (success: boolean) => void;
}) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const onSubmit = (data: FormData) => {
        const formData = new FormData();
        formData.append('name', data.name);

        router.post(mode === 'create' ? route('tables.store') : route('tables.update', { id: table?.id }), formData, {
            onSuccess: () => {
                form.reset();
                onSuccess?.(false);
            },
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input autoFocus id="name" {...form.register('name')} placeholder="eg. Table 1" />
                {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
            </div>

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                        Cancel
                    </Button>
                </DialogClose>
                <Button type="submit">{mode === 'create' ? 'Create' : 'Update'}</Button>
            </DialogFooter>
        </form>
    );
}
