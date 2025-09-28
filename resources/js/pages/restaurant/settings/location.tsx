import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Branch } from '@/types/branch';
import { router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';

type LocationForm = {
    lat: number;
    long: number;
    radius: number;
};

export default function RestaurantLocationSetting({ branch }: { branch: Branch }) {
    const form = useForm<LocationForm>({
        defaultValues: {
            lat: branch.lat ?? 0,
            long: branch.long ?? 0,
            radius: branch.radius ?? 0,
        },
    });

    const onSubmit = (values: LocationForm) => {
        router.patch(route('restaurant_setting.location.update'), values, {
            onSuccess: () => {
                console.log('Location updated successfully!');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Location', href: '/settings/location' }]}>
            <div className="flex justify-center p-4">
                <div className="h-full w-full max-w-3xl rounded-md border p-6">
                    <div>
                        <p className="text-2xl font-semibold">Location</p>
                        <p className="mt-1.5 text-sm">Manage the restaurant location</p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
                        {/* Latitude and Longitude side by side */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="lat">Latitude</Label>
                                <Input id="lat" type="number" step="0.000001" {...form.register('lat', { valueAsNumber: true })} />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="long">Longitude</Label>
                                <Input id="long" type="number" step="0.000001" {...form.register('long', { valueAsNumber: true })} />
                            </div>
                        </div>

                        {/* Radius */}
                        <div>
                            <Label htmlFor="radius">Restaurant Area (Radius in meters)</Label>
                            <Input id="radius" type="number" step="1" {...form.register('radius', { valueAsNumber: true })} />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    form.reset();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
