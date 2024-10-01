// components/GlassCard.js
import React from 'react';
import { Card } from '@mui/material';
import { alpha } from '@mui/material/styles';

const GlassCard = ({ children, sx = {}, ...props }) => (
    <Card
        sx={{
            color: 'white',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 15,
            border: (theme) => `1px solid ${alpha('#ffffff', 0.2)}`,
            boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
            padding: (theme) => theme.spacing(4),
            marginBottom: (theme) => theme.spacing(4),
            userSelect: 'none',
            ...sx,
        }}
        {...props}
    >
        {children}
    </Card>
);

export default GlassCard;
