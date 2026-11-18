import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ThemeControl = {
    isDark: boolean;
    toggleTheme: () => void;
};

export function ThemeToggle({ isDark, toggleTheme }: ThemeControl) {
    const ModeIcon = isDark ? Sun : Moon;
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    return (
        <Button type="button" size="icon" variant="outline" className="theme-toggle"
            aria-label={label} title={label} onClick={toggleTheme}>
            <ModeIcon aria-hidden="true" />
        </Button>
    );
}

export function Brand({ logoUrl }: { logoUrl: string }) {
    return <img className="brand-logo" src={logoUrl} width={500} height={144} alt="Shimadzu" />;
}
