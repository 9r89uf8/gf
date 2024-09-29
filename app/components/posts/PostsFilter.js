import React from 'react';
import { Grid, Typography, Card, Box } from '@mui/material';
import { styled, keyframes, alpha } from "@mui/material/styles";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const pulse = keyframes`
    0% {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
`;

const GlassCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.common.white,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 15,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
    transition: 'all 0.3s ease-in-out',
    animation: `${pulse} 2s infinite`,
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 12px 20px -10px rgba(255, 255, 255, 0.4)`,
    },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    padding: theme.spacing(2),
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: theme.spacing(2),
}));

const GradientText = styled(Typography)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
}));

const PostsFilter = ({ postsCount }) => {
    return (
        <Grid container justifyContent="center" sx={{ mt: 4, mb: 4 }}>
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <GlassCard elevation={4}>
                    <IconWrapper>
                        <PhotoLibraryIcon fontSize="large" />
                    </IconWrapper>
                    <Typography variant="h6" gutterBottom>
                        Galería de fotos
                    </Typography>
                    <GradientText variant="h4">
                        {postsCount}
                    </GradientText>
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                        {postsCount === 1 ? 'foto' : 'fotos'}
                    </Typography>
                </GlassCard>
            </Grid>
        </Grid>
    );
};

export default PostsFilter;

