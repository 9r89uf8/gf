'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Updated imports for Next.js router
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { alpha } from '@mui/system';
import HomeIcon from '@mui/icons-material/Home';
import { styled } from '@mui/material/styles';
import { useStore } from '@/app/store/store'; // Using Zustand

// Custom styling to hide the labels
const StyledBottomNavigationAction = styled(BottomNavigationAction)(({ theme }) => ({
    '.MuiBottomNavigationAction-root': {
        maxWidth: 'none', // Overrides the max-width for both selected and unselected states
    },
    '.MuiBottomNavigationAction-label': {
        display: 'none', // Hides the label
    },
    '& .Mui-selected': {
        paddingTop: theme.spacing(1), // Adjust this value as needed for centering
        paddingBottom: theme.spacing(1), // Adjust this value as needed for centering
    },
    paddingTop: theme.spacing(1), // Adjust this value as needed for centering
    paddingBottom: theme.spacing(1) // Adjust this value as needed for centering
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
  backdropFilter: blur(10px);
  border: 1px solid ${alpha('#ffffff', 0.2)};
  padding: 1px 10px;
  margin: 5px;
`;

export default function FloatingNavbar() {
    const router = useRouter();
    const pathname = usePathname();
    const userCart = useStore((state) => state.cart); // Using Zustand store

    const routes = [
        { name: 'HOME', path: '/quinielas', icon: <HomeIcon fontSize='large' /> },
        { name: 'ADD', path: userCart && userCart.length > 0 ? '/cart' : '/buy', icon: <AddCircleIcon fontSize='large' /> },
        { name: 'TOP', path: '/quinielas/dashboard', icon: <MonetizationOnIcon fontSize='large' /> },
        { name: 'USER', path: '/quinielas/user', icon: <AccountCircleIcon fontSize='large' /> }
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

