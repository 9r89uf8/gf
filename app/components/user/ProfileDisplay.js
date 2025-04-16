// app/profile/components/ProfileDisplay.jsx
'use client';

import React from 'react';
import { Avatar, Typography, Box, Button } from '@mui/material';
import { Edit, DeleteForever } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ActionButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
    borderRadius: theme.shape.borderRadius * 3,
}));

const ProfileDisplay = ({ user, onEdit, onDelete }) => {
    return (
        <>
            <Avatar
                src={user.profilePic || ''}
                alt={user.name}
                sx={{ width: 100, height: 100, margin: 'auto', mb: 2, border: '2px solid white' }}
            />
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                {user.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.8)' }}>
                {user.email}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <ActionButton variant="contained" startIcon={<Edit />} onClick={onEdit}>
                    Editar Perfil
                </ActionButton>
                <ActionButton
                    variant="contained"
                    color="error"
                    startIcon={<DeleteForever />}
                    onClick={onDelete}
                >
                    Eliminar cuenta
                </ActionButton>
            </Box>
        </>
    );
};

export default ProfileDisplay;