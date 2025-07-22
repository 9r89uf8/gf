'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import ArticleIcon from '@mui/icons-material/Article';
import CollectionsIcon from '@mui/icons-material/Collections';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';

const NavButton = styled(Button)(({ theme, active }) => ({
    borderRadius: 25,
    padding: theme.spacing(1, 3),
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    ...(active ? {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
        color: '#ffffff',
        '&:hover': {
            background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
        },
    } : {
        background: 'transparent',
        color: 'rgba(15, 23, 42, 0.7)',
        border: '2px solid rgba(15, 23, 42, 0.2)',
        '&:hover': {
            background: 'rgba(15, 23, 42, 0.05)',
            borderColor: 'rgba(15, 23, 42, 0.3)',
        },
    }),
}));

const NavigationWrapper = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    padding: theme.spacing(2),
    borderRadius: 25,
    border: '1px solid rgba(15, 23, 42, 0.1)',
    marginBottom: theme.spacing(3),
}));

export default function AdminNavigation({ variant = 'horizontal' }) {
    const router = useRouter();
    const pathname = usePathname();

    const navigationItems = [
        {
            label: 'Dashboard',
            path: '/admin',
            icon: <DashboardIcon sx={{ fontSize: 20, mr: 1 }} />,
        },
        {
            label: 'Create Girl',
            path: '/admin/create-girl',
            icon: <AddCircleIcon sx={{ fontSize: 20, mr: 1 }} />,
        },
        {
            label: 'Edit Girls',
            path: '/admin/edit-girl',
            icon: <EditIcon sx={{ fontSize: 20, mr: 1 }} />,
        },
        {
            label: 'Posts',
            path: '/admin/posts',
            icon: <ArticleIcon sx={{ fontSize: 20, mr: 1 }} />,
        },
        {
            label: 'Gallery',
            path: '/admin/gallery',
            icon: <CollectionsIcon sx={{ fontSize: 20, mr: 1 }} />,
        },
        {
            label: 'Blog',
            path: '/admin/blog',
            icon: <BookIcon sx={{ fontSize: 20, mr: 1 }} />,
        },
    ];

    const isActive = (path) => {
        if (path === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(path);
    };

    if (variant === 'vertical') {
        return (
            <NavigationWrapper>
                <Stack spacing={1}>
                    {navigationItems.map((item) => (
                        <NavButton
                            key={item.path}
                            fullWidth
                            active={isActive(item.path) ? 1 : 0}
                            onClick={() => router.push(item.path)}
                            startIcon={item.icon}
                            sx={{ justifyContent: 'flex-start' }}
                        >
                            {item.label}
                        </NavButton>
                    ))}
                </Stack>
            </NavigationWrapper>
        );
    }

    return (
        <NavigationWrapper>
            <Stack 
                direction="row" 
                spacing={1} 
                sx={{ 
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                        height: 6,
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'rgba(15, 23, 42, 0.05)',
                        borderRadius: 3,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(15, 23, 42, 0.2)',
                        borderRadius: 3,
                        '&:hover': {
                            background: 'rgba(15, 23, 42, 0.3)',
                        },
                    },
                }}
            >
                {navigationItems.map((item) => (
                    <NavButton
                        key={item.path}
                        active={isActive(item.path) ? 1 : 0}
                        onClick={() => router.push(item.path)}
                        startIcon={item.icon}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        {item.label}
                    </NavButton>
                ))}
            </Stack>
        </NavigationWrapper>
    );
}