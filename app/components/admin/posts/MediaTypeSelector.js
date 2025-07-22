import React from 'react';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { PhotoCamera, VideoCall, TextFields } from '@mui/icons-material';

export default function MediaTypeSelector({ mediaType, onChange }) {
    return (
        <ToggleButtonGroup
            value={mediaType}
            exclusive
            onChange={(e, newValue) => newValue && onChange(newValue)}
            fullWidth
        >
            <ToggleButton value="image" sx={{ color: 'black' }}>
                <PhotoCamera sx={{ mr: 1 }} /> Image
            </ToggleButton>
            <ToggleButton value="video" sx={{ color: 'black' }}>
                <VideoCall sx={{ mr: 1 }} /> Video
            </ToggleButton>
            <ToggleButton value="text" sx={{ color: 'black' }}>
                <TextFields sx={{ mr: 1 }} /> Text
            </ToggleButton>
        </ToggleButtonGroup>
    );
}