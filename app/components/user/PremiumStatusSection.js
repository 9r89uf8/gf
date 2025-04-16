// app/profile/components/PremiumStatusSection.jsx
'use client';

import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { differenceInDays, differenceInHours } from 'date-fns';

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)',
    border: 0,
    borderRadius: 25,
    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .2)',
    color: 'black',
    height: 48,
    padding: '0 30px',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
    },
}));

const PremiumStatusSection = ({ user, onUpgrade }) => {
    // Calculate time remaining for premium users
    let daysRemaining = null;
    let hoursRemaining = null;

    if (user?.premium && user?.expirationDate?._seconds) {
        try {
            const expirationDate = new Date(user.expirationDate._seconds * 1000);
            const now = new Date();
            if (expirationDate > now) {
                daysRemaining = differenceInDays(expirationDate, now);
                hoursRemaining = differenceInHours(expirationDate, now) % 24;
            }
        } catch (e) {
            console.error("Error calculating remaining time:", e);
        }
    }

    if (user.premium) {
        return (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ffd700' }}>
                    Cuenta Premium ✨
                </Typography>
                {daysRemaining !== null && hoursRemaining !== null ? (
                    <>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Tu cuenta premium está activa.
                        </Typography>
                        <Typography variant="body1">
                            Expira en: <strong>{daysRemaining}</strong> día{daysRemaining !== 1 ? 's' : ''} y <strong>{hoursRemaining}</strong> hora{hoursRemaining !== 1 ? 's' : ''}
                        </Typography>
                    </>
                ) : (
                    <Typography variant="body1" sx={{ color: '#ffcbcb' }}>
                        Tu membresía premium no está activa o ha expirado.
                    </Typography>
                )}
            </Box>
        );
    }

    return (
        <GradientButton onClick={onUpgrade} sx={{ mt: 2 }}>
            ✨ Hacerse Premium ✨
        </GradientButton>
    );
};

export default PremiumStatusSection;