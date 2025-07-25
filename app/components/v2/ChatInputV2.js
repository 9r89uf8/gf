// app/components/v2/ChatInputV2.js
import React from 'react';
import { Box, TextField, IconButton, Paper, Typography, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

const ChatInputV2 = ({ 
    message, 
    setMessage, 
    onSendMessage, 
    onMediaSelect, 
    selectedMedia, 
    sending, 
    error, 
    fileInputRef,
    isRecording,
    onStartRecording,
    onStopRecording,
    recordingTime
}) => {
    // Format recording time as MM:SS
    const formatRecordingTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

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
                    disabled={sending || message.trim().length > 0 || isRecording}
                >
                    <PhotoCameraIcon />
                </IconButton>
                
                <IconButton
                    size="small"
                    onClick={isRecording ? onStopRecording : onStartRecording}
                    disabled={sending || message.trim().length > 0 || selectedMedia}
                    sx={{
                        color: isRecording ? 'error.main' : 'default',
                        animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                        '@keyframes pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.5 },
                            '100%': { opacity: 1 }
                        }
                    }}
                >
                    {isRecording ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
                
                <TextField
                    fullWidth
                    size="small"
                    multiline
                    maxRows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                        isRecording ? `Grabando... ${formatRecordingTime(recordingTime)}` :
                        selectedMedia ? "enviar..." : "Mensaje..."
                    }
                    disabled={sending || selectedMedia || isRecording}
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
                    disabled={sending || (!message.trim() && !selectedMedia) || isRecording}
                    color="primary"
                >
                    {sending ? <CircularProgress size={24} /> : <SendIcon />}
                </IconButton>
            </Box>

        </Paper>
    );
};

export default ChatInputV2;