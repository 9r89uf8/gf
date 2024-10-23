'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from "@/app/components/nab/MessageIcon";
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { alpha, styled } from '@mui/material/styles';

const NAVBAR_HEIGHT = '64px'; // Adjusted to match the top bar height

const StyledBottomNavigationAction = styled(BottomNavigationAction)(({ theme }) => ({
    '.MuiBottomNavigationAction-root': {
        maxWidth: 'none',
    },
    '.MuiBottomNavigationAction-label': {
        display: 'none',
    },
    '& .Mui-selected': {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: 'rgba(255, 255, 255, 0.7)', // Slightly transparent white for icons
    '&.Mui-selected': {
        color: 'rgba(255, 255, 255, 1)', // Fully opaque white for selected icons
    },
}));

const FloatingBottomNavigation = styled(BottomNavigation)`
    position: fixed;
    bottom: 16px;
    left: 16px;
    right: 16px;
    z-index: 999;
    border-radius: 8px;
    background: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px 0 rgba(255, 255, 255, 0.16);
    height: ${NAVBAR_HEIGHT};
    max-width: 1200px;
    margin: 0 auto;
`;

export default function FloatingNavbar() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        document.documentElement.style.setProperty('--floating-navbar-height', NAVBAR_HEIGHT);
        return () => {
            document.documentElement.style.removeProperty('--floating-navbar-height');
        };
    }, []);

    const routes = [
        { name: 'HOME', path: '/posts', icon: <VideoLibraryIcon fontSize='large' /> },
        { name: 'TOP', path: '/dm', icon: <MessageIcon /> },
        { name: 'USER', path: '/premium', icon: <AccountCircleIcon fontSize='large' /> }
    ];

    return (
        <FloatingBottomNavigation
            value={pathname}
            onChange={(event, newValue) => {
                router.push(newValue);
            }}
        >
            {routes.map((route, index) => (
                <StyledBottomNavigationAction
                    key={index}
                    label={route.name}
                    value={route.path}
                    icon={route.icon}
                />
            ))}
        </FloatingBottomNavigation>
    );
}

