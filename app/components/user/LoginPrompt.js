// app/profile/components/LoginPrompt.jsx
'use client';
import React from 'react';
import Link from 'next/link';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import { LoginOutlined, PersonAddOutlined } from '@mui/icons-material';

const LoginPromptContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
    borderRadius: 12,
    padding: '12px 32px',
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    gap: theme.spacing(1),
    
    ...(variant === 'contained' && {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
        color: 'white',
        boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.2)',
        '&:hover': {
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.3)',
        },
    }),
    
    ...(variant === 'outlined' && {
        border: '2px solid rgba(0, 0, 0, 0.2)',
        color: 'rgba(15, 23, 42, 0.95)',
        '&:hover': {
            border: '2px solid rgba(0, 0, 0, 0.4)',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
    }),
}));

const LoginPrompt = () => {
    return (
        <LoginPromptContainer>
            <Box sx={{ maxWidth: 600, width: '100%' }}>
                <ModernCard variant="elevated" animate={false}>
                    <CardContentWrapper>
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    color: 'rgba(15, 23, 42, 0.95)',
                                    fontWeight: 600,
                                    mb: 3
                                }}
                            >
                                Para hablar tienes que crear una cuenta o inicia sesión.
                            </Typography>
                            
                            <Box sx={{ 
                                display: 'flex', 
                                gap: 2, 
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                            }}>
                                <StyledButton
                                    component={Link}
                                    href="/login"
                                    variant="contained"
                                    startIcon={<LoginOutlined />}
                                >
                                    Iniciar sesión
                                </StyledButton>
                                
                                <StyledButton
                                    component={Link}
                                    href="/register"
                                    variant="outlined"
                                    startIcon={<PersonAddOutlined />}
                                >
                                    Registrarse
                                </StyledButton>
                            </Box>
                        </Box>
                    </CardContentWrapper>
                </ModernCard>
            </Box>
        </LoginPromptContainer>
    );
};

export default LoginPrompt;