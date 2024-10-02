import React from 'react';
import Link from 'next/link';
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
            padding: 3,
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
                {/* Introduction and Value Proposition */}
                <GlassCard>
                    <Grid container spacing={4} alignItems="center">
                        {/* Header Section */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h3" gutterBottom>
                                Conoce a tu compañera ideal
                            </Typography>
                            <Typography variant="h5" paragraph>
                                Experimenta una compañía como nunca antes. NoviaChat está aquí para chatear, entretenerte y acompañarte en cualquier momento y lugar.
                            </Typography>
                        </Grid>

                        {/* Image Section */}
                        <Grid item xs={12} md={6}>
                            <Box display="flex" justifyContent="center">
                                <Box
                                    sx={{
                                        borderRadius: '50%',
                                        width: { xs: 250, md: 350 },
                                        height: { xs: 250, md: 350 },
                                        overflow: 'hidden',
                                        border: '4px solid rgba(255, 255, 255, 0.5)',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    <Link href="/novia-virtual" passHref legacyBehavior>
                                        <img
                                            src="/profileTwo.jpg" // Replace with your AI girlfriend image
                                            alt="AI Girlfriend"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Link>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Profile Info Section */}
                        <Grid item xs={12} md={6}>
                            <Box>
                                <Box display="flex" justifyContent="center">
                                    <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: 'white' }}>
                                        ArelyDiaz3
                                        <VerifiedIcon
                                            sx={{ ml: 1, verticalAlign: 'middle', color: '#4FC3F7', fontSize: 36 }}
                                        />
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                                    <CakeIcon sx={{ mr: 1, fontSize: 36 }} />
                                    <Typography variant="h5">22 años</Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Action Buttons Section */}
                        <Grid item xs={12} md={6}>
                            <Box display="flex" justifyContent="center" gap={2}>
                                <Link href="/novia-virtual" passHref legacyBehavior>
                                    <Button
                                        sx={{
                                            background: 'linear-gradient(45deg, #06d6a0 30%, #118ab2 90%)',
                                            border: 0,
                                            borderRadius: 25,
                                            fontSize:30,
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
                                        Fotos
                                    </Button>
                                </Link>
                                <Link href="/chat" passHref legacyBehavior>
                                    <Button
                                        sx={{
                                            background: 'linear-gradient(45deg, #0096c7 30%, #023e8a 90%)',
                                            border: 0,
                                            fontSize:30,
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
                        </Grid>
                    </Grid>
                </GlassCard>

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


                <EnhancedAIFeaturesCard/>

                {/* Brief Demo or Preview */}
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

                <GlassCard>
                    <img src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/Untitled+design+(3).png" alt="logo" style={{width: 45, height: "auto", marginBottom: 1}}/>
                    <Typography sx={{ color: 'white', fontSize:'20px' }}>
                        © 2024 - Todos los Derechos Reservados NoviaChat. NoviaChat 2025.
                    </Typography>
                </GlassCard>
            </Container>
        </Box>
    );
};

export default Home;



