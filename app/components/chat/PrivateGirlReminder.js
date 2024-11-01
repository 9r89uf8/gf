import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import Link from "next/link";

const PrivateGirlReminder = () => (
    <Paper
        elevation={4}
        sx={{
            position: 'fixed',
            bottom: 110,
            left: 0,
            right: 0,
            margin: '0 auto',
            padding: 2,
            textAlign: 'center',
            zIndex: 1000,
            maxWidth: '300px',
        }}
    >
        <Typography variant="h5" sx={{ mb: 1 }}>
            Usuario no permite mensajes
        </Typography>
    </Paper>
);

export default PrivateGirlReminder;