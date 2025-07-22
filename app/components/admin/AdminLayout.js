'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, Container, Breadcrumbs, Link, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const LayoutWrapper = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
}));

const HeaderBar = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(15, 23, 42, 0.1)',
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(3),
    position: 'sticky',
    top: 0,
    zIndex: 10,
}));

const StyledBreadcrumb = styled(Link)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    color: 'rgba(71, 85, 105, 0.8)',
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': {
        color: 'rgba(15, 23, 42, 0.95)',
    },
}));

export default function AdminLayout({ children, title }) {
    const router = useRouter();
    const pathname = usePathname();

    const getBreadcrumbs = () => {
        const paths = pathname.split('/').filter(Boolean);
        const breadcrumbs = [];

        // Always add home
        breadcrumbs.push({
            label: 'Home',
            href: '/',
            icon: <HomeIcon sx={{ fontSize: 20, mr: 0.5 }} />,
        });

        // Add admin dashboard
        if (paths[0] === 'admin') {
            breadcrumbs.push({
                label: 'Admin',
                href: '/admin',
                icon: <DashboardIcon sx={{ fontSize: 20, mr: 0.5 }} />,
            });

            // Add specific admin pages
            if (paths[1]) {
                const pageNames = {
                    'create-girl': 'Create Girl',
                    'edit-girl': 'Edit Girl',
                    'posts': 'Posts',
                    'gallery': 'Gallery',
                };

                breadcrumbs.push({
                    label: pageNames[paths[1]] || paths[1],
                    href: pathname,
                    icon: null,
                });
            }
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <LayoutWrapper>
            <HeaderBar>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Breadcrumbs
                            separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(71, 85, 105, 0.4)' }} />}
                            aria-label="breadcrumb"
                        >
                            {breadcrumbs.map((crumb, index) => {
                                const isLast = index === breadcrumbs.length - 1;
                                
                                if (isLast) {
                                    return (
                                        <Typography
                                            key={crumb.href}
                                            sx={{
                                                color: 'rgba(15, 23, 42, 0.95)',
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {crumb.icon}
                                            {crumb.label}
                                        </Typography>
                                    );
                                }

                                return (
                                    <StyledBreadcrumb
                                        key={crumb.href}
                                        onClick={() => router.push(crumb.href)}
                                    >
                                        {crumb.icon}
                                        {crumb.label}
                                    </StyledBreadcrumb>
                                );
                            })}
                        </Breadcrumbs>

                        <Typography variant="caption" sx={{ color: 'rgba(71, 85, 105, 0.6)' }}>
                            Admin Panel
                        </Typography>
                    </Box>
                </Container>
            </HeaderBar>

            <Container maxWidth="lg">
                {title && (
                    <Typography
                        variant="h3"
                        sx={{
                            color: 'rgba(15, 23, 42, 0.95)',
                            fontWeight: 700,
                            mb: 4,
                            textAlign: 'center'
                        }}
                    >
                        {title}
                    </Typography>
                )}
                {children}
            </Container>
        </LayoutWrapper>
    );
}