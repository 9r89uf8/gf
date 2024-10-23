// PopularCreators.js
'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/app/store/store';
import { getGirls } from '@/app/services/girlsService';
import VerifiedIcon from "@/app/components/landing/VerifiedIcon";
import Link from 'next/link';
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    Grid,
    Skeleton,
} from '@mui/material';
import CakeIcon from "@mui/icons-material/Cake";

const PopularCreators = () => {
    const girls = useStore((state) => state.girls);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [visibleUsersCount, setVisibleUsersCount] = useState(4);

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

    const limitedUsers = filteredUsers.slice(0, visibleUsersCount);

    return (
        <>
            {/* Search Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <TextField
                    placeholder="Buscar creadoras..."
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
                {(loading ? Array.from(new Array(visibleUsersCount)) : limitedUsers).map((user, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                textAlign: 'center',
                                marginBottom: 4,
                                color: 'white',
                                background: 'linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 5,
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.10)',
                                padding: 3,
                            }}
                        >
                            {loading ? (
                                <>
                                    <Skeleton variant="circular" width={150} height={150} sx={{ margin: '0 auto' }} />
                                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', mt: 2 }} />
                                    <Skeleton variant="text" sx={{ fontSize: '1rem', mt: 1 }} />
                                    <Skeleton variant="rectangular" height={48} sx={{ mt: 2, borderRadius: '25px' }} />
                                </>
                            ) : (
                                <>
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
                                        <Link href={`/${user.id}`} passHref legacyBehavior>
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
                                        </Typography>
                                        <VerifiedIcon/>
                                    </Box>
                                    <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                                        <Typography variant="h5">{user.bio}</Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="center" mt={2}>
                                        <Link href={`/${user.id}`} passHref legacyBehavior>
                                            <Button
                                                sx={{
                                                    background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)',
                                                    border: 0,
                                                    fontSize: 18,
                                                    borderRadius: 25,
                                                    marginRight: 4,
                                                    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .1)',
                                                    color: 'black',
                                                    height: 48,
                                                    padding: '0 15px',
                                                    fontWeight: 'bold',
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
                                                    },
                                                }}
                                            >
                                                Fotos
                                            </Button>
                                        </Link>
                                        <Link href={`/chat/${user.id}`} passHref legacyBehavior>
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
                                    </Box>
                                </>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* "More" Button */}
            {filteredUsers.length > visibleUsersCount && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        variant="contained"
                        onClick={() => setVisibleUsersCount(visibleUsersCount + 4)}
                        sx={{
                            background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)',
                            marginTop: -2,
                            borderRadius: 25,
                            marginBottom: 10,
                            padding: '10px 30px',
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: 'black',
                            textTransform: 'none',
                            boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .2)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #FFAE53 30%, #FE8B8B 90%)',
                            },
                        }}
                    >
                        More
                    </Button>
                </Box>
            )}
        </>
    );
};

export default PopularCreators;



