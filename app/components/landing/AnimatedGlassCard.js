'use client';
import React from 'react';
import { Card } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const GlassCard = styled(Card)(({ theme }) => ({
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 15,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    userSelect: 'none',
}));

const AnimatedGlassCard = ({ children }) => {
    return (
        <GlassCard
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {children}
        </GlassCard>
    );
};

export default AnimatedGlassCard;
