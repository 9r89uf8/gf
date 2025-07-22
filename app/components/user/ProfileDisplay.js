// app/profile/components/ProfileDisplay.jsx
'use client';

import React from 'react';
import { Avatar, Typography, Box, Button } from '@mui/material';
import { Edit, DeleteForever, Logout } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ActionButton = styled(Button)(({ theme, variant }) => ({
    margin: theme.spacing(1),
    borderRadius: 12,
    padding: '10px 24px',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    
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
}));

const ProfileDisplay = ({ user, onEdit, onDelete, onLogout }) => {
    return (
        <>
            <Avatar
                src={user.profilePic || ''}
                alt={user.name}
                sx={{ 
                    width: 100, 
                    height: 100, 
                    margin: 'auto', 
                    mb: 2, 
                    border: '3px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.1)'
                }}
            />
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', color: 'rgba(15, 23, 42, 0.95)' }}>
                {user.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'rgba(51, 65, 85, 0.8)' }}>
                {user.email}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <ActionButton variant="contained" startIcon={<Edit />} onClick={onEdit}>
                    Editar Perfil
                </ActionButton>
                <ActionButton
                    variant="outlined"
                    startIcon={<Logout />}
                    onClick={onLogout}
                    sx={{
                        border: '2px solid #1a1a1a',
                        color: '#1a1a1a',
                        '&:hover': {
                            border: '2px solid #000000',
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            color: '#000000',
                        },
                    }}
                >
                    Cerrar Sesión
                </ActionButton>
                <ActionButton
                    variant="outlined"
                    startIcon={<DeleteForever />}
                    onClick={onDelete}
                    sx={{
                        border: '2px solid #dc2626',
                        color: '#dc2626',
                        '&:hover': {
                            border: '2px solid #b91c1c',
                            backgroundColor: 'rgba(220, 38, 38, 0.05)',
                            color: '#b91c1c',
                        },
                    }}
                >
                    Eliminar cuenta
                </ActionButton>
            </Box>
        </>
    );
};

export default ProfileDisplay;