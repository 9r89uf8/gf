'use client';
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import DehazeIcon from '@mui/icons-material/Dehaze';
import HomeIcon from '@mui/icons-material/Home';
import { useStore } from '@/app/store/store';
import { logoutUser } from "@/app/services/authService";
import { styled } from '@mui/material/styles';

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.9) 100%)',
    color: theme.palette.common.white,
    borderRadius: '4px',
    margin: '10px',
    padding: '8px 16px',
    width: 'auto',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    '&:hover': {
        background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,1) 100%)',
    },
}));

const Navbar = () => {
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
                    <MenuItem key="manageGirls" onClick={handleManage}>Manage Girls</MenuItem>
                );
            }
            items.push(
                <StyledMenuItem key="salir" onClick={handleSignOut} sx={{ fontSize: 24 }}>
                    cerrar sesión
                </StyledMenuItem>
            );
            return items;
        } else {
            return [
                <StyledMenuItem
                    key="home"
                    onClick={handleHome}
                    sx={{
                        background: 'transparent',
                        '&:hover': { background: 'transparent' },
                    }}
                >
                    <HomeIcon sx={{ fontSize: 45, color: '#343a40', margin: -2 }} />
                </StyledMenuItem>,
                <StyledMenuItem key="login" onClick={handleLogin} sx={{ fontSize: 24 }}>
                    Entrar a mi cuenta
                </StyledMenuItem>,
                <StyledMenuItem key="register" onClick={handleRegister} sx={{ fontSize: 24 }}>
                    Crear Cuenta
                </StyledMenuItem>,
            ];
        }
    };

    return (
        <AppBar
            position="relative"
            sx={{
                background: 'linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)',
                backdropFilter: 'blur(10px)',
                margin: '16px auto',
                borderRadius: '8px',
                boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.16)',
                width: 'calc(100% - 32px)',
                maxWidth: '1200px',
                overflow: 'visible',
            }}
        >
            <Toolbar sx={{ minHeight: '64px', position: 'relative' }}>
                <Box display="flex" alignItems="center" flexGrow={1} sx={{ position: 'relative' }}>
                    <Box
                        component="img"
                        src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/Untitled+design+(3).png"
                        alt="logo"
                        sx={{
                            width: '80px',
                            height: 'auto',
                            marginRight: 2,
                            position: 'absolute',
                            left: '-10px',
                            top: '-10px',
                            zIndex: 1,
                        }}
                    />
                    <Button color="inherit" onClick={() => router.push('/')} sx={{ marginLeft: '70px', fontSize: 22 }}>
                        NoviaChat
                    </Button>
                </Box>

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
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
