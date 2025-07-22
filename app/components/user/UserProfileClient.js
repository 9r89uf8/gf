// app/profile/components/UserProfileClient.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Divider, Box } from '@mui/material';
import { useStore } from '@/app/store/store';
import { logoutUser } from '@/app/services/authService';
import ProfileDisplay from './ProfileDisplay';
import ProfileEditForm from './ProfileEditForm';
import DeleteAccountDialog from './DeleteAccountDialog';
import PremiumStatusSection from './PremiumStatusSection';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';

const UserProfileClient = ({initialUserData}) => {
    const [user, setUser] = useState(initialUserData);
    const [isEditing, setIsEditing] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const router = useRouter();


    const handleProfileUpdate = (updatedUser) => {
        setUser(updatedUser);
        setIsEditing(false);
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            router.push('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <ModernCard variant="elevated" animate={true}>
            <CardContentWrapper>
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
                            onLogout={handleLogout}
                        />

                        <Divider sx={{ my: 3, borderColor: 'rgba(0, 0, 0, 0.1)' }} />

                        <PremiumStatusSection
                            user={user}
                            onUpgrade={() => router.push('/products')}
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
            </CardContentWrapper>
        </ModernCard>
    );
};

export default UserProfileClient;