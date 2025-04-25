// app/components/bio/ProfileClient.jsx
'use client';

import React from 'react';
import { useStore } from '@/app/store/store';
import { useRouter } from 'next/navigation';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { styled } from "@mui/material/styles";
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from "@mui/icons-material/Lock";
import VerifiedIcon from "@/app/components/landing/VerifiedIcon";

// Keep your styled components for buttons
const GradientButton = styled(Button)(({ theme }) => ({
    // Your existing styles
    background: 'linear-gradient(45deg, #0096c7 30%, #023e8a 90%)',
    border: 0,
    borderRadius: 25,
    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .2)',
    color: 'white',
    fontSize: 24,
    height: 48,
    padding: '0 30px',
    margin: '10px 0',
    fontWeight: 'bold',
    textTransform: 'none',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
    },
}));

const PremiumButton = styled(Button)(({ theme }) => ({
    // Your existing styles
    background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
    border: 0,
    borderRadius: 25,
    color: '#000000',
    fontSize: '1.1rem',
    height: 48,
    padding: '0 32px',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': {
        background: 'linear-gradient(45deg, #FFA500 30%, #FFD700 90%)',
        boxShadow: '0 3px 10px rgba(255, 165, 0, 0.3)',
    },
}));

export default function ProfileClient({ girl }) {
    const router = useRouter();
    const user = useStore((state) => state.user);
    const isPremium = user && user.premium;

    const handleMessageClick = (girlId) => {
        router.push(`/chat/${girlId}`);
    };

    const handlePremium = () => {
        router.push('/premium');
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        } else {
            return num.toString();
        }
    };

    return (
        <Box sx={{ marginTop: { xs: 10, md: 5 } }}>
            <Box display="flex" justifyContent="center">
                <Typography variant="h4" gutterBottom>
                    {girl.username}
                </Typography>
                <VerifiedIcon/>
            </Box>

            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={2}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    mr={2}
                >
                    <Typography variant="h5">
                        {formatNumber(girl.followersCount)}
                    </Typography>
                    <Typography variant="subtitle1">
                        Seguidores
                    </Typography>
                </Box>
            </Box>

            <Box display="flex" alignItems="center" mb={2}>
                <CakeIcon sx={{ mr: 1, fontSize: 36 }} />
                <Typography variant="h6">
                    {girl.age} años
                </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={2}>
                <LocationOnIcon sx={{ mr: 1, fontSize: 36 }} />
                <Typography variant="h6">
                    {girl.country}
                </Typography>
            </Box>

            <Divider
                sx={{
                    my: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}
            />

            <Typography variant="h6" paragraph>
                {girl.bio}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
                {(girl.premium && !isPremium)||girl.private ? (
                    <PremiumButton
                        onClick={handlePremium}
                        startIcon={<LockIcon />}
                    >
                        2026
                    </PremiumButton>
                ) : (
                    <GradientButton
                        onClick={() => handleMessageClick(girl.id)}
                    >
                        Mensaje
                    </GradientButton>
                )}
            </Stack>

            {girl.premium && !isPremium && (
                <Typography variant="body2" sx={{
                    color: '#FFA500',
                    fontStyle: 'italic',
                    mt: -2,
                    mb: 2
                }}>
                    Necesitas una cuenta premium para hablar con esta chica
                </Typography>
            )}
        </Box>
    );
}