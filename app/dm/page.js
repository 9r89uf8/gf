// PopularCreators.js
'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/app/store/store';
import { getGirls } from '@/app/services/girlsService';
import Link from 'next/link';
import {
    Box,
    TextField,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Button,
    Snackbar,
    Alert,
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';

const DMList = () => {
    const girls = useStore((state) => state.girls);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar

    useEffect(() => {
        async function fetchGirls() {
            await getGirls(); // Fetch and update the store
            setLoading(false);
        }
        fetchGirls();
    }, []);

    const filteredUsers = girls.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {/* Search Bar */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <TextField
                        placeholder="Buscar creadores..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            width: '100%',
                            maxWidth: '300px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '25px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                            },
                            '& .MuiOutlinedInput-input': {
                                color: 'white',
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                            },
                        }}
                    />
                </Box>

            {/* Users List */}
                <List>
                    {filteredUsers.map((user, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                backgroundColor: 'transparent',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                mb: 2,
                            }}
                        >
                            <ListItemAvatar>
                                <Link href={`/${user.id}`} passHref legacyBehavior>
                                    <Avatar
                                        src={`https://d3sog3sqr61u3b.cloudfront.net/${user.picture}`}
                                        alt={user.username}
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            cursor: 'pointer',
                                        }}
                                    />
                                </Link>
                            </ListItemAvatar>
                            <ListItemText
                                primary={user.username}
                                sx={{ color: 'white', padding: 1 }}
                                primaryTypographyProps={{ fontSize: '1.5rem' }} // Increased font size
                            />
                            {user.private ? (
                                <Button
                                    sx={{
                                        background: 'linear-gradient(45deg, #212529 30%, #343a40 90%)',
                                        border: 0,
                                        fontSize: 18,
                                        borderRadius: 25,
                                        boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .1)',
                                        color: 'white',
                                        height: 48,
                                        padding: '0 15px',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #adb5bd 30%, #343a40 90%)',
                                        },
                                    }}
                                    onClick={() => setOpenSnackbar(true)} // Open Snackbar on click
                                >
                                    Privado
                                </Button>
                            ) : (
                                <Link href='/chat' passHref legacyBehavior>
                                    <Button
                                        sx={{
                                            background: 'linear-gradient(45deg, #0096c7 30%, #023e8a 90%)',
                                            border: 0,
                                            fontSize: 18,
                                            borderRadius: 25,
                                            boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .1)',
                                            color: 'white',
                                            height: 48,
                                            padding: '0 15px',
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
                                            },
                                        }}
                                    >
                                        Mensaje
                                    </Button>
                                </Link>
                            )}
                        </ListItem>
                    ))}
                </List>

                {/* Snackbar to display the message */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setOpenSnackbar(false)}
                        severity="info"
                        sx={{ width: '100%' }}
                    >
                        La chica ha configurado su cuenta como privada y no puede recibir mensajes.
                    </Alert>
                </Snackbar>
        </>
    );
};

export default DMList;



