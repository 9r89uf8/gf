// app/components/ui/GlassCard.jsx
'use client'; // Add this to make it a client component

import Card from '@mui/material/Card';
import { alpha, styled } from "@mui/material/styles";

const GlassCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 15,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
    marginTop: 10,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
}));

export default GlassCard;