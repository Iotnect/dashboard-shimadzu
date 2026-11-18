import '@fontsource-variable/inter';
import '../css/app.css';

import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Dashboard, type DashboardData } from '@/dashboard';
import { Login, type LoginData } from '@/login';

export type SharedData = {
    logoUrl: string;
    faviconUrl: string;
    csrfToken: string;
};

const page: (DashboardData | LoginData) & SharedData = JSON.parse(
    document.getElementById('monitor-data')!.textContent!,
);

function App() {
    const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? 'dark');

    function toggleTheme() {
        const next = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        setTheme(next);

        try {
            localStorage.setItem('shimadzu-theme', next);
        } catch {}
    }

    const themeControl = { isDark: theme === 'dark', toggleTheme };

    return page.kind === 'dashboard'
        ? <Dashboard {...page} {...themeControl} />
        : <Login {...page} {...themeControl} />;
}

createRoot(document.getElementById('app')!).render(<App />);
