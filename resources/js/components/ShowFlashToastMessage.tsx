import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

type FlashMessage = {
    success?: string;
    error?: string | Record<string, string>;
    warning?: string;
    info?: string;
    key?: string | number;
};

export const ShowFlashMessageToast = () => {
    const { flash, errors } = usePage().props as unknown as {
        flash: FlashMessage;
        errors: Record<string, string>;
    };

    const lastFlashKey = useRef<string | number | null>(null);
    const lastErrorKeys = useRef<string[]>([]);

    // 🔹 Handle flash messages
    useEffect(() => {
        if (!flash?.key || flash.key === lastFlashKey.current) return;

        if (flash.success) toast.success(flash.success);
        if (flash.warning) toast.warning(flash.warning);
        if (flash.info) toast.info(flash.info);

        if (flash.error) {
            if (typeof flash.error === 'object') {
                Object.values(flash.error).forEach((e) => toast.error(e));
            } else {
                toast.error(flash.error);
            }
        }

        lastFlashKey.current = flash.key;
    }, [flash]);

    // 🔹 Handle validation errors
    useEffect(() => {
        if (!errors) return;

        const errorKeys = Object.keys(errors);
        const newErrors = errorKeys.filter((key) => !lastErrorKeys.current.includes(key));

        if (newErrors.length > 0) {
            newErrors.forEach((key) => toast.error(errors[key]));
            lastErrorKeys.current = errorKeys; // update seen errors
        }

        // If no errors, reset the ref (so new ones will be shown again next time)
        if (errorKeys.length === 0) {
            lastErrorKeys.current = [];
        }
    }, [errors]);

    return null;
};
