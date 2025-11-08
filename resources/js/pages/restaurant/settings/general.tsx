import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Branch } from '@/types/branch';
import { router } from '@inertiajs/react';
import { Circle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type GeneralSettingsForm = {
    name: string;
    phone: string;
    email: string;
    address: string;
    logo: File | string | null;
    banner: File | string | null;
};

export default function RestaurantGeneralSettings({ branch }: { branch: Branch }) {
    const form = useForm<GeneralSettingsForm>({
        defaultValues: {
            name: branch.name,
            phone: branch.phone,
            email: branch.email,
            address: branch.address,
            logo: branch.logoImage,
            banner: branch.coverImage,
        },
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(branch.logoImage);
    const [bannerPreview, setBannerPreview] = useState<string | null>(branch.coverImage);
    console.log({ branch, logoPreview, bannerPreview });

    const handleImageSelect = (field: 'logo' | 'banner', file: File | null) => {
        if (file) {
            form.setValue(field, file);
            const previewUrl = URL.createObjectURL(file);
            if (field === 'logo') {
                setLogoPreview(previewUrl);
            } else {
                setBannerPreview(previewUrl);
            }
        }
    };

    const onSubmit = (values: GeneralSettingsForm) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('phone', values.phone);
        formData.append('email', values.email);
        formData.append('address', values.address);
        if (values.logo instanceof File) formData.append('logo_image', values.logo);
        if (values.banner instanceof File) formData.append('cover_image', values.banner);

        router.post(route('restaurant_setting.general.update'), formData);
        console.log([...formData.entries()]);
    };

    const handleLogoImageSelectButtonClick = () => {
        const input = document.getElementById('logo-image') as HTMLInputElement;
        input.click();
    };

    const handleCoverImageSelectButtonClick = () => {
        const input = document.getElementById('cover-image') as HTMLInputElement;
        input.click();
    };

    // useEffect(() => {
    //     if (branch) {
    //         form.setValue('name', branch.name);
    //         form.setValue('email', branch.email);
    //         form.setValue('phone', branch.email);
    //         form.setValue('address', branch.address);
    //         form.setValue('logo', branch.logoImage);
    //         form.setValue('banner', branch.coverImage);
    //     }
    // }, [form, branch]);

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'General',
                    href: '/settings/general',
                },
            ]}
        >
            <div className="flex h-full justify-center p-4">
                <div className="h-full w-full max-w-3xl rounded-md p-6">
                    <div>
                        <p className="text-2xl font-semibold">General Settings</p>
                        <p className="mt-1.5 text-sm">Manage the restaurant general settings.</p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
                        {/* Name */}
                        <div>
                            <Label className="mb-1" htmlFor="name">
                                Restaurant Name
                            </Label>
                            <Input id="name" {...form.register('name', { required: true })} placeholder="Enter restaurant name" />
                        </div>

                        {/* Phone */}
                        <div>
                            <Label className="mb-1" htmlFor="phone">
                                Phone Number
                            </Label>
                            <Input id="phone" {...form.register('phone')} placeholder="Enter phone number" />
                        </div>

                        {/* Email */}
                        <div>
                            <Label className="mb-1" htmlFor="email">
                                Email
                            </Label>
                            <Input id="email" type="email" {...form.register('email')} placeholder="Enter email address" />
                        </div>

                        {/* Address */}
                        <div>
                            <Label className="mb-1" htmlFor="email">
                                Address
                            </Label>
                            <Input id="address" type="address" {...form.register('address')} placeholder="Enter address" />
                        </div>

                        {/* Logo Upload */}
                        <div>
                            <Label>Logo</Label>
                            <Input
                                className="hidden"
                                id="logo-image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageSelect('logo', e.target.files?.[0] as File)}
                            />
                            {form.watch('logo') instanceof File ? (
                                // ✅ New uploaded file → show preview
                                <div onClick={handleLogoImageSelectButtonClick} className="flex items-center justify-center">
                                    <img
                                        src={
                                            form.watch('logo') instanceof File
                                                ? URL.createObjectURL(form.watch('logo') as File)
                                                : branch.logoImage
                                                  ? `${branch.logoImage}`
                                                  : undefined
                                        }
                                        alt="Preview"
                                        className="h-[220px] w-[220px] rounded-lg object-cover"
                                    />
                                </div>
                            ) : branch.logoImage ? (
                                // ✅ Existing DB image
                                <div onClick={handleLogoImageSelectButtonClick} className="flex items-center justify-center">
                                    <img
                                        src={
                                            form.watch('logo') instanceof File
                                                ? URL.createObjectURL(form.watch('logo') as File)
                                                : branch.logoImage
                                                  ? `${branch.logoImage}`
                                                  : undefined
                                        }
                                        alt={branch.logoImage}
                                        className="h-[220px] w-[220px] rounded-lg object-cover"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <div className="flex h-[220px] flex-col items-center justify-center gap-2.5 rounded-md border border-dotted p-2.5">
                                        <p className="text-sm font-semibold">Drop your image here</p>
                                        <p className="text-sm">PNG or JPG ( 1200px * 1200px )</p>
                                        <div
                                            className="flex items-center gap-2 rounded-sm bg-gray-100 p-2"
                                            onClick={handleLogoImageSelectButtonClick}
                                        >
                                            <Circle size={16} />
                                            <span className="text-sm">Select photo</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Banner Upload */}
                        <div>
                            <Label>Banner</Label>
                            <Input
                                className="hidden"
                                id="cover-image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageSelect('banner', e.target.files?.[0] as File)}
                            />
                            {form.watch('banner') instanceof File ? (
                                // ✅ New uploaded file → show preview
                                <div onClick={handleCoverImageSelectButtonClick} className="flex items-center justify-center">
                                    <img
                                        src={URL.createObjectURL(form.watch('banner') as File)}
                                        alt="Preview"
                                        className="h-[220px] w-[391px] rounded-lg object-cover"
                                    />
                                </div>
                            ) : branch.coverImage ? (
                                // ✅ Existing DB image
                                <div onClick={handleCoverImageSelectButtonClick} className="flex items-center justify-center">
                                    <img
                                        src={
                                            form.watch('banner') instanceof File
                                                ? URL.createObjectURL(form.watch('logo') as File)
                                                : branch.coverImage
                                                  ? `${branch.coverImage}`
                                                  : undefined
                                        }
                                        alt={branch.coverImage}
                                        className="h-[220px] w-[391px] rounded-lg object-cover"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <div className="flex h-[220px] flex-col items-center justify-center gap-2.5 rounded-md border border-dotted p-2.5">
                                        <p className="text-sm font-semibold">Drop your image here</p>
                                        <p className="text-sm">PNG or JPG ( 1200px * 1200px )</p>
                                        <div
                                            className="flex items-center gap-2 rounded-sm bg-gray-100 p-2"
                                            onClick={handleCoverImageSelectButtonClick}
                                        >
                                            <Circle size={16} />
                                            <span className="text-sm">Select photo</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                variant={'outline'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    form.reset();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Save changes</Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
