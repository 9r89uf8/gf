'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Lock } from '@mui/icons-material';
import Link from 'next/link';

const OverlayContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 10,
    padding: theme.spacing(3),
}));

const LockIconWrapper = styled(Box)(({ theme }) => ({
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    border: '2px solid rgba(255, 255, 255, 0.2)',
}));

const PremiumButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: '#000000',
    borderRadius: 25,
    padding: '12px 32px',
    fontWeight: 600,
    fontSize: '0.95rem',
    textTransform: 'none',
    marginTop: theme.spacing(2),
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #FFE234 0%, #FFB534 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)',
    },
}));

const PremiumOverlay = () => {
    return (
        <OverlayContainer>
            <LockIconWrapper>
                <Lock sx={{ fontSize: 40, color: '#FFD700' }} />
            </LockIconWrapper>
            <Typography 
                variant="h5" 
                sx={{ 
                    color: '#ffffff', 
                    fontWeight: 700,
                    marginBottom: 1,
                    textAlign: 'center'
                }}
            >
                Contenido Premium
            </Typography>
            <Typography 
                variant="body1" 
                sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    textAlign: 'center',
                    maxWidth: '80%'
                }}
            >
                Actualiza a premium para desbloquear este contenido
            </Typography>
            <Link href="/products" passHref style={{ textDecoration: 'none' }}>
                <PremiumButton>
                    Desbloquear Ahora
                </PremiumButton>
            </Link>
        </OverlayContainer>
    );
};

export default PremiumOverlay;