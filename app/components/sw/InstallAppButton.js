// app/components/InstallAppButton.jsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@mui/material';

export default function InstallAppButton() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        // Check if the app is already installed
        const checkInstalled = async () => {
            if ('getInstalledRelatedApps' in navigator) {
                const installations = await navigator.getInstalledRelatedApps();
                if (installations.length > 0) {
                    setIsInstallable(false);
                    localStorage.removeItem('pwaInstallable');
                    return;
                }
            }

            // Check localStorage for saved installable state
            const savedInstallable = localStorage.getItem('pwaInstallable');
            if (savedInstallable === 'true') {
                setIsInstallable(true);
            }
        };

        checkInstalled();

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
            // Save the installable state
            localStorage.setItem('pwaInstallable', 'true');
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if the app was installed through browser UI
        window.addEventListener('appinstalled', (e) => {
            setIsInstallable(false);
            localStorage.removeItem('pwaInstallable');
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            // If we don't have the prompt but isInstallable is true,
            // we should wait for the next beforeinstallprompt event
            setIsInstallable(false);
            localStorage.removeItem('pwaInstallable');
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            setIsInstallable(false);
            localStorage.removeItem('pwaInstallable');
        } else {
            console.log('User dismissed the install prompt');
            // Keep the button visible in case user wants to install later
            setIsInstallable(true);
            localStorage.setItem('pwaInstallable', 'true');
        }

        setDeferredPrompt(null);
    };

    // Add a function to check if the app is running in standalone mode
    const isPWAInstalled = () => {
        return window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone ||
            document.referrer.includes('android-app://');
    };

    useEffect(() => {
        if (isPWAInstalled()) {
            setIsInstallable(false);
            localStorage.removeItem('pwaInstallable');
        }
    }, []);

    if (!isInstallable) {
        return null;
    }

    return (
        <Button
            onClick={handleInstallClick}
            sx={{
                background: 'linear-gradient(45deg, #343a40 30%, #000814 90%)',
                borderRadius: 25,
                fontSize: 30,
                color: 'white',
                height: 48,
                padding: '0 15px',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': {
                    background: 'linear-gradient(45deg, #fe8b8b 30%, #ffae53 90%)',
                },
            }}
        >
            Instalar App
        </Button>
    );
}
