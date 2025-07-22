// app/components/v2/MediaPreviewV2.js
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';

const MediaPreviewV2 = ({ selectedMedia, mediaPreview, onClear }) => {
    if (!mediaPreview && !selectedMedia) return null;

    return (
        <Box 
            sx={{ 
                p: 2, 
                borderTop: 1, 
                borderColor: 'divider',
                bgcolor: '#f5f5f5'
            }}
        >
            <Box display="flex" alignItems="center" gap={2}>
                {selectedMedia.type === 'image' && (
                    <img 
                        src={mediaPreview} 
                        alt="Preview" 
                        style={{ height: '60px', borderRadius: '4px' }} 
                    />
                )}
                {selectedMedia.type === 'video' && (
                    <video 
                        src={mediaPreview} 
                        style={{ height: '60px', borderRadius: '4px' }}
                    />
                )}
                {selectedMedia.type === 'audio' && (
                    <Box 
                        sx={{ 
                            p: 2, 
                            bgcolor: '#e0e0e0', 
                            borderRadius: 1 
                        }}
                    >
                        <MicIcon />
                    </Box>
                )}
                {selectedMedia.type === 'audio' && (
                    <Typography variant="caption" flex={1}>
                        {selectedMedia.file.name}
                    </Typography>
                )}
                <IconButton 
                    size="small" 
                    onClick={onClear}
                >
                    ✕
                </IconButton>
            </Box>
        </Box>
    );
};

export default MediaPreviewV2;