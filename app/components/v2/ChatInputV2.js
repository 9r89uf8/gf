// app/components/v2/ChatInputV2.js
import React from 'react';
import { Box, TextField, IconButton, Paper, Typography, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const ChatInputV2 = ({ 
    message, 
    setMessage, 
    onSendMessage, 
    onMediaSelect, 
    selectedMedia, 
    sending, 
    error, 
    fileInputRef 
}) => {
    return (
        <Paper 
            elevation={0}
            sx={{ 
                p: 2, 
                borderTop: 1,
                borderColor: 'divider'
            }}
        >
            <Box display="flex" gap={1} alignItems="center">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onMediaSelect}
                    accept="image/*,video/*,audio/*"
                    style={{ display: 'none' }}
                />
                <IconButton 
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={sending || message.trim().length > 0}
                >
                    <PhotoCameraIcon />
                </IconButton>
                
                <TextField
                    fullWidth
                    size="small"
                    multiline
                    maxRows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={selectedMedia ? "enviar..." : "Mensaje..."}
                    disabled={sending || selectedMedia}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && onSendMessage()}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 5,
                            bgcolor: '#f0f2f5',
                            '& fieldset': {
                                border: 'none',
                            },
                        },
                    }}
                />
                
                <IconButton 
                    onClick={onSendMessage}
                    disabled={sending || (!message.trim() && !selectedMedia)}
                    color="primary"
                >
                    {sending ? <CircularProgress size={24} /> : <SendIcon />}
                </IconButton>
            </Box>

        </Paper>
    );
};

export default ChatInputV2;