import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { AlertTriangleIcon, CheckCircle, InfoIcon, LoaderCircle, TriangleAlertIcon, XIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
        <Toaster
            theme="system"
            position="top-right"
            duration={5000}
            icons={{
                success: <CheckCircle className="h-4 w-4 text-green-500" />,
                error: <TriangleAlertIcon className="h-4 w-4 text-red-500" />,
                info: <InfoIcon className="h-4 w-4 text-blue-500" />,
                warning: <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />,
                loading: <LoaderCircle className="h-4 w-4 animate-spin text-gray-500" />,
                close: <XIcon className="h-4 w-4 text-muted-foreground" />,
            }}
            toastOptions={{
                classNames: {
                    error: 'bg-red-500 text-white',
                    success: 'bg-green-500 text-white',
                    info: 'bg-blue-500 text-white',
                    warning: 'bg-yellow-500 text-black',
                },
            }}
        />
    </AppLayoutTemplate>
);
