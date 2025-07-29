// components/GirlsCarouselMUI.js
'use client';

import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import GirlCardMUI from './GirlCardMUI';

const ScrollContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: theme.spacing(0.5, 0),
    marginBottom: theme.spacing(1.5),
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch',
    '&::-webkit-scrollbar': {
        height: 8,
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 4,
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
    },
}));

const GirlsCarouselMUI = ({ girls, isPremium }) => {
    if (girls && girls.length > 0) {
        return (
            <ScrollContainer>
                {girls.map((girl) => (
                    <GirlCardMUI
                        key={girl.id}
                        girl={girl}
                        isPremium={isPremium}
                    />
                ))}
            </ScrollContainer>
        );
    }

    return null;
};

export default GirlsCarouselMUI;