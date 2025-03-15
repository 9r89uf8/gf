'use client';
import React, { useState } from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    Box,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import DehazeIcon from '@mui/icons-material/Dehaze';
import HomeIcon from '@mui/icons-material/Home';
import { useStore } from '@/app/store/store';
import { logoutUser } from "@/app/services/authService";

const NavbarClient = ({ onLogoClick }) => {
    const router = useRouter();
    const user = useStore((state) => state.user);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        handleMenuClose();
        router.push('/login');
    };

    const handlePicture = () => {
        handleMenuClose();
        router.push('/admin/picture');
    };

    const handlePosts = () => {
        handleMenuClose();
        router.push('/admin/add');
    };

    const handleUpdate = () => {
        handleMenuClose();
        router.push('/admin/update');
    };

    const handleCreate = () => {
        handleMenuClose();
        router.push('/admin/girl');
    };

    const handleManage = () => {
        handleMenuClose();
        router.push('/admin/manage');
    };

    const handleArchived = () => {
        handleMenuClose();
        router.push('/admin/archived');
    };

    const handleTesting = () => {
        handleMenuClose();
        router.push('/admin/testing');
    };

    const handleRegister = () => {
        handleMenuClose();
        router.push('/register');
    };

    const handleHome = () => {
        handleMenuClose();
        router.push('/');
    };

    const handleSignOut = async () => {
        await logoutUser();
        handleMenuClose();
        router.push('/login');
    };

    const getMenuItems = () => {
        if (user) {
            const items = [];
            if (user.uid === '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
                items.push(
                    <MenuItem key="addPictures" onClick={handlePicture}>Add Pictures</MenuItem>,
                    <MenuItem key="addPosts" onClick={handlePosts}>Add Posts</MenuItem>,
                    <MenuItem key="updateGirl" onClick={handleUpdate}>Update Girl</MenuItem>,
                    <MenuItem key="createGirl" onClick={handleCreate}>Create Girl</MenuItem>,
                    <MenuItem key="manageGirls" onClick={handleManage}>Manage Girls</MenuItem>,
                    <MenuItem key="archived" onClick={handleArchived}>Archived</MenuItem>,
                    <MenuItem key="testing" onClick={handleTesting}>Testing</MenuItem>
                );
            }
            items.push(
                <MenuItem
                    key="home"
                    onClick={handleHome}
                    sx={{
                        background: 'transparent',
                        '&:hover': { background: 'transparent' },
                    }}
                >
                    <HomeIcon sx={{ fontSize: 45, color: '#343a40', margin: -2 }} />
                </MenuItem>,
                <MenuItem
                    key="salir"
                    onClick={handleSignOut}
                    sx={{
                        fontSize: 24,
                        background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.9) 100%)',
                        color: 'white',
                        borderRadius: '4px',
                        margin: '10px',
                        padding: '8px 16px',
                        width: 'auto',
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                            background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,1) 100%)',
                        },
                    }}
                >
                    cerrar sesión
                </MenuItem>
            );
            return items;
        } else {
            return [
                <MenuItem
                    key="home"
                    onClick={handleHome}
                    sx={{
                        background: 'transparent',
                        '&:hover': { background: 'transparent' },
                    }}
                >
                    <HomeIcon sx={{ fontSize: 45, color: '#343a40', margin: -2 }} />
                </MenuItem>,
                <MenuItem
                    key="login"
                    onClick={handleLogin}
                    sx={{
                        fontSize: 24,
                        background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.9) 100%)',
                        color: 'white',
                        borderRadius: '4px',
                        margin: '10px',
                        padding: '8px 16px',
                        width: 'auto',
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                            background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,1) 100%)',
                        },
                    }}
                >
                    Entrar a mi cuenta
                </MenuItem>,
                <MenuItem
                    key="register"
                    onClick={handleRegister}
                    sx={{
                        fontSize: 24,
                        background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.9) 100%)',
                        color: 'white',
                        borderRadius: '4px',
                        margin: '10px',
                        padding: '8px 16px',
                        width: 'auto',
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                            background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,1) 100%)',
                        },
                    }}
                >
                    Crear Cuenta
                </MenuItem>,
            ];
        }
    };

    return (
        <Box display="flex" alignItems="center">
            <div>
                <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                    color="inherit"
                >
                    <DehazeIcon sx={{ fontSize: 40 }} />
                </IconButton>
                <Menu
                    style={{ maxWidth: 300 }}
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        style: {
                            background: 'white',
                            boxShadow: 'none',
                        },
                    }}
                >
                    {getMenuItems()}
                </Menu>
            </div>
        </Box>
    );
};

export default NavbarClient;