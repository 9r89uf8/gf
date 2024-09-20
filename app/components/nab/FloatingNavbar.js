'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { alpha, styled } from '@mui/material/styles';

const NAVBAR_HEIGHT = '50px'; // Adjust this value based on your navbar's actual height

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
    paddingBottom: theme.spacing(1)
}));

const FloatingBottomNavigation = styled(BottomNavigation)`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    border-radius: 10px 10px 0 0;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid ${alpha('#ffffff', 0.2)};
    padding: 1px 10px;
    margin: 5px;
    height: ${NAVBAR_HEIGHT};
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
        { name: 'HOME', path: '/novia-virtual', icon: <HomeIcon fontSize='large' /> },
        { name: 'TOP', path: '/chat', icon: <ChatIcon fontSize='large' /> },
        { name: 'USER', path: '/user', icon: <AccountCircleIcon fontSize='large' /> }
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

