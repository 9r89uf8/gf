import React from 'react';
import { Box, Paper, IconButton, styled } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const MediaPreviewStyled = styled('div')({
    maxWidth: '100%',
    maxHeight: '300px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const ImagePreview = styled('img')({
    maxWidth: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: '5px',
});

const VideoPreview = styled('video')({
    maxWidth: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: '5px',
});

const MediaPreviewComponent = ({ mediaPreview, mediaType, handleClearMedia }) => (
    <Box
        sx={{
            position: 'fixed',
            bottom: 70,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
        }}
    >
        <Paper
            elevation={3}
            sx={{
                position: 'relative',
                padding: 2,
                borderRadius: 2,
                maxWidth: 400,
                width: '90%',
                textAlign: 'center',
            }}
        >
            <IconButton
                aria-label="close"
                onClick={handleClearMedia}
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 1,
                }}
            >
                <CancelIcon style={{ fontSize: 35 }} />
            </IconButton>
            <MediaPreviewStyled>
                {mediaType === 'image' ? (
                    <ImagePreview src={mediaPreview} alt="Selected" />
                ) : (
                    <VideoPreview controls>
                        <source src={mediaPreview} type="video/mp4" />
                        Your browser does not support the video tag.
                    </VideoPreview>
                )}
            </MediaPreviewStyled>
        </Paper>
    </Box>
);

export default MediaPreviewComponent;