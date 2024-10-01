'use client';
import React from 'react';
import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';

const AnimatedImage = () => {
    return (
        <Box
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            sx={{
                borderRadius: '50%',
                width: { xs: 250, md: 350 },
                height: { xs: 250, md: 350 },
                overflow: 'hidden',
                border: `4px solid ${alpha('#ffffff', 0.5)}`,
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
    );
};

export default AnimatedImage;
