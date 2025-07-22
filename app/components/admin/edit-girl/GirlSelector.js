'use client';
import React, { useState } from 'react';
import {
    Grid,
    TextField,
    InputAdornment,
    Typography,
    Box,
    Chip,
    Avatar,
    IconButton,
    CircularProgress,
    Alert,
    Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import LockIcon from '@mui/icons-material/Lock';
import GroupIcon from '@mui/icons-material/Group';

const GirlCard = styled(ModernCard)(({ theme }) => ({
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    height: '100%',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    },
}));

const ProfileImage = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    border: '3px solid rgba(255, 255, 255, 0.9)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
}));

const StatusChip = styled(Chip)(({ theme, variant }) => ({
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 24,
    ...(variant === 'premium' && {
        backgroundColor: '#FFD700',
        color: '#000000',
    }),
    ...(variant === 'private' && {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        color: '#ffffff',
    }),
}));

export default function GirlSelector({ girls, onSelectGirl, loading, error }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, premium, private, regular

    const filteredGirls = girls.filter(girl => {
        // Search filter
        const matchesSearch = girl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            girl.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            girl.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

        // Type filter
        let matchesType = true;
        if (filterType === 'premium') matchesType = girl.premium && !girl.private;
        if (filterType === 'private') matchesType = girl.private;
        if (filterType === 'regular') matchesType = !girl.premium && !girl.private;

        return matchesSearch && matchesType;
    });

    const formatFollowerCount = (count) => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
        }
        return count.toString();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
                <CircularProgress size={60} sx={{ color: 'rgba(15, 23, 42, 0.6)' }} />
            </Box>
        );
    }

    return (
        <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            {/* Search and Filter Bar */}
            <ModernCard variant="flat">
                <CardContentWrapper>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                placeholder="Search by name or username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'rgba(71, 85, 105, 0.6)' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 25,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Chip
                                    label="All"
                                    onClick={() => setFilterType('all')}
                                    variant={filterType === 'all' ? 'filled' : 'outlined'}
                                    sx={{
                                        backgroundColor: filterType === 'all' ? 'rgba(15, 23, 42, 0.9)' : 'transparent',
                                        color: filterType === 'all' ? '#ffffff' : 'rgba(15, 23, 42, 0.7)',
                                        borderColor: 'rgba(15, 23, 42, 0.2)',
                                    }}
                                />
                                <Chip
                                    label="Regular"
                                    onClick={() => setFilterType('regular')}
                                    variant={filterType === 'regular' ? 'filled' : 'outlined'}
                                    sx={{
                                        backgroundColor: filterType === 'regular' ? 'rgba(15, 23, 42, 0.9)' : 'transparent',
                                        color: filterType === 'regular' ? '#ffffff' : 'rgba(15, 23, 42, 0.7)',
                                        borderColor: 'rgba(15, 23, 42, 0.2)',
                                    }}
                                />
                                <Chip
                                    icon={<StarIcon sx={{ fontSize: 16 }} />}
                                    label="Premium"
                                    onClick={() => setFilterType('premium')}
                                    variant={filterType === 'premium' ? 'filled' : 'outlined'}
                                    sx={{
                                        backgroundColor: filterType === 'premium' ? '#FFD700' : 'transparent',
                                        color: filterType === 'premium' ? '#000000' : '#FFD700',
                                        borderColor: '#FFD700',
                                    }}
                                />
                                <Chip
                                    icon={<LockIcon sx={{ fontSize: 16 }} />}
                                    label="Private"
                                    onClick={() => setFilterType('private')}
                                    variant={filterType === 'private' ? 'filled' : 'outlined'}
                                    sx={{
                                        backgroundColor: filterType === 'private' ? 'rgba(15, 23, 42, 0.9)' : 'transparent',
                                        color: filterType === 'private' ? '#ffffff' : 'rgba(15, 23, 42, 0.7)',
                                        borderColor: 'rgba(15, 23, 42, 0.2)',
                                    }}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContentWrapper>
            </ModernCard>

            {/* Results Count */}
            <Typography variant="body2" color="text.secondary">
                {filteredGirls.length} girl{filteredGirls.length !== 1 ? 's' : ''} found
            </Typography>

            {/* Girls Grid */}
            <Grid container spacing={3}>
                {filteredGirls.map((girl) => (
                    <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={girl.id}>
                        <GirlCard onClick={() => onSelectGirl(girl.id)} variant="elevated">
                            <CardContentWrapper>
                                <Stack spacing={2} alignItems="center">
                                    {/* Profile Image */}
                                    <ProfileImage
                                        src={girl.pictureUrl}
                                        alt={girl.name}
                                    />

                                    {/* Name and Username */}
                                    <Box textAlign="center">
                                        <Typography variant="h6" sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 700 }}>
                                            {girl.fullName || girl.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                                            @{girl.username}
                                        </Typography>
                                    </Box>

                                    {/* Status Chips */}
                                    <Stack direction="row" spacing={1}>
                                        {girl.private && (
                                            <StatusChip
                                                icon={<LockIcon sx={{ fontSize: 14 }} />}
                                                label="Private"
                                                variant="private"
                                                size="small"
                                            />
                                        )}
                                        {girl.premium && !girl.private && (
                                            <StatusChip
                                                icon={<StarIcon sx={{ fontSize: 14 }} />}
                                                label="Premium"
                                                variant="premium"
                                                size="small"
                                            />
                                        )}
                                    </Stack>

                                    {/* Stats */}
                                    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                                        <Box sx={{ flex: 1, textAlign: 'center' }}>
                                            <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
                                                <GroupIcon sx={{ fontSize: 16, color: 'rgba(71, 85, 105, 0.6)' }} />
                                                <Typography variant="body2" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                                                    {formatFollowerCount(girl.followersCount || 0)}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="caption" sx={{ color: 'rgba(71, 85, 105, 0.6)' }}>
                                                Followers
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: 1, textAlign: 'center' }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                                                {girl.age || '-'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(71, 85, 105, 0.6)' }}>
                                                Age
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    {/* Edit Button */}
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    >
                                        <EditIcon sx={{ fontSize: 20, color: 'rgba(15, 23, 42, 0.7)' }} />
                                    </IconButton>
                                </Stack>
                            </CardContentWrapper>
                        </GirlCard>
                    </Grid>
                ))}
            </Grid>

            {filteredGirls.length === 0 && (
                <Box textAlign="center" py={8}>
                    <Typography variant="h6" color="text.secondary">
                        No girls found matching your criteria
                    </Typography>
                </Box>
            )}
        </Stack>
    );
}