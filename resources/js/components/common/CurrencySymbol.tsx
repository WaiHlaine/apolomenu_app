import { twMerge } from 'tailwind-merge';

type CurrencySymbolProps = {
    currency: string;
    className?: string;
};

const currencySymbolMap: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    KRW: '₩',
    INR: '₹',
    THB: '฿',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    SGD: 'S$',
    HKD: 'HK$',
    MMK: 'KK',
};

export default function CurrencySymbol({ currency, className }: CurrencySymbolProps) {
    const symbol = currencySymbolMap[currency.toUpperCase()] ?? currency;
    return <span className={twMerge('rounded-md border px-2 py-1 font-bold', className)}>{symbol}</span>;
}
