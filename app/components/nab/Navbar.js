'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import DehazeIcon from '@mui/icons-material/Dehaze';
import { AccountCircle } from '@mui/icons-material';
import { useStore } from '@/app/store/store'; // Ensure this path is correct according to your structure
import {logoutUser} from "@/app/services/authService"; // Ensure this path is correct according to your structure

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

    const handleRegister = () => {
        handleMenuClose();
        router.push('/register');
    };

    const handleSignOut = async () => {
        await logoutUser(); // Ensure logoutUser properly clears any session data on the server
        handleMenuClose();
        router.push('/login');
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#161a1d' }}>
            <Toolbar>
                <Box display="flex" alignItems="center" flexGrow={1}>
                    <img
                        src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/Quinielas+(2).png"
                        alt="logo"
                        style={{ width: 45, height: 'auto', marginRight: 4 }}
                    />
                    <Button color="inherit" onClick={() => router.push('/')}>GF</Button>
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
                        <DehazeIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        {user ? (
                            <MenuItem onClick={handleSignOut}>Salir</MenuItem>
                        ) : [
                            <MenuItem key="login" onClick={handleLogin}>Entrar a mi cuenta</MenuItem>,
                            <MenuItem key="register" onClick={handleRegister}>Crear Cuenta</MenuItem>
                        ]}
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

