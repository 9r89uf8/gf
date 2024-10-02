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
                backgroundImage: 'url(/background.jpg)', // Replace with your background image
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
                            <Typography variant="h2" gutterBottom>
                                Meet Your AI Girlfriend
                            </Typography>
                            <Typography variant="h5" paragraph>
                                Experience companionship like never before. Our AI girlfriends
                                are here to chat, entertain, and keep you company anytime,
                                anywhere.
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
                                    <img
                                        src="/next.svg" // Replace with your AI girlfriend image
                                        alt="AI Girlfriend"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
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
                                    <Typography variant="h5">17 años</Typography>
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

                <EnhancedAIFeaturesCard/>

                {/* Brief Demo or Preview */}
                <GlassCard>
                    <Typography variant="h4" gutterBottom align="center">
                        See It in Action
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
                            placeholder="Type your message..."
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
            </Container>
        </Box>
    );
};

export default Home;



