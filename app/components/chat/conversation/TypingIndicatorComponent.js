import React, { useEffect, useState } from 'react';
import { Box, Avatar, styled } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// Styled components
const TypingContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2px',
    marginTop: '8px'
}));

const TypingBubble = styled(motion.div)(({ theme }) => ({
    padding: '10px 16px',
    borderRadius: 20,
    backgroundColor: theme.palette.grey[100],
    maxWidth: '240px',
    position: 'relative',
    overflow: 'hidden',
}));

const TypingText = styled(Box)({
    fontSize: '14px',
    color: '#000000',
    position: 'relative',
    minHeight: '20px',
    minWidth: '20px',
    '&::after': {
        content: '""',
        position: 'absolute',
        right: '-4px',
        bottom: '0',
        width: '2px',
        height: '15px',
        backgroundColor: '#666',
        animation: 'blink 0.8s infinite',
    },
    '@keyframes blink': {
        '0%, 100%': {
            opacity: 1,
        },
        '50%': {
            opacity: 0,
        },
    },
});

const AvatarPulse = styled(motion.div)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '50%',
    zIndex: -1,
});

export const RealisticTypingIndicator = ({ girl }) => {
    const [typingText, setTypingText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [thinkingDots, setThinkingDots] = useState('.');

    // Reset effects when typing state changes
    useEffect(() => {
        if (girl.girlIsTyping) {
            setTypingText('');
            setIsDeleting(false);
            setIsThinking(false);
        }
    }, [girl.girlIsTyping]);

    // Thinking dots animation
    useEffect(() => {
        if (!isThinking) return;

        const dotsInterval = setInterval(() => {
            setThinkingDots(prev => {
                if (prev === '.') return '..';
                if (prev === '..') return '...';
                return '.';
            });
        }, 500);

        return () => clearInterval(dotsInterval);
    }, [isThinking]);

    // Realistic typing simulation
    useEffect(() => {
        if (!girl.girlIsTyping) return;

        // First, simulate thinking by pausing
        if (!isThinking && typingText.length === 0) {
            setIsThinking(true);
            const thinkingTime = Math.random() * 1000 + 500; // 0.5-1.5 seconds of thinking

            const thinkingTimeout = setTimeout(() => {
                setIsThinking(false);
            }, thinkingTime);

            return () => clearTimeout(thinkingTimeout);
        }

        // Don't type while "thinking"
        if (isThinking) return;

        // Occasional deletion to simulate changing mind
        if (typingText.length > 5 && Math.random() < 0.2 && !isDeleting) {
            setIsDeleting(true);
            return;
        }

        if (isDeleting) {
            if (typingText.length === 0) {
                setIsDeleting(false);
                return;
            }

            const deleteTimeout = setTimeout(() => {
                setTypingText(prev => prev.slice(0, -1));
            }, Math.random() * 100 + 50); // Faster deletion

            return () => clearTimeout(deleteTimeout);
        }

        // Regular typing simulation
        if (typingText.length < 10) {
            const typingTimeout = setTimeout(() => {
                // Add some more text
                const nextChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                setTypingText(prev => prev + nextChar);
            }, Math.random() * 200 + 100); // Random typing speed

            return () => clearTimeout(typingTimeout);
        }

    }, [girl.girlIsTyping, typingText, isDeleting, isThinking]);

    if (!girl.girlIsTyping) return null;

    // Bubble animation variants
    const bubbleVariants = {
        initial: { scale: 0.8, opacity: 0, y: 10 },
        animate: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 30
            }
        },
        exit: {
            scale: 0.8,
            opacity: 0,
            y: 10,
            transition: {
                duration: 0.2
            }
        }
    };

    // Shimmer effect variants
    const shimmerVariants = {
        initial: { x: '-100%' },
        animate: {
            x: '100%',
            transition: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 1.5,
                ease: "easeInOut"
            }
        }
    };

    // Pulse animation variants
    const pulseVariants = {
        initial: {
            boxShadow: '0 0 0 0px rgba(0, 255, 200, 0)'
        },
        animate: {
            boxShadow: [
                '0 0 0 0px rgba(0, 255, 200, 0)',
                '0 0 0 20px rgba(0, 200, 255, 0.4)',
                '0 0 0 40px rgba(0, 160, 255, 0.2)',
                '0 0 0 60px rgba(0, 120, 255, 0.1)',
                '0 0 0 80px rgba(0, 80, 255, 0)'
            ],
            transition: {
                duration: 2.5,
                repeat: Infinity,
                repeatType: "loop"
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                mt: 3,
                mx: 2,
                position: 'sticky',
                bottom: 16,
                zIndex: 1,
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <AvatarPulse
                    variants={pulseVariants}
                    initial="initial"
                    animate="animate"
                />
                <motion.div
                    initial={{ scale: 1 }}
                    animate={{
                        scale: [1, 1.05, 1],
                        transition: {
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "loop"
                        }
                    }}
                >
                    <Avatar
                        src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                        sx={{
                            width: 48,
                            height: 48,
                            backgroundImage: 'linear-gradient(to right, #ff8fab, #fb6f92)',
                            border: '2px solid white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    />
                </motion.div>
            </Box>

            <TypingContainer>
                <AnimatePresence>
                    <TypingBubble
                        variants={bubbleVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key="typing-bubble"
                    >
                        {/* Shimmer effect overlay */}
                        <motion.div
                            variants={shimmerVariants}
                            initial="initial"
                            animate="animate"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)',
                                zIndex: 0
                            }}
                        />

                        <TypingText>
                            {isThinking ? thinkingDots : typingText}
                        </TypingText>
                    </TypingBubble>
                </AnimatePresence>
            </TypingContainer>
        </Box>
    );
};