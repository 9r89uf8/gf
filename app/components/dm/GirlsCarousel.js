// components/GirlsCarousel.js
import React from 'react';
import { Box, Skeleton } from '@mui/material';
import GirlCard from './GirlCard';
import {
    GirlCard as StyledGirlCard,
    AvatarWrapper,
    GradientButton
} from './DMListStyled';
import { CardContent, CardActions } from '@mui/material';

const GirlsCarousel = ({ girls, loading, isPremium, onMessageClick, onPremiumClick }) => {
    const scrollContainerStyle = {
        overflowX: 'auto',
        display: 'flex',
        flexDirection: 'row',
        padding: '10px 0',
        marginBottom: '20px',
        '&::-webkit-scrollbar': {
            height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
        },
    };

    // Show skeletons when loading, regardless of girls array state
    if (loading) {
        return (
            <Box sx={scrollContainerStyle}>
                {[...Array(5)].map((_, index) => (
                    <SkeletonGirlCard key={index} />
                ))}
            </Box>
        );
    }

    // Show girls data when not loading and girls exist
    if (girls && girls.length > 0) {
        return (
            <Box sx={scrollContainerStyle}>
                {girls.map((girl) => (
                    <GirlCard
                        key={girl.id}
                        girl={girl}
                        isPremium={isPremium}
                        onMessageClick={onMessageClick}
                        onPremiumClick={onPremiumClick}
                    />
                ))}
            </Box>
        );
    }

    // Show empty state if no girls and not loading
    return null;
};

// New component for Skeleton Girl Card that matches the structure of GirlCard
const SkeletonGirlCard = () => {
    return (
        <StyledGirlCard>
            <AvatarWrapper>
                <Skeleton
                    variant="circular"
                    width={120}
                    height={120}
                    sx={{
                        border: '4px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    }}
                />
                <Skeleton
                    variant="circular"
                    width={12}
                    height={12}
                    sx={{
                        position: 'absolute',
                        bottom: 5,
                        right: 5,
                    }}
                />
            </AvatarWrapper>

            <CardContent sx={{
                textAlign: 'center',
                p: 1,
                flex: '1 0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginTop: -5,
                marginBottom: -5
            }}>
                <Skeleton variant="text" width={100} height={24} sx={{ mx: 'auto' }} />
            </CardContent>

            <CardActions sx={{ width: '100%', p: 2, pt: 0 }}>
                <GradientButton disabled>
                    Mensaje
                </GradientButton>
            </CardActions>
        </StyledGirlCard>
    );
};

export default GirlsCarousel;