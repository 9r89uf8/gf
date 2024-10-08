'use client';
import React, { useEffect } from 'react';
import { Alert } from '@mui/material';
import { useStore } from '@/app/store/store'; // Ensure this path is correct according to your structure

const Notification = ({ id, type, message }) => {
    const removeNotification = useStore((state) => state.removeNotification);

    useEffect(() => {
        const timer = setTimeout(() => {
            removeNotification(id);
        }, 9000);

        return () => clearTimeout(timer);
    }, [id, removeNotification]);

    const gradientBackgrounds = {
        success: 'linear-gradient(to right, #00b09b, #96c93d)',
        warning: 'linear-gradient(to right, #f7971e, #ffd200)',
        error: 'linear-gradient(to right, #e53935, #e35d5b)',
        info: 'linear-gradient(to right, #2196f3, #21cbf3)',
    };

    const alertStyles = {
        background: gradientBackgrounds[type] || gradientBackgrounds['info'],
        color: '#fff',
        '& .MuiAlert-icon': {
            color: '#fff',
        },
        '& .MuiAlert-action': {
            color: '#fff',
        },
    };

    return (
        <Alert
            severity={type}
            onClose={() => removeNotification(id)}
            sx={alertStyles}
        >
            {message}
        </Alert>
    );
};

export default Notification;


