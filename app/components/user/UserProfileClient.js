// app/profile/components/UserProfileClient.jsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Typography, Divider, Box } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import ProfileDisplay from './ProfileDisplay';
import ProfileEditForm from './ProfileEditForm';
import DeleteAccountDialog from './DeleteAccountDialog';
import PremiumStatusSection from './PremiumStatusSection';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 15,
    marginBottom: 40,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.10)',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    padding: theme.spacing(3),
}));

const UserProfileClient = ({ initialUserData }) => {
    const [user, setUser] = useState(initialUserData);
    const [isEditing, setIsEditing] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const router = useRouter();

    const handleProfileUpdate = (updatedUser) => {
        setUser(updatedUser);
        setIsEditing(false);
    };

    return (
        <StyledCard>
            {isEditing ? (
                <ProfileEditForm
                    user={user}
                    onSave={handleProfileUpdate}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <>
                    <ProfileDisplay
                        user={user}
                        onEdit={() => setIsEditing(true)}
                        onDelete={() => setOpenDeleteDialog(true)}
                    />

                    <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

                    <PremiumStatusSection
                        user={user}
                        onUpgrade={() => router.push('/premium')}
                    />
                </>
            )}

            <DeleteAccountDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={() => {
                    // Handle deletion logic
                    router.push('/register');
                }}
            />
        </StyledCard>
    );
};

export default UserProfileClient;