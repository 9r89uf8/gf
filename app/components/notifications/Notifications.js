// components/Notifications.jsx
'use client';

import React from 'react';
import { Container } from '@mui/material';
import Notification from './Notification';
import { useStore } from '@/app/store/store';

const Notifications = () => {
    const notifications = useStore((state) => state.notifications);

    return (
        <Container style={{ position: 'fixed', top: '3.6rem', zIndex: 9999 }}>
            {notifications.map((notification) => (
                <Notification key={notification.id} {...notification} />
            ))}
        </Container>
    );
};

export default Notifications;
