import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const REQUEST_ACTION_ICON_NAMES = [
    'call_someone',
    'call_to_clean_table',
    'clarify_bill',
    'clean_table',
    'need_water',
    'note_change',
    'pay_bill',
    'pay_card',
    'pay_cash',
    'spoon_fork',
    'tissue_box',
    'wet_floor',
];
