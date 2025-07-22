'use client'
import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Alert } from '@mui/material';
import { EmailOutlined, CheckCircleOutline } from '@mui/icons-material';
import { passwordReset } from '@/app/services/authService';
import { alpha, styled } from "@mui/material/styles";
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import Link from 'next/link';
import { ModernCard, CompactCard, CardContentWrapper } from '@/app/components/ui/ModernCard';

// Styled components
const ResetContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(3),
    position: 'relative',
    zIndex: 1,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    '& .MuiOutlinedInput-root': {
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        '& fieldset': {
            border: 'none',
        },
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            border: '1px solid rgba(0, 0, 0, 0.2)',
        },
        '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #1a1a1a',
            boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)',
        },
    },
    '& .MuiInputBase-input': {
        color: 'rgba(15, 23, 42, 0.95)',
        fontSize: '1.1rem',
        padding: '16px 14px',
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(51, 65, 85, 0.7)',
        fontSize: '1.1rem',
        '&.Mui-focused': {
            color: '#1a1a1a',
        },
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
        color: 'rgba(51, 65, 85, 0.6)',
    },
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
    borderRadius: 12,
    fontSize: '1.1rem',
    fontWeight: 600,
    textTransform: 'none',
    color: 'white',
    padding: '14px 32px',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        transform: 'translateY(-2px) scale(1.02)',
        boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.3)',
    },
    '&:active': {
        transform: 'translateY(0) scale(0.98)',
    },
    '&:disabled': {
        background: 'rgba(0, 0, 0, 0.1)',
        color: 'rgba(51, 65, 85, 0.3)',
        boxShadow: 'none',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
        transition: 'left 0.5s ease',
    },
    '&:hover::before': {
        left: '100%',
    },
}));

const TextButton = styled(Button)(({ theme }) => ({
    color: 'rgba(51, 65, 85, 0.8)',
    fontSize: '0.95rem',
    textTransform: 'none',
    marginTop: theme.spacing(1),
    padding: '8px 16px',
    borderRadius: 8,
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        color: 'rgba(15, 23, 42, 0.95)',
    },
}));

const Logo = styled('img')({
    width: 60,
    height: 'auto',
    marginBottom: 16,
    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
});

const FooterCard = styled(CompactCard)(({ theme }) => ({
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    textAlign: 'center',
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    color: 'rgba(15, 23, 42, 0.95)',
    fontSize: '1rem',
    '& .MuiAlert-icon': {
        color: '#1a1a1a',
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
        
        const data = { email, turnstileToken };
        await passwordReset(data);
        
        setIsLoading(false);
        setIsSubmitted(true);
    };

    return (
        <ResetContainer>
            <Fade in={true} timeout={800}>
                <ModernCard 
                    sx={{ width: '100%', maxWidth: 440 }}
                    variant="elevated"
                    animate={true}
                >
                    <CardContentWrapper>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Logo 
                                src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/Untitled+design+(3).png" 
                                alt="NoviaChat Logo"
                            />
                            <Typography 
                                variant="h3" 
                                sx={{ 
                                    color: '#1a1a1a', 
                                    fontWeight: 700,
                                    mb: 1,
                                    fontSize: { xs: '2rem', sm: '2.5rem' },
                                }}
                            >
                                Recuperar Contraseña
                            </Typography>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    color: 'rgba(51, 65, 85, 0.7)',
                                    fontSize: '1.1rem'
                                }}
                            >
                                Te enviaremos instrucciones por correo
                            </Typography>
                        </Box>

                        {isSubmitted ? (
                            <Fade in={true} timeout={500}>
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <CheckCircleOutline 
                                        sx={{ 
                                            fontSize: 64, 
                                            color: '#1a1a1a',
                                            mb: 2
                                        }} 
                                    />
                                    <StyledAlert 
                                        severity="success"
                                        sx={{ mb: 3 }}
                                    >
                                        ¡Correo enviado exitosamente! Por favor, revisa tu bandeja de entrada para encontrar las instrucciones para crear una nueva contraseña.
                                    </StyledAlert>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: 'rgba(51, 65, 85, 0.6)', 
                                            mb: 3 
                                        }}
                                    >
                                        No olvides revisar tu carpeta de spam si no ves el correo en unos minutos.
                                    </Typography>
                                    <TextButton
                                        component={Link}
                                        href="/login"
                                        sx={{
                                            border: '1px solid rgba(0, 0, 0, 0.2)',
                                            '&:hover': {
                                                borderColor: 'rgba(0, 0, 0, 0.4)',
                                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                            }
                                        }}
                                    >
                                        Volver al inicio de sesión
                                    </TextButton>
                                </Box>
                            </Fade>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <StyledTextField
                                    label="Correo electrónico"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    autoComplete="email"
                                    autoFocus
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailOutlined />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                
                                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                    <div id="turnstile-widget"></div>
                                </Box>

                                <GradientButton
                                    type="submit"
                                    fullWidth
                                    disabled={isLoading}
                                    variant="contained"
                                    size="large"
                                >
                                    {isLoading ? (
                                        <CircularProgress size={24} sx={{ color: 'white' }} />
                                    ) : (
                                        'Enviar instrucciones'
                                    )}
                                </GradientButton>

                                <Box sx={{ textAlign: 'center', mt: 3 }}>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ color: 'rgba(51, 65, 85, 0.6)', mb: 1 }}
                                    >
                                        ¿Recordaste tu contraseña?
                                    </Typography>
                                    <TextButton
                                        component={Link}
                                        href="/login"
                                    >
                                        Volver a iniciar sesión
                                    </TextButton>
                                </Box>
                            </form>
                        )}
                    </CardContentWrapper>
                </ModernCard>
            </Fade>

            <FooterCard variant="flat" animate={false}>
                <Typography 
                    sx={{ 
                        color: 'rgba(51, 65, 85, 0.7)',
                        fontSize: '0.9rem'
                    }}
                >
                    © 2025 NoviaChat. Todos los derechos reservados.
                </Typography>
            </FooterCard>
        </ResetContainer>
    );
};

export default ResetPassword;