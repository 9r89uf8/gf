import React from 'react';
import { Grid, Typography, Paper, Box } from '@mui/material';
import { styled, keyframes } from "@mui/material/styles";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(52, 152, 219, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
  }
`;

const StatsCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.common.white,
    background: 'linear-gradient(135deg, #3498db, #2980b9)',
    borderRadius: theme.shape.borderRadius * 2,
    transition: 'all 0.3s ease-in-out',
    animation: `${pulse} 2s infinite`,
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 12px 20px -10px rgba(52, 152, 219, 0.4)`,
    },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    padding: theme.spacing(2),
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: theme.spacing(2),
}));

const PostsFilter = ({ postsCount }) => {
    return (
        <Grid container justifyContent="center" sx={{ mt: 4, mb: 4 }}>
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <StatsCard elevation={4}>
                    <IconWrapper>
                        <PhotoLibraryIcon fontSize="large" />
                    </IconWrapper>
                    <Typography variant="h6" gutterBottom>
                        Photo Gallery
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                        {postsCount}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                        {postsCount === 1 ? 'Photo' : 'Photos'}
                    </Typography>
                </StatsCard>
            </Grid>
        </Grid>
    );
};

export default PostsFilter;

