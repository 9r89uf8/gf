// app/components/v2/MessagesContainerV2.js
import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import MessageItemV2 from './MessageItemV2';

const MessagesContainerV2 = ({ messages, user, girl, onLikeMessage, messagesEndRef }) => {
    // Check if there's a user message with status 'processing'
    const showTypingIndicator = messages.some(msg => 
        msg.role === 'user' && msg.status === 'processing'
    );

    return (
        <Box 
            flex={1} 
            overflow="auto" 
            py={2}
            px={0}
            bgcolor="#fafafa"
        >
            {messages.length === 0 && (
                <Box textAlign="center" color="text.secondary" mt={6}>
                    <Typography>Aún no hay mensajes. ¡Comienza una conversación!</Typography>
                </Box>
            )}
            
            {messages.map((msg) => (
                <MessageItemV2
                    key={msg.id}
                    message={msg}
                    user={user}
                    girl={girl}
                    onLikeMessage={onLikeMessage}
                />
            ))}
            
            {/* Typing indicator */}
            {showTypingIndicator && girl && (
                <Box 
                    mb={3}
                    display="flex"
                    justifyContent="flex-start"
                    sx={{
                        mr: '50%',
                        ml: 2.5
                    }}
                >
                    <Box 
                        sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            width: '100%'
                        }}
                    >
                        {/* Avatar */}
                        <Avatar
                            src={girl.picture ? 
                                `https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/${girl.picture}/w=200,fit=scale-down` : 
                                girl.profileImage
                            }
                            sx={{
                                width: 28,
                                height: 28,
                                mb: 0.5,
                                backgroundImage: 'linear-gradient(to right, #ff8fab, #fb6f92)'
                            }}
                        />
                        
                        {/* Typing message */}
                        <Box 
                            sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2,
                                py: 1,
                                bgcolor: '#e4e6eb',
                                borderRadius: 4
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                <Box 
                                    sx={{ 
                                        width: 8, 
                                        height: 8, 
                                        borderRadius: '50%', 
                                        bgcolor: 'text.secondary',
                                        animation: 'pulse 1.4s infinite',
                                        animationDelay: '0s'
                                    }} 
                                />
                                <Box 
                                    sx={{ 
                                        width: 8, 
                                        height: 8, 
                                        borderRadius: '50%', 
                                        bgcolor: 'text.secondary',
                                        animation: 'pulse 1.4s infinite',
                                        animationDelay: '0.2s'
                                    }} 
                                />
                                <Box 
                                    sx={{ 
                                        width: 8, 
                                        height: 8, 
                                        borderRadius: '50%', 
                                        bgcolor: 'text.secondary',
                                        animation: 'pulse 1.4s infinite',
                                        animationDelay: '0.4s'
                                    }} 
                                />
                            </Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
                                {girl.name} esta escribiendo...
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )}
            
            <div ref={messagesEndRef} />
            
            {/* Add keyframes for typing animation */}
            <style jsx global>{`
                @keyframes pulse {
                    0%, 60%, 100% {
                        opacity: 0.3;
                    }
                    30% {
                        opacity: 1;
                    }
                }
            `}</style>
        </Box>
    );
};

export default MessagesContainerV2;