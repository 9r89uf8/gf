// app/profile/components/UserProfileClient.jsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Typography, Divider, Box, Skeleton } from '@mui/material';
import { useStore } from '@/app/store/store';
import { logoutUser } from '@/app/services/authService';
import ProfileDisplay from './ProfileDisplay';
import ProfileEditForm from './ProfileEditForm';
import DeleteAccountDialog from './DeleteAccountDialog';
import PremiumStatusSection from './PremiumStatusSection';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';

// Dynamic import for UserPostsSection to reduce initial bundle size
const UserPostsSection = dynamic(() => import('./UserPostsSection'), {
    loading: () => (
        <Box sx={{ mb: 4 }}>
            <Skeleton variant="text" width="25%" height={28} sx={{ mb: 3 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
                {[1, 2, 3].map((item) => (
                    <Box key={item}>
                        <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
                        <Box sx={{ pt: 2 }}>
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="40%" />
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    ),
    ssr: false
});

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
            router.push('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <ModernCard variant="elevated" animate={false}>
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

                        <Divider sx={{ my: 3, borderColor: 'rgba(0, 0, 0, 0.1)' }} />

                        <UserPostsSection userId={user.id} />
                    </>
                )}

                <DeleteAccountDialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    onConfirm={async () => {
                        // Handle deletion logic
                        await logoutUser();
                        router.push('/register');
                    }}
                />
            </CardContentWrapper>
        </ModernCard>
    );
};

export default UserProfileClient;