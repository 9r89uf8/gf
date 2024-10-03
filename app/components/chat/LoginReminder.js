// LoginReminder.js
import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import Link from "next/link";

const LoginReminder = () => (
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
            Necesitas entrar a tu cuenta o registrarte para mandar mesajes.
        </Typography>
        <Link href="/login" passHref legacyBehavior>
            <Button
                sx={{
                    background: 'linear-gradient(45deg, #0096c7 30%, #023e8a 90%)',
                    border: 0,
                    fontSize:18,
                    borderRadius: 25,
                    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .1)',
                    color: 'white',
                    height: 48,
                    padding: '0 15px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
                    },
                }}
            >
                Entrar a mi cuenta
            </Button>
        </Link>
        <Link href="/register" passHref legacyBehavior>
            <Button
                sx={{
                    background: 'linear-gradient(45deg, #2b9348 30%, #007f5f 90%)',
                    border: 0,
                    fontSize:18,
                    borderRadius: 25,
                    marginTop: 2,
                    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .1)',
                    color: 'white',
                    height: 48,
                    padding: '0 15px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
                    },
                }}
            >
                Crear cuenta
            </Button>
        </Link>
    </Paper>
);

export default LoginReminder;
