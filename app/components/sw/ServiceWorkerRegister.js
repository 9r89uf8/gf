// app/components/ServiceWorkerRegister.jsx
'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
        const sw = '/sw.js';

        navigator.serviceWorker
            .register(sw)
            .then((registration) => {
                console.log('Service Worker registered: ', registration);

                registration.addEventListener('updatefound', () => {
                    const installingWorker = registration.installing;
                    if (installingWorker == null) return;

                    installingWorker.addEventListener('statechange', () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                console.log('New content is available; please refresh.');
                            } else {
                                console.log('Content is cached for offline use.');
                            }
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('Error during service worker registration:', error);
            });

        // Add listener for subsequent page loads
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });
    }
}
