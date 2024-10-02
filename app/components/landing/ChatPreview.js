import React from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const chatContainerStyles = {
    maxWidth: 600,
    maxHeight: 700,
    overflowY: 'auto',
    padding: 2
};

const messageRowStyles = (isUser) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: isUser ? 'flex-end' : 'flex-start',
    marginBottom: 2,
});

const messageBubbleStyles = (isUser) => ({
    maxWidth: '70%',
    padding: 1.5,
    borderRadius: 2,
    background: isUser
        ? '#ffffff'
        : 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    color: isUser ? '#000' : '#fff',
    position: 'relative',
    wordWrap: 'break-word',
    marginTop: 1, // Added margin between avatar and message
});

const avatarStyles = {
    width: 40,
    height: 40,
    marginLeft: 1,
    marginRight: 1,
};

const imageMessageStyles = {
    maxWidth: '70%',
    borderRadius: 2,
    marginTop: 1, // Added margin between avatar and image
};

const audioMessageStyles = (isUser) => ({
    display: 'flex',
    alignItems: 'center',
    background: isUser
        ? '#dcf8c6'
        : 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    padding: 1,
    borderRadius: 2,
    maxWidth: '70%',
    color: isUser ? '#000' : '#fff',
    marginTop: 1, // Added margin between avatar and audio message
});

const ChatPreview = () => {
    return (
        <Box sx={chatContainerStyles}>
            {/* User Message */}
            <Box sx={messageRowStyles(true)}>
                <Avatar src="/thirteen.svg" alt="User" sx={avatarStyles} />
                <Box sx={messageBubbleStyles(true)}>
                    <Typography variant="body1">Hola preciosa</Typography>
                </Box>
            </Box>

            {/* AI Girlfriend Text Message */}
            <Box sx={messageRowStyles(false)}>
                <Avatar src="/next.svg" alt="AI Girlfriend" sx={avatarStyles} />
                <Box sx={messageBubbleStyles(false)}>
                    <Typography variant="body1">
                        ¡Ey! ¿Cómo estuvo tu día? 😊
                    </Typography>
                </Box>
            </Box>

            {/* AI Girlfriend Image Message */}
            <Box sx={messageRowStyles(false)}>
                <Avatar src="/next.svg" alt="AI Girlfriend" sx={avatarStyles} />
                <Box
                    component="img"
                    src="/vercel.svg"
                    alt="AI sent an image"
                    sx={imageMessageStyles}
                />
            </Box>

            {/* AI Girlfriend Audio Message */}
            <Box sx={messageRowStyles(false)}>
                <Avatar src="/next.svg" alt="AI Girlfriend" sx={avatarStyles} />
                <Box sx={audioMessageStyles(false)}>
                    <IconButton>
                        <PlayArrowIcon sx={{ color: '#fff' }} />
                    </IconButton>
                    <Typography variant="body2">0:10</Typography>
                </Box>
            </Box>

            {/* User Message */}
            <Box sx={messageRowStyles(true)}>
                <Avatar src="/thirteen.svg" alt="User" sx={avatarStyles} />
                <Box sx={messageBubbleStyles(true)}>
                    <Typography variant="body1">
                        ¡Fue genial, gracias por preguntar!
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatPreview;



