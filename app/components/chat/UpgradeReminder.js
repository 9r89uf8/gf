// UpgradeReminder.js
import React from 'react';
import { Paper, Typography, Button } from '@mui/material';

const UpgradeReminder = ({ handleBuy }) => (
    <Paper
        elevation={4}
        sx={{
            position: 'fixed',
            bottom: 80,
            left: 0,
            right: 0,
            margin: '0 auto',
            padding: 2,
            marginBottom: 3,
            textAlign: 'center',
            zIndex: 1000,
            maxWidth: '300px',
            background: 'linear-gradient(45deg, #343a40, #212529)',
            color: 'white',
            borderRadius: 5,
        }}
    >
        <Typography variant="h4" sx={{ mb: 1 }}>
            Has utilizado todos tus mensajes gratuitos.
        </Typography>
        <Button
            variant="contained"
            color="primary"
            onClick={handleBuy}
            sx={{ fontSize: 20, margin: '8px 0px 8px 0px' }}
        >
            Obtener más
        </Button>
    </Paper>
);

export default UpgradeReminder;
