import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
import { Role } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { Circle, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
// ✅ Validation schema
const formSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    roles: z.array(z.string()).min(1, 'At least one role is required'),
    image: z.any().optional(), // file upload (no strict validation here)
});

type FormData = z.infer<typeof formSchema>;

export default function AddNewUserDialog() {
    const { roles = [] } = usePage().props as unknown as {
        roles: Role[];
    };
    console.log({ roles });
    const [openDialog, setOpenDialog] = useState(false);
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            roles: [],
            image: undefined,
        },
    });

    const onSubmit = (data: FormData) => {
        router.post(route('users.store'), data, {
            onSuccess: () => {
                form.reset();
                setOpenDialog(false);
            },
        });
    };

    const handleImageSlectButtonClick = () => {
        const input = document.getElementById('image') as HTMLInputElement;
        input.click();
    };

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpenDialog(true)}>
                    <PlusIcon size={16} />
                    Add new user
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new user</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input autoFocus id="name" {...form.register('name')} placeholder="Enter username" />
                        {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input placeholder="Enter email" id="email" {...form.register('email')} />
                        {form.formState.errors.email && <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input placeholder="Enter password" id="password" {...form.register('password')} />
                        {form.formState.errors.password && <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="roles">Roles</Label>
                        <MultiSelect defaultValues={form.getValues().roles} onValuesChange={(values) => form.setValue('roles', values)}>
                            <MultiSelectTrigger className="w-full">
                                <MultiSelectValue placeholder="Select roles..." />
                            </MultiSelectTrigger>
                            <MultiSelectContent>
                                <MultiSelectGroup>
                                    {roles.map((role) => (
                                        <MultiSelectItem key={role.id} value={role.id.toString()}>
                                            {role.name}
                                        </MultiSelectItem>
                                    ))}
                                </MultiSelectGroup>
                            </MultiSelectContent>
                        </MultiSelect>
                        {form.formState.errors.roles && <p className="text-xs text-red-500">{form.formState.errors.roles.message}</p>}
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
                        ) : (
                            <div>
                                <div className="flex h-[220px] flex-col items-center justify-center gap-2.5 rounded-md border border-dotted p-2.5">
                                    <p className="text-sm font-semibold">Drop your image here</p>
                                    <p className="text-sm">PNG or JPG ( 1200px * 1200px )</p>
                                    <div className="flex items-center gap-2 rounded-sm bg-gray-100 p-2" onClick={handleImageSlectButtonClick}>
                                        <Circle className="text-black" size={16} />
                                        <span className="text-sm text-black">Select photo</span>
                                    </div>
                                </div>
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
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
