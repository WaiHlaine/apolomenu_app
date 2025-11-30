import { useAppearance } from './use-appearance';

export function useEffectiveAppearance() {
    const { appearance } = useAppearance();
    const isSystemDark = appearance === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const effectiveAppearance = appearance === 'dark' || isSystemDark ? 'dark' : 'light';

    return effectiveAppearance;
}
