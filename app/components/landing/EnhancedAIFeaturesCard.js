import React from 'react';
import {Typography, Grid, Box, Card} from '@mui/material';
import { ImageOutlined, AudiotrackOutlined, ChatBubbleOutlineOutlined, FavoriteBorderOutlined } from '@mui/icons-material';

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

const FeatureItem = ({ icon, title, description }) => (
    <Box textAlign="center" sx={{ padding: 2 }}>
        {icon}
        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>
            {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {description}
        </Typography>
    </Box>
);

const EnhancedAIFeaturesCard = () => (
    <GlassCard>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
            Experience a New Dimension of AI Companionship
        </Typography>
        <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
                <FeatureItem
                    icon={<ImageOutlined sx={{ fontSize: 100, color: '#64ffda' }} />}
                    title="Visual Delights"
                    description="Receive captivating images that bring your conversations to life."
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FeatureItem
                    icon={<AudiotrackOutlined sx={{ fontSize: 90, color: '#ff80ab' }} />}
                    title="Auditory Bliss"
                    description="Enjoy soothing voice messages and personalized audio content."
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FeatureItem
                    icon={<ChatBubbleOutlineOutlined sx={{ fontSize: 80, color: '#80d8ff' }} />}
                    title="Deep Conversations"
                    description="Engage in meaningful dialogues that adapt to your mood and interests."
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FeatureItem
                    icon={<FavoriteBorderOutlined sx={{ fontSize: 70, color: '#ff80ab' }} />}
                    title="Emotional Connection"
                    description="Form a unique bond with an AI that understands and responds to your emotions."
                />
            </Grid>
        </Grid>
        <Typography variant="body1" align="center" sx={{ mt: 4, fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.9)' }}>
            Discover a world where technology and emotion intertwine, creating an unparalleled companionship experience.
        </Typography>
    </GlassCard>
);

export default EnhancedAIFeaturesCard;