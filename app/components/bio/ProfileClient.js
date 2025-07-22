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
import VerifiedIcon from "@/app/components/homepage/VerifiedIcon";

// Keep your styled components for buttons
const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
    border: 0,
    borderRadius: 25,
    color: '#ffffff',
    fontSize: '1.2rem',
    height: 56,
    padding: '0 40px',
    margin: '10px 0',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.3)',
    },
}));

const PremiumButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    border: 0,
    borderRadius: 25,
    color: '#000000',
    fontSize: '1.2rem',
    height: 56,
    padding: '0 40px',
    textTransform: 'none',
    fontWeight: 600,
    boxShadow: '0 4px 15px 0 rgba(255, 165, 0, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px 0 rgba(255, 165, 0, 0.4)',
    },
}));

const ComingSoonButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    border: 0,
    borderRadius: 25,
    color: '#ffffff',
    fontSize: '1.2rem',
    height: 56,
    padding: '0 40px',
    textTransform: 'none',
    fontWeight: 600,
    cursor: 'not-allowed',
    opacity: 0.8,
    '&:hover': {
        background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
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
            <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                <Typography variant="h4" gutterBottom sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 700 }}>
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
                    <Typography variant="h5" sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 700 }}>
                        {formatNumber(girl.followersCount)}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                        Seguidores
                    </Typography>
                </Box>
            </Box>

            <Box display="flex" alignItems="center" mb={2}>
                <CakeIcon sx={{ mr: 1, fontSize: 28, color: 'rgba(71, 85, 105, 0.8)' }} />
                <Typography variant="h6" sx={{ color: 'rgba(51, 65, 85, 0.9)' }}>
                    {girl.age} años
                </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={2}>
                <LocationOnIcon sx={{ mr: 1, fontSize: 28, color: 'rgba(71, 85, 105, 0.8)' }} />
                <Typography variant="h6" sx={{ color: 'rgba(51, 65, 85, 0.9)' }}>
                    {girl.country}
                </Typography>
            </Box>

            <Divider
                sx={{
                    my: 3,
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                }}
            />

            <Typography variant="body1" paragraph sx={{ 
                color: 'rgba(71, 85, 105, 0.9)', 
                fontSize: '1.1rem',
                lineHeight: 1.8,
                mb: 4
            }}>
                {girl.bio}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
                {girl.private ? (
                    <ComingSoonButton disabled>
                        Próximamente
                    </ComingSoonButton>
                ) : girl.premium && !isPremium ? (
                    <PremiumButton
                        onClick={handlePremium}
                        startIcon={<LockIcon />}
                    >
                        Premium
                    </PremiumButton>
                ) : (
                    <GradientButton
                        onClick={() => handleMessageClick(girl.id)}
                    >
                        Mensaje
                    </GradientButton>
                )}
            </Stack>

            {girl.private ? (
                <Typography variant="body2" sx={{
                    color: '#64748b',
                    fontStyle: 'italic',
                    mt: -2,
                    mb: 2,
                    textAlign: 'center'
                }}>
                    Esta chica estará disponible pronto
                </Typography>
            ) : (
                girl.premium && !isPremium && (
                    <Typography variant="body2" sx={{
                        color: '#f59e0b',
                        fontStyle: 'italic',
                        mt: -2,
                        mb: 2,
                        fontWeight: 500,
                        textAlign: 'center'
                    }}>
                        Necesitas una cuenta premium para hablar con esta chica
                    </Typography>
                )
            )}
        </Box>
    );
}