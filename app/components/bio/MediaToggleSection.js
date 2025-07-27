'use client';

import React, { useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import MediaItemsSection from './MediaItemsSection';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

// Styled toggle button with consistent design system
const StyledToggleButton = styled(ToggleButton)(({ theme, selected }) => ({
    borderRadius: 25,
    padding: '10px 24px',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '0.95rem',
    border: 'none',
    background: selected 
        ? 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)' 
        : 'transparent',
    color: selected ? '#ffffff' : 'rgba(71, 85, 105, 0.8)',
    '&:hover': {
        background: selected 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)' 
            : 'rgba(0, 0, 0, 0.04)',
    },
    '&.Mui-selected': {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
        color: '#ffffff',
        '&:hover': {
            background: 'linear-gradient(135deg, #2a2a2a 0%, #0a0a0a 100%)',
        },
    },
    transition: 'all 0.3s ease',
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    background: 'rgba(248, 250, 252, 0.8)',
    padding: '4px',
    borderRadius: 30,
    border: '1px solid rgba(0, 0, 0, 0.08)',
    gap: theme.spacing(1),
}));

export default function MediaToggleSection({ girl }) {
    const [activeView, setActiveView] = useState('gallery');

    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setActiveView(newView);
        }
    };

    // Get items based on active view
    const items = activeView === 'gallery' ? (girl.gallery || []) : (girl.posts || []);

    return (
        <>
            {/* Toggle Buttons */}
            <ModernCard variant="flat" animate={false} sx={{ mb: 3 }}>
                <CardContentWrapper>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 1
                    }}>
                        <StyledToggleButtonGroup
                            value={activeView}
                            exclusive
                            onChange={handleViewChange}
                            aria-label="media view toggle"
                        >
                            <StyledToggleButton 
                                value="gallery" 
                                aria-label="gallery view"
                                selected={activeView === 'gallery'}
                            >
                                <PhotoLibraryIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                Galería
                            </StyledToggleButton>
                            <StyledToggleButton 
                                value="posts" 
                                aria-label="posts view"
                                selected={activeView === 'posts'}
                            >
                                <DynamicFeedIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                Publicaciones
                            </StyledToggleButton>
                        </StyledToggleButtonGroup>
                    </Box>
                </CardContentWrapper>
            </ModernCard>

            {/* Media Items */}
            {items.length > 0 ? (
                <MediaItemsSection items={items} girlId={girl.id} />
            ) : (
                <ModernCard variant="flat" animate={false}>
                    <CardContentWrapper>
                        <Box sx={{ 
                            textAlign: 'center', 
                            py: 8,
                            px: 3
                        }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: 'rgba(71, 85, 105, 0.8)',
                                    fontWeight: 500
                                }}
                            >
                                {activeView === 'gallery' 
                                    ? 'No hay imágenes en la galería aún' 
                                    : 'No hay publicaciones aún'}
                            </Typography>
                        </Box>
                    </CardContentWrapper>
                </ModernCard>
            )}
        </>
    );
}