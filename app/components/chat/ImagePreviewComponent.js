// ImagePreviewComponent.js
import React from 'react';
import { Box, Button, styled } from '@mui/material';

const ImagePreviewStyled = styled('img')({
    maxWidth: '100%',
    maxHeight: '200px',
    objectFit: 'contain',
    marginTop: '10px',
    borderRadius: '5px',
});

const ImagePreviewComponent = ({ imagePreview, handleClearImage }) => (
    <Box
        sx={{
            position: 'fixed',
            bottom: 70,
            left: 0,
            right: 0,
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: 2,
            borderRadius: 1,
        }}
    >
        <ImagePreviewStyled src={imagePreview} alt="Selected" />
        <Button
            onClick={handleClearImage}
            variant="contained"
            color="secondary"
            size="small"
            sx={{ mt: 1 }}
        >
            Clear Image
        </Button>
    </Box>
);

export default ImagePreviewComponent;
