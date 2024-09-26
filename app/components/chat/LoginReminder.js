// LoginReminder.js
import React from 'react';
import { Paper, Typography, Button } from '@mui/material';

const LoginReminder = ({ girl, handleLoginRedirect }) => (
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
        <Typography variant="h6" sx={{ mb: 1 }}>
            You need to log in or register to chat with {girl?.username}.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLoginRedirect}>
            Log In or Register
        </Button>
    </Paper>
);

export default LoginReminder;
