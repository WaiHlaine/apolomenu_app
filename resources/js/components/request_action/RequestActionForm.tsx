import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { REQUEST_ACTION_ICON_NAMES } from '@/lib/utils';
import { RequestAction } from '@/types/request-action';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import * as z from 'zod';

// ✅ Validation schema
const formSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    icon: z.string().min(2, 'Icon is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function RequestActionForm({
    defaultValues,
    onSuccesss,
    mode,
    action,
}: {
    defaultValues: {
        name: string;
        icon: string;
    };
    onSuccesss?: () => void;
    mode: 'create' | 'edit';
    action?: RequestAction;
}) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const onSubmit = (data: FormData) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('icon', data.icon);

        router.post(route(mode === 'create' ? 'request-actions.store' : 'request-actions.update', { id: action?.id }), formData, {
            onSuccess: () => {
                form.reset();
                onSuccesss?.();
            },
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-[670px] flex-col gap-4">
            <div>
                <Label htmlFor="name">Action Name</Label>
                <Input autoFocus id="name" {...form.register('name')} placeholder="eg. Pay bill" />
                {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
            </div>

            <div>
                <Label htmlFor="icon">Select photo</Label>
                <div className="mt-2 grid grid-cols-6 gap-x-[30px] gap-y-[20px]">
                    {REQUEST_ACTION_ICON_NAMES.map((icon) => (
                        <div
                            onClick={() => form.setValue('icon', icon)}
                            key={icon}
                            className={twMerge(
                                'col-span-1 flex h-[76px] w-[76px] cursor-pointer items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200',
                                form.watch('icon') === icon && 'border-2 border-lime-500',
                            )}
                        >
                            <img src={`/storage/request_action/${icon}.svg`} alt={icon} />
                        </div>
                    ))}
                </div>
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
