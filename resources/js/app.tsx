import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { configureEcho } from '@laravel/echo-react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

let unlocked = false;

declare global {
    interface Window {
        orderAudio: HTMLAudioElement;
    }
}

window.orderAudio = new Audio('/storage/sounds/new_order.mp3'); // Initialize orderAudio

function unlockAudio() {
    if (!unlocked) {
        window.orderAudio
            .play()
            .then(() => {
                unlocked = true;
                console.log('Audio unlocked for notifications.');
                window.orderAudio.pause(); // Pause after successful play to reset
                console.log('Audio unlocked for notifications.');
            })
            .catch(() => {});

        document.removeEventListener('click', unlockAudio);
    }
}

document.addEventListener('click', unlockAudio);
