// ImagePreviewComponent.js
import React from 'react';
import { Box, Paper, IconButton, styled } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const ImagePreviewStyled = styled('img')({
    maxWidth: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: '5px',
});

const ImagePreviewComponent = ({ imagePreview, handleClearImage }) => (
    <Box
        sx={{
            position: 'fixed',
            bottom: 70,
            left: '50%',
            transform: 'translateX(-50%)',
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
                onClick={handleClearImage}
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0
                }}
            >
                <CancelIcon style={{fontSize: 35}}/>
            </IconButton>
            <ImagePreviewStyled src={imagePreview} alt="Selected" />
        </Paper>
    </Box>
);

export default ImagePreviewComponent;

