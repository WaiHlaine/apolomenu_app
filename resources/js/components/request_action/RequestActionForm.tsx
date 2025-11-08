import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RequestAction } from '@/types/request-action';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import * as z from 'zod';
import CallSomeone from '../icons/CallSomeone';
import CallToCleanTable from '../icons/CallToCleanTable';
import ClarifyBill from '../icons/ClarifyBill';
import CleanTable from '../icons/CleanTable';
import NeedWater from '../icons/NeedWater';
import NoteChange from '../icons/NoteChange';
import PayBill from '../icons/PayBill';
import PayCard from '../icons/PayCard';
import PayCash from '../icons/PayCash';
import SpoonFork from '../icons/SpoonFork';
import TissueBox from '../icons/TissueBox';
import WetFloor from '../icons/WetFloor';

// ✅ Validation schema
const formSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    icon: z.string().min(2, 'Icon is required'),
});
export const REQUEST_ACTION_ICON_NAMES = [
    {
        name: 'call_someone',
        component: <CallSomeone />,
    },
    {
        name: 'call_to_clean_table',
        component: <CallToCleanTable />,
    },
    {
        name: 'clarify_bill',
        component: <ClarifyBill />,
    },
    {
        name: 'clean_table',
        component: <CleanTable />,
    },
    {
        name: 'need_water',
        component: <NeedWater />,
    },
    {
        name: 'note_change',
        component: <NoteChange />,
    },
    {
        name: 'pay_bill',
        component: <PayBill />,
    },
    {
        name: 'pay_card',
        component: <PayCard />,
    },
    {
        name: 'pay_cash',
        component: <PayCash />,
    },
    {
        name: 'spoon_fork',
        component: <SpoonFork />,
    },
    {
        name: 'tissue_box',
        component: <TissueBox />,
    },
    {
        name: 'wet_floor',
        component: <WetFloor />,
    },
];
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
                            onClick={() => form.setValue('icon', icon.name)}
                            key={icon.name}
                            className={twMerge(
                                'col-span-1 flex h-[76px] w-[76px] cursor-pointer items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200',
                                form.watch('icon') === icon.name && 'border-2 border-lime-500',
                            )}
                        >
                            {icon.component}
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
