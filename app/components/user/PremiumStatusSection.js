// app/profile/components/PremiumStatusSection.jsx
'use client';

import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { differenceInDays, differenceInHours } from 'date-fns';

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
    border: 0,
    borderRadius: 12,
    boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.2)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.3)',
    },
}));

const PremiumStatusSection = ({ user, onUpgrade }) => {
    // Get active payment details from payments array
    let daysRemaining = null;
    let hoursRemaining = null;
    let activePlan = null;

    if (user?.premium && user?.payments?.length > 0) {
        // Find the most recent completed payment
        const activePayment = user.payments
            .filter(p => p.status === 'completed')
            .sort((a, b) => new Date(b.date._seconds || b.date) - new Date(a.date._seconds || a.date))[0];

        if (activePayment) {
            activePlan = {
                type: activePayment.productType || 'premium',
                amount: activePayment.amount,
                currency: activePayment.currency,
                isLifetime: !activePayment.expiresAt
            };

            // Calculate remaining time if not lifetime
            if (activePayment.expiresAt) {
                try {
                    const expirationDate = new Date(activePayment.expiresAt._seconds 
                        ? activePayment.expiresAt._seconds * 1000 
                        : activePayment.expiresAt);
                    const now = new Date();
                    if (expirationDate > now) {
                        daysRemaining = differenceInDays(expirationDate, now);
                        hoursRemaining = differenceInHours(expirationDate, now) % 24;
                    }
                } catch (e) {
                    console.error("Error calculating remaining time:", e);
                }
            }
        }
    }

    if (user.premium && activePlan) {
        const formatCurrency = (amount, currency) => {
            return new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: currency?.toUpperCase() || 'USD',
            }).format((amount || 0) / 100);
        };

        return (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.05)', borderRadius: 2, border: '1px solid rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                    Cuenta Premium ✨
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 1, color: 'rgba(15, 23, 42, 0.95)' }}>
                    Plan: <strong>{activePlan.type.charAt(0).toUpperCase() + activePlan.type.slice(1)}</strong>
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1, color: 'rgba(51, 65, 85, 0.8)' }}>
                    Precio: {formatCurrency(activePlan.amount, activePlan.currency)}
                </Typography>

                {activePlan.isLifetime ? (
                    <Typography variant="body1" sx={{ color: '#059669', fontWeight: 'bold' }}>
                        ✓ Acceso de por vida
                    </Typography>
                ) : daysRemaining !== null && hoursRemaining !== null ? (
                    <>
                        <Typography variant="body1" sx={{ mb: 1, color: 'rgba(15, 23, 42, 0.95)' }}>
                            Tu cuenta premium está activa.
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(15, 23, 42, 0.95)' }}>
                            Expira en: <strong>{daysRemaining}</strong> día{daysRemaining !== 1 ? 's' : ''} y <strong>{hoursRemaining}</strong> hora{hoursRemaining !== 1 ? 's' : ''}
                        </Typography>
                    </>
                ) : (
                    <Typography variant="body1" sx={{ color: '#dc2626', fontWeight: 500 }}>
                        Tu membresía premium ha expirado.
                    </Typography>
                )}
            </Box>
        );
    } else if (user.premium) {
        // Premium user but no payment details found
        return (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.05)', borderRadius: 2, border: '1px solid rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                    Cuenta Premium ✨
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(15, 23, 42, 0.95)' }}>
                    Tu cuenta premium está activa.
                </Typography>
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