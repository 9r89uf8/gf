import React from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    Typography,
} from '@mui/material';
import Link from 'next/link';
import NavbarClient from './NavbarClient';

const Navbar = () => {
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
                    <Link href="/" passHref style={{ textDecoration: 'none' }}>
                        <Typography
                            variant="h6"
                            sx={{
                                background: 'linear-gradient(45deg, #e9f5db, #fffcf2)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontFamily: "'Montserrat', sans-serif",
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                letterSpacing: '0.15em',
                                marginLeft: '7px',
                                fontSize: 22
                            }}
                        >
                            NoviaChat
                        </Typography>
                    </Link>
                </Box>

                <NavbarClient />
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

