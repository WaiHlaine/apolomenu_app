import { QrCodeIcon } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col gap-6 bg-background lg:flex-row">
            <div className="p-12 lg:w-[45vw]">
                <div className="mb-24 flex items-center gap-2">
                    <QrCodeIcon />
                    <p className="font-bold">Apolo Menu</p>
                </div>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="space-y-2">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
            <div
                className="flex flex-col items-center justify-between gap-4 text-center lg:w-[55vw]"
                style={{
                    backgroundImage: 'url(/login_background.png)',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            >
                <div className="pt-24">
                    <p className="text-5xl font-bold text-white">Transform Dining with a Seamless QR Menu Experience.</p>
                </div>
                <img src="/login_image_group.png" />
            </div>
        </div>
    );
}
