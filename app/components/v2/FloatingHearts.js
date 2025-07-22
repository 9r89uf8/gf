// app/components/v2/FloatingHearts.js
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

const FloatingHearts = ({ trigger }) => {
    const [hearts, setHearts] = useState([]);
    
    useEffect(() => {
        if (trigger) {
            // Create 3-5 hearts with random properties
            const numHearts = Math.floor(Math.random() * 3) + 3;
            const newHearts = Array.from({ length: numHearts }, (_, i) => ({
                id: Date.now() + i,
                left: Math.random() * 40 - 20, // Random position -20px to +20px
                delay: i * 100, // Stagger animation
                size: Math.random() * 8 + 12, // 12-20px
                duration: Math.random() * 1000 + 2000 // 2-3 seconds
            }));
            
            setHearts(prev => [...prev, ...newHearts]);
            
            // Remove hearts after animation completes
            const longestDuration = Math.max(...newHearts.map(h => h.duration + h.delay));
            setTimeout(() => {
                setHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
            }, longestDuration + 500);
        }
    }, [trigger]);
    
    return (
        <>
            {hearts.map(heart => (
                <Box
                    key={heart.id}
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: heart.left + 'px',
                        animation: `floatHeart ${heart.duration}ms ease-out forwards`,
                        animationDelay: heart.delay + 'ms',
                        opacity: 0,
                        pointerEvents: 'none',
                        zIndex: 1000
                    }}
                >
                    <svg
                        width={heart.size}
                        height={heart.size}
                        viewBox="0 0 24 24"
                        fill="#ff3040"
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </Box>
            ))}
            
            <style jsx global>{`
                @keyframes floatHeart {
                    0% {
                        opacity: 0;
                        transform: translateY(0) scale(0.3);
                    }
                    15% {
                        opacity: 1;
                        transform: translateY(-20px) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-150px) scale(0.5) translateX(${Math.random() * 40 - 20}px);
                    }
                }
            `}</style>
        </>
    );
};

export default FloatingHearts;