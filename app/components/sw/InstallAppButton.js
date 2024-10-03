// app/components/InstallAppButton.jsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@mui/material';

export default function InstallAppButton() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

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
