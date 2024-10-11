// PopularCreators.js
'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/app/store/store';
import { getGirls } from '@/app/services/girlsService';
import Link from 'next/link';
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    Grid,
    CircularProgress,
} from '@mui/material';
import VerifiedIcon from "@mui/icons-material/Verified";
import CakeIcon from "@mui/icons-material/Cake";

const PopularCreators = () => {
    const girls = useStore((state) => state.girls);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

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
                        maxWidth: '500px',
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
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
                Creadoras Populares
            </Typography>
            <Grid container spacing={4}>
                {filteredUsers.map((user, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                textAlign: 'center',
                                color: 'white',
                                background: 'linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 5,
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.10)',
                                padding: 3,
                            }}
                        >
                            {/* User Card */}
                            <Box
                                sx={{
                                    borderRadius: '50%',
                                    width: { xs: 150, md: 200 },
                                    height: { xs: 150, md: 200 },
                                    overflow: 'hidden',
                                    border: '4px solid rgba(255, 255, 255, 0.5)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                    margin: '0 auto',
                                }}
                            >
                                <Link href={user.id} passHref legacyBehavior>
                                    <img
                                        src={`https://d3sog3sqr61u3b.cloudfront.net/${user.picture}`}
                                        alt={user.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Link>
                            </Box>
                            <Box display="flex" justifyContent="center">
                                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: 'white', marginTop: 1 }}>
                                    {user.username}
                                    <VerifiedIcon
                                        sx={{ ml: 1, verticalAlign: 'middle', color: '#4FC3F7', fontSize: 36 }}
                                    />
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                                <CakeIcon sx={{ mr: 1, fontSize: 36 }} />
                                <Typography variant="h5">{user.age}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="center" mt={2}>
                                <Link href={user.id} passHref legacyBehavior>
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
                                        Ver Perfil
                                    </Button>
                                </Link>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default PopularCreators;

