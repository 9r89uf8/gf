'use client';
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import DehazeIcon from '@mui/icons-material/Dehaze';
import { AccountCircle } from '@mui/icons-material';
import { useStore } from '@/app/store/store';
import { logoutUser } from "@/app/services/authService";

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

    const handleRegister = () => {
        handleMenuClose();
        router.push('/register');
    };

    const handleSignOut = async () => {
        await logoutUser();
        handleMenuClose();
        router.push('/login');
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
                overflow: 'visible', // Allow content to overflow
            }}
        >
            <Toolbar sx={{ minHeight: '64px', position: 'relative' }}> {/* Adjust minHeight as needed */}
                <Box display="flex" alignItems="center" flexGrow={1} sx={{ position: 'relative' }}>
                    <Box
                        component="img"
                        src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/Untitled+design+(3).png"
                        alt="logo"
                        sx={{
                            width: '80px', // Increased size
                            height: 'auto',
                            marginRight: 2,
                            position: 'absolute',
                            left: '-10px', // Adjust to make it overflow to the left
                            top: '-10px', // Adjust to make it overflow to the top
                            zIndex: 1, // Ensure logo is above other elements
                        }}
                    />
                    <Button color="inherit" onClick={() => router.push('/')} sx={{ marginLeft: '70px', fontSize: 22 }}> {/* Adjust marginLeft to accommodate larger logo */}
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
                        <DehazeIcon sx={{ fontSize: 40 }}/>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        {user ? (
                            <>
                                {user && user.uid === 'hRZgS7woczXIruLyLjWu9axjPbo2' && (
                                    <>
                                        <MenuItem onClick={handlePicture}>Add Pictures</MenuItem>
                                        <MenuItem onClick={handlePosts}>Add Posts</MenuItem>
                                        <MenuItem onClick={handleUpdate}>Update Girl</MenuItem>
                                    </>
                                )}
                                <MenuItem onClick={handleSignOut}>Salir</MenuItem>
                            </>
                        ) : (
                            [
                                <MenuItem key="login" onClick={handleLogin}>
                                    Entrar a mi cuenta
                                </MenuItem>,
                                <MenuItem key="register" onClick={handleRegister}>
                                    Crear Cuenta
                                </MenuItem>,
                            ]
                        )}
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

