import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MessageIcon from "@/app/components/nab/MessageIcon";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import GridViewIcon from '@mui/icons-material/GridView';
import GroupIcon from '@mui/icons-material/Group';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const NAVBAR_HEIGHT = '64px';

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
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
        color: 'rgba(255, 255, 255, 1)',
    },
    '& .MuiSvgIcon-root': {
        fontSize: '3.1rem',
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

const StyledPopover = styled(Popover)(({ theme }) => ({
    '& .MuiPaper-root': {
        background: 'linear-gradient(to right, #333333, #555555)',
        borderRadius: '12px',
        padding: theme.spacing(1),
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        maxWidth: 'none',
    },
}));

const StyledButton = styled(Button)(({ theme, gradient }) => ({
    flexDirection: 'column',
    alignItems: 'center',
    textTransform: 'none',
    color: '#fff',
    backgroundImage: gradient,
    borderRadius: '8px',
    minWidth: '30px',
    padding: '16px',
    // Ensure the icon sits below the text
    '& .MuiSvgIcon-root': {
        fontSize: '2.5rem',
        marginTop: theme.spacing(1),
    },
    '&:hover': {
        backgroundImage: gradient,
        filter: 'brightness(1.1)',
    },
}));

export default function FloatingNavbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        document.documentElement.style.setProperty('--floating-navbar-height', NAVBAR_HEIGHT);
        return () => {
            document.documentElement.style.removeProperty('--floating-navbar-height');
        };
    }, []);


    const routes = [
        { name: 'HOME', path: '/chicas-ia', icon: <GroupIcon fontSize='large' /> },
        { name: 'TOP', path: '/dm', icon: <MessageIcon /> },
        { name: 'USER', path: '/user', icon: <AccountCircleIcon /> }
    ];


    return (
        <>
            <FloatingBottomNavigation
                value={pathname}
                onChange={(event, newValue) => {
                    // Skip navigation when the account icon ("/premium") is clicked.
                    if (newValue) {
                        router.push(newValue);
                    }
                }}
            >
                {routes.map((route, index) => (
                    <StyledBottomNavigationAction
                        key={index}
                        label={route.name}
                        value={route.path}
                        icon={route.icon}
                        onClick={(event) => {
                            // If an onClick handler is defined (for the account icon), prevent default navigation.
                            if (route.onClick) {
                                event.preventDefault();
                                route.onClick(event);
                            }
                        }}
                    />
                ))}
            </FloatingBottomNavigation>
        </>
    );
}

