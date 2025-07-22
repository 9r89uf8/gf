// components/GirlCardMUI.js
'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Avatar, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Lock } from '@mui/icons-material';
import { ModernCard } from '@/app/components/ui/ModernCard';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 100,
    height: 100,
    border: '3px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
    },
}));

const MessageButton = styled(Button)(({ theme }) => ({
    borderRadius: 25,
    padding: '10px 24px',
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    width: '100%',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
    color: 'white',
    boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.2)',
    '&:hover': {
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.3)',
    },
}));

const PremiumButton = styled(Button)(({ theme }) => ({
    borderRadius: 25,
    padding: '10px 16px',
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'none',
    width: '100%',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    color: '#000000',
    boxShadow: '0 4px 15px 0 rgba(245, 158, 11, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(0.5),
    '&:hover': {
        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        boxShadow: '0 6px 20px 0 rgba(245, 158, 11, 0.4)',
    },
}));

const ComingSoonButton = styled(Button)(({ theme }) => ({
    borderRadius: 25,
    padding: '10px 16px',
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'none',
    width: '100%',
    background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    color: '#ffffff',
    cursor: 'not-allowed',
    opacity: 0.8,
    '&:hover': {
        background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    },
}));

const GirlCardMUI = ({ girl, isPremium }) => {
    return (
        <ModernCard 
            variant="compact"
            animate={true}
            sx={{ 
                width: 140,
                height: 240,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                mx: 1.5,
                flexShrink: 0,
            }}
        >
            <Box sx={{ mb: 1 }}>
                <Link href={`/${girl.id}`} passHref style={{ textDecoration: 'none' }}>
                    <StyledAvatar
                        src={`https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/${girl.picture}/w=200,fit=scale-down`}
                        alt={girl.name}
                    />
                </Link>
            </Box>

            <Typography 
                variant="body1" 
                sx={{ 
                    fontWeight: 600, 
                    color: 'rgba(15, 23, 42, 0.95)',
                    mb: 2,
                    textAlign: 'center'
                }}
            >
                {girl.username}
            </Typography>

            <Box sx={{ width: '100%', mt: 'auto' }}>
                {girl.private ? (
                    <ComingSoonButton disabled>
                        Próximamente
                    </ComingSoonButton>
                ) : girl.premium && !isPremium ? (
                    <Link href="/products" passHref style={{ textDecoration: 'none' }}>
                        <PremiumButton>
                            <Lock sx={{ fontSize: '1rem' }} />
                            Premium
                        </PremiumButton>
                    </Link>
                ) : (
                    <Link href={`/chat/${girl.id}`} passHref style={{ textDecoration: 'none' }}>
                        <MessageButton>
                            Mensaje
                        </MessageButton>
                    </Link>
                )}
            </Box>
        </ModernCard>
    );
};

export default GirlCardMUI;