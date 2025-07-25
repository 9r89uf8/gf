// app/profile/components/ProfileDisplay.jsx
'use client';

import React from 'react';
import { Avatar, Typography, Box, Button, Chip } from '@mui/material';
import { Edit, DeleteForever, Logout, Person, Cake, FavoriteBorder, LocationOn, Wc, Add } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const InfoChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    '& .MuiChip-icon': {
        color: 'rgba(0, 0, 0, 0.6)',
    },
}));

const EmptyInfoChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    border: '1px dashed rgba(0, 0, 0, 0.2)',
    color: 'rgba(0, 0, 0, 0.4)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '& .MuiChip-icon': {
        color: 'rgba(0, 0, 0, 0.3)',
    },
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        border: '1px dashed rgba(0, 0, 0, 0.3)',
        color: 'rgba(0, 0, 0, 0.6)',
        '& .MuiChip-icon': {
            color: 'rgba(0, 0, 0, 0.5)',
        },
    },
}));

const getRelationshipLabel = (status) => {
    const labels = {
        'single': 'Soltero/a',
        'in_relationship': 'En una relación',
        'married': 'Casado/a',
        'complicated': 'Es complicado'
    };
    return labels[status] || status;
};

const getSexLabel = (sex) => {
    const labels = {
        'male': 'Masculino',
        'female': 'Femenino',
        'other': 'Otro',
        'prefer_not_to_say': 'Prefiero no decir'
    };
    return labels[sex] || sex;
};

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
            <Typography variant="body1" sx={{ mb: 1, color: 'rgba(51, 65, 85, 0.8)' }}>
                {user.email}
            </Typography>
            {user.username && (
                <Typography variant="body2" sx={{ mb: 3, color: 'rgba(71, 85, 105, 0.8)' }}>
                    @{user.username}
                </Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
                {user.age ? (
                    <InfoChip
                        icon={<Cake />}
                        label={`${user.age} años`}
                        size="small"
                    />
                ) : (
                    <EmptyInfoChip
                        icon={<Add />}
                        label="Agregar edad"
                        size="small"
                        onClick={onEdit}
                    />
                )}
                {user.sex ? (
                    <InfoChip
                        icon={<Person />}
                        label={getSexLabel(user.sex)}
                        size="small"
                    />
                ) : (
                    <EmptyInfoChip
                        icon={<Add />}
                        label="Agregar sexo"
                        size="small"
                        onClick={onEdit}
                    />
                )}
                {user.relationshipStatus ? (
                    <InfoChip
                        icon={<FavoriteBorder />}
                        label={getRelationshipLabel(user.relationshipStatus)}
                        size="small"
                    />
                ) : (
                    <EmptyInfoChip
                        icon={<Add />}
                        label="Agregar estado"
                        size="small"
                        onClick={onEdit}
                    />
                )}
                {user.country ? (
                    <InfoChip
                        icon={<LocationOn />}
                        label={user.country}
                        size="small"
                    />
                ) : (
                    <EmptyInfoChip
                        icon={<Add />}
                        label="Agregar país"
                        size="small"
                        onClick={onEdit}
                    />
                )}
            </Box>

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