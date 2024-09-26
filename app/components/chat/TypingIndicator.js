// TypingIndicator.js
import React from 'react';
import { styled, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const TypingIndicatorContainer = styled(motion.div)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(12),
    left: 0,
    right: 0,
    width: '100%',
    maxWidth: 'sm',
    margin: '0 auto',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const colors = ['#FF4081', '#7C4DFF', '#448AFF']; // Array of vibrant colors

const TypingDot = styled(motion.span)(({ theme }) => ({
    width: 12,
    height: 12,
    borderRadius: '50%',
    margin: '0 4px',
}));

const TypingIndicator = ({ girl }) => (
    <TypingIndicatorContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
    >
        <Typography variant="body1" sx={{ mr: 2 }}>
            {girl?.username} está escribiendo
        </Typography>
        {colors.map((color, index) => (
            <TypingDot
                key={index}
                style={{ backgroundColor: color }}
                animate={{
                    y: [0, -10, 0],
                    opacity: [0.7, 1, 0.7],
                    backgroundColor: [color, '#FFFFFF', color],
                }}
                transition={{
                    y: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: 0.6,
                        delay: index * 0.2,
                    },
                    opacity: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: 0.6,
                        delay: index * 0.2,
                    },
                    backgroundColor: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: 1.2,
                        delay: index * 0.2,
                    },
                }}
            />
        ))}
    </TypingIndicatorContainer>
);

export default TypingIndicator;
