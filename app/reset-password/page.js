'use client'
import React, {useEffect, useState} from 'react';
import { Box, Card, Typography, TextField, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { passwordReset } from '@/app/services/authService';
import { alpha, styled } from "@mui/material/styles";

const GlassCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 15,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.15)',
}));

const GradientButton = styled('button')(({ theme }) => ({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: '10px 0',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
    },
    '&:disabled': {
        background: 'rgba(255, 255, 255, 0.3)',
        cursor: 'not-allowed',
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: 20,
    '& label.Mui-focused': {
        color: 'white',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },
    '& .MuiInputBase-input': {
        color: 'white',
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
    },
}));

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [turnstileToken, setTurnstileToken] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.turnstile) {
                window.turnstile.render('#turnstile-widget', {
                    sitekey: '0x4AAAAAAA_HdjBUf9sbezTK',
                    callback: (token) => setTurnstileToken(token),
                });
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await passwordReset(email, turnstileToken);
        setIsLoading(false);
        setIsSubmitted(true);
    };

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - var(--floating-navbar-height, 0px))',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(45deg, #343a40 0%, #212529 100%)',
                padding: 2,
            }}
        >
            <GlassCard sx={{ width: '380px', maxWidth: '90%', padding: 3 }}>
                <Typography variant="h4" sx={{ color: 'white', marginBottom: 3, fontWeight: 'bold' }}>
                    Solicitud de nueva contraseña
                </Typography>
                <Typography variant="h6" sx={{ color: 'white', marginBottom: 2 }}>
                    Introduce tu correo electrónico
                </Typography>

                {isSubmitted ? (
                    <Alert severity="success" sx={{ mb: 2, backgroundColor: 'rgba(76, 175, 80, 0.1)', color: 'white', fontSize: 19 }}>
                        Por favor, revisa tu correo electrónico para encontrar el correo para crear una nueva contraseña.
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <StyledTextField
                            required
                            fullWidth
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Correo electrónico"
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <LockOutlinedIcon sx={{ color: 'white', mr: 1 }} />
                                ),
                            }}
                        />
                        <div id="turnstile-widget"></div>

                        <GradientButton type="submit" disabled={isLoading || isSubmitted}>
                            {isLoading ? "Enviando..." : "Enviar"}
                        </GradientButton>
                    </form>
                )}
            </GlassCard>
        </Box>
    );
};

export default ResetPassword;
