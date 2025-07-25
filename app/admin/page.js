'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import { useStore } from '@/app/store/store';
import { getGirls } from '@/app/services/girlsService';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import ArticleIcon from '@mui/icons-material/Article';
import CollectionsIcon from '@mui/icons-material/Collections';
import PersonIcon from '@mui/icons-material/Person';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import ChatIcon from '@mui/icons-material/Chat';
import BookIcon from '@mui/icons-material/Book';

const DashboardCard = styled(ModernCard)(({ theme }) => ({
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    height: '100%',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
    },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    width: 80,
    height: 80,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
    color: '#ffffff',
    marginBottom: theme.spacing(2),
}));

const StatBox = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(1),
    borderRadius: 12,
    background: 'rgba(15, 23, 42, 0.05)',
}));

export default function AdminDashboard() {
    const router = useRouter();
    const girls = useStore((state) => state.girls);
    const [stats, setStats] = useState({
        totalGirls: 0,
        premiumGirls: 0,
        privateGirls: 0,
        totalPosts: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch girls if not already loaded
            if (girls.length === 0) {
                await getGirls();
            }

            const girlsData = useStore.getState().girls;
            
            setStats({
                totalGirls: girlsData.length,
                premiumGirls: girlsData.filter(g => g.premium && !g.private).length,
                privateGirls: girlsData.filter(g => g.private).length,
                totalPosts: 0, // You can add post count logic here if needed
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const navigationItems = [
        {
            title: 'Create Girl',
            description: 'Add a new AI girlfriend to the platform',
            icon: <AddCircleIcon sx={{ fontSize: 40 }} />,
            path: '/admin/create-girl',
            stats: null,
            color: '#4CAF50',
        },
        {
            title: 'Edit Girls',
            description: 'Modify existing AI girlfriends',
            icon: <EditIcon sx={{ fontSize: 40 }} />,
            path: '/admin/edit-girl',
            stats: {
                label: 'Total Girls',
                value: stats.totalGirls,
                icon: <GroupIcon sx={{ fontSize: 16 }} />,
            },
            color: '#2196F3',
        },
        {
            title: 'Manage Posts',
            description: 'Create and manage girl posts',
            icon: <ArticleIcon sx={{ fontSize: 40 }} />,
            path: '/admin/posts',
            stats: {
                label: 'Premium',
                value: stats.premiumGirls,
                icon: <StarIcon sx={{ fontSize: 16, color: '#FFD700' }} />,
            },
            color: '#FF9800',
        },
        {
            title: 'Gallery',
            description: 'Manage photos and videos',
            icon: <CollectionsIcon sx={{ fontSize: 40 }} />,
            path: '/admin/gallery',
            stats: {
                label: 'Private',
                value: stats.privateGirls,
                icon: <PhotoLibraryIcon sx={{ fontSize: 16 }} />,
            },
            color: '#9C27B0',
        },
        {
            title: 'View Conversations',
            description: 'View recent user conversations',
            icon: <ChatIcon sx={{ fontSize: 40 }} />,
            path: '/admin/conversations',
            stats: {
                label: 'Recent',
                value: '10',
                icon: <ChatIcon sx={{ fontSize: 16 }} />,
            },
            color: '#00BCD4',
        },
        {
            title: 'Manage Blog',
            description: 'Create and manage blog articles',
            icon: <BookIcon sx={{ fontSize: 40 }} />,
            path: '/admin/blog',
            stats: null,
            color: '#E91E63',
        },
    ];


    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
                py: { xs: 2, sm: 3, md: 4 }
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{
                            color: 'rgba(15, 23, 42, 0.95)',
                            fontWeight: 700,
                            mb: 1,
                        }}
                    >
                        Admin Dashboard
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(71, 85, 105, 0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 20 }} />
                        Welcome, Admin
                    </Typography>
                </Box>

                {/* Navigation Cards */}
                <Grid container spacing={3}>
                    {navigationItems.map((item, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 6 }} key={index}>
                            <DashboardCard
                                variant="elevated"
                                onClick={() => router.push(item.path)}
                            >
                                <CardContentWrapper>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                        <IconWrapper
                                            sx={{
                                                background: `linear-gradient(135deg, ${item.color}20 0%, ${item.color}40 100%)`,
                                                color: item.color,
                                            }}
                                        >
                                            {item.icon}
                                        </IconWrapper>
                                        
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: 'rgba(15, 23, 42, 0.95)',
                                                fontWeight: 700,
                                                mb: 1,
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                        
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'rgba(71, 85, 105, 0.8)',
                                                mb: 3,
                                            }}
                                        >
                                            {item.description}
                                        </Typography>

                                        {item.stats && (
                                            <StatBox>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                                                    {item.stats.icon}
                                                    <Typography variant="h4" sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 700 }}>
                                                        {item.stats.value}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="caption" sx={{ color: 'rgba(71, 85, 105, 0.6)' }}>
                                                    {item.stats.label}
                                                </Typography>
                                            </StatBox>
                                        )}
                                    </Box>
                                </CardContentWrapper>
                            </DashboardCard>
                        </Grid>
                    ))}
                </Grid>

                {/* Quick Stats Summary */}
                <ModernCard variant="flat" sx={{ mt: 4 }}>
                    <CardContentWrapper>
                        <Typography variant="h6" sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 700, mb: 2 }}>
                            Platform Overview
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <StatBox>
                                    <Typography variant="h5" sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 700 }}>
                                        {stats.totalGirls}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(71, 85, 105, 0.6)' }}>
                                        Total Girls
                                    </Typography>
                                </StatBox>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <StatBox>
                                    <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 700 }}>
                                        {stats.premiumGirls}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(71, 85, 105, 0.6)' }}>
                                        Premium Girls
                                    </Typography>
                                </StatBox>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <StatBox>
                                    <Typography variant="h5" sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 700 }}>
                                        {stats.privateGirls}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(71, 85, 105, 0.6)' }}>
                                        Private Girls
                                    </Typography>
                                </StatBox>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <StatBox>
                                    <Typography variant="h5" sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 700 }}>
                                        {stats.totalGirls - stats.premiumGirls - stats.privateGirls}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(71, 85, 105, 0.6)' }}>
                                        Regular Girls
                                    </Typography>
                                </StatBox>
                            </Grid>
                        </Grid>
                    </CardContentWrapper>
                </ModernCard>
            </Container>
        </Box>
    );
}