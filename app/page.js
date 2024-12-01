import React from 'react';
import Link from 'next/link';
import InstallAppButton from "@/app/components/sw/InstallAppButton";
import PopularCreators from "@/app/components/landing/PopularCreators";
import {
    Container,
    Box,
    Typography,
    IconButton,
    InputAdornment,
    TextField,
    Button,
    Card,
    Grid,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatPreview from '@/app/components/landing/ChatPreview';
import EnhancedAIFeaturesCard from "@/app/components/landing/EnhancedAIFeaturesCard";
import VerifiedIcon from "@mui/icons-material/Verified";
import CakeIcon from "@mui/icons-material/Cake";
import SendIcon from '@mui/icons-material/Send';

const GlassCard = ({ children }) => (
    <Card
        sx={{
            textAlign: 'center',
            color: 'white',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 5,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
            padding: 1,
            marginBottom: 4,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            msUserSelect: 'none',
        }}
    >
        {children}
    </Card>
);

const Home = () => {
    const users = [
        {
            name: 'ArelyDiaz3',
            profilePicture: '/profileTwo.jpg',
            profileLink: '/novia-virtual',
        },
        {
            name: 'MariaLopez',
            profilePicture: '/user2.jpg',
            profileLink: '/maria-lopez',
        },
        {
            name: 'SofiaGarcia',
            profilePicture: '/user3.jpg',
            profileLink: '/sofia-garcia',
        },
        {
            name: 'LuciaMartinez',
            profilePicture: '/user4.jpg',
            profileLink: '/lucia-martinez',
        },
        {
            name: 'CamilaRodriguez',
            profilePicture: '/user5.jpg',
            profileLink: '/camila-rodriguez',
        },
        {
            name: 'ValentinaHernandez',
            profilePicture: '/user6.jpg',
            profileLink: '/valentina-hernandez',
        },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: 2,
            }}
        >
            <Container maxWidth="lg">

                {/* Download App Section */}
                {/*<GlassCard>*/}
                {/*    <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>*/}
                {/*        Descarga la Aplicación*/}
                {/*    </Typography>*/}
                {/*    <InstallAppButton />*/}
                {/*</GlassCard>*/}

                {/* Company Stats Section */}
                <GlassCard>
                    <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                        La app de más rápido crecimiento para hispanohablantes en Latinoamérica y Estados Unidos
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={4}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <PeopleIcon sx={{ fontSize: 80, color: '#4FC3F7' }} />
                                <Typography variant="h4" fontWeight="bold">
                                    2M+
                                </Typography>
                                <Typography variant="h6">
                                    Usuarios satisfechos
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <CalendarTodayIcon sx={{ fontSize: 80, color: '#4FC3F7' }} />
                                <Typography variant="h4" fontWeight="bold">
                                    Desde 2023
                                </Typography>
                                <Typography variant="h6">
                                    Ofreciendo compañía virtual
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <ThumbUpIcon sx={{ fontSize: 80, color: '#4FC3F7' }} />
                                <Typography variant="h4" fontWeight="bold">
                                    93%
                                </Typography>
                                <Typography variant="h6">
                                    Tasa de satisfacción
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </GlassCard>
                <PopularCreators />
                {/* Enhanced AI Features Section */}
                <EnhancedAIFeaturesCard />

                {/* Chat Preview Section */}
                <GlassCard>
                    <Typography variant="h4" gutterBottom align="center">
                        Ejemplo de Conversación
                    </Typography>

                    <ChatPreview />

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mt: 2,
                        }}
                    >
                        <TextField
                            fullWidth
                            disabled
                            variant="outlined"
                            placeholder="Escribe tu mensaje..."
                            sx={{
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
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            sx={{
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                },
                                            }}
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </GlassCard>

                {/* Footer Section */}
                <GlassCard>
                    <img
                        src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/Untitled+design+(3).png"
                        alt="logo"
                        style={{ width: 45, height: 'auto', marginBottom: 1 }}
                    />
                    <Typography sx={{ color: 'white', fontSize: '20px' }}>
                        © 2024 - Todos los Derechos Reservados NoviaChat.
                    </Typography>
                </GlassCard>
            </Container>
        </Box>
    );
};

export default Home;
