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
            Experimenta una nueva dimensión de compañía
        </Typography>
        <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
                <FeatureItem
                    icon={<ImageOutlined sx={{ fontSize: 100, color: '#64ffda' }} />}
                    title="Delicias Visuales"
                    description="Recibe imágenes cautivadoras que dan vida a tus conversaciones."
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FeatureItem
                    icon={<AudiotrackOutlined sx={{ fontSize: 90, color: '#ff80ab' }} />}
                    title="Placer Auditivo"
                    description="Disfruta de mensajes de voz relajantes y contenido de audio personalizado."
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FeatureItem
                    icon={<ChatBubbleOutlineOutlined sx={{ fontSize: 80, color: '#80d8ff' }} />}
                    title="Conversaciones Profundas"
                    description="Participa en diálogos significativos que se adaptan a tu estado de ánimo e intereses."
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FeatureItem
                    icon={<FavoriteBorderOutlined sx={{ fontSize: 70, color: '#ff80ab' }} />}
                    title="Conexión Emocional"
                    description="Forma un vínculo único con una compañera que entiende y responde a tus emociones."
                />
            </Grid>
        </Grid>
        <Typography variant="body1" align="center" sx={{ mt: 4, fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.9)' }}>
            Descubre un mundo donde la tecnología y la emoción se entrelazan, creando una experiencia de compañía sin igual con tu novia virtual impulsada por IA.
        </Typography>
    </GlassCard>

);

export default EnhancedAIFeaturesCard;