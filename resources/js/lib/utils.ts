import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const orderTypes: Record<string, string> = {
    dine_in: 'Dine In',
    take_out: 'Take Out',
    delivery: 'Delivery',
};
