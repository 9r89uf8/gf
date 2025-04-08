// app/components/bio/ImageModalClient.jsx
'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
};

export default function ImageModalClient() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fullscreenImageSrc, setFullscreenImageSrc] = useState(null);

    useEffect(() => {
        // Get the container element
        const container = document.getElementById('profile-images-container');
        if (!container) return;

        // Get URLs from data attributes
        const backgroundUrl = container.dataset.backgroundUrl;
        const profileUrl = container.dataset.profileUrl;

        // Add click handlers to the background image
        const backgroundElement = document.getElementById('profile-background-image');
        if (backgroundElement) {
            backgroundElement.addEventListener('click', () => {
                setFullscreenImageSrc(backgroundUrl);
                setIsFullscreen(true);
            });
        }

        // Add click handlers to the profile image
        const profileElement = document.getElementById('profile-avatar-image');
        if (profileElement) {
            profileElement.addEventListener('click', () => {
                setFullscreenImageSrc(profileUrl);
                setIsFullscreen(true);
            });
        }

        // Cleanup function
        return () => {
            if (backgroundElement) {
                backgroundElement.removeEventListener('click', () => {});
            }
            if (profileElement) {
                profileElement.removeEventListener('click', () => {});
            }
        };
    }, []);

    const handleCloseFullscreen = () => {
        setIsFullscreen(false);
    };

    return (
        <Modal
            open={isFullscreen}
            onClose={handleCloseFullscreen}
            aria-labelledby="fullscreen-image-modal"
            aria-describedby="modal-to-display-fullscreen-image"
            disableScrollLock
        >
            <Box sx={modalStyle} onClick={handleCloseFullscreen}>
                <img
                    src={fullscreenImageSrc}
                    alt="Fullscreen Image"
                    style={{
                        maxWidth: '90%',
                        maxHeight: '90%',
                        objectFit: 'contain',
                        cursor: 'pointer',
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
            </Box>
        </Modal>
    );
}