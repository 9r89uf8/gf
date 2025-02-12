// src/components/MediaUpload.js
'use client';
import React, { useState } from 'react';
import { Box, Card, CardContent, Button, Grid, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';
import {addReel} from "@/app/services/girlService";

// Styled components similar to your original design
const GlassCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 15,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: '10px 0',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
    },
}));

const UploadMedia = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // Handle file selection
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    // Handle form submission (e.g., upload to an API)
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        await addReel(formData)

        // Optionally reset the state after submission
        setFile(null);
        setPreview(null);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(45deg, #343a40 0%, #212529 100%)',
                padding: 2,
            }}
        >
            <GlassCard sx={{ width: '430px', maxWidth: '100%', marginTop: 3 }}>
                <CardContent>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{ color: 'white', marginBottom: 3, fontWeight: 'bold' }}
                    >
                        Upload Media
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {/* Upload Button */}
                            <Grid item xs={12}>
                                <GradientButton
                                    variant="contained"
                                    component="label"
                                    fullWidth
                                    startIcon={<CloudUpload />}
                                >
                                    Upload Image/Video
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        hidden
                                        onChange={handleFileChange}
                                    />
                                </GradientButton>
                            </Grid>

                            {/* Preview the selected image or video */}
                            <Grid item xs={12}>
                                {preview && file && file.type.startsWith('image') ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            marginTop: 2,
                                            borderRadius: 8,
                                        }}
                                    />
                                ) : preview && file ? (
                                    <video
                                        controls
                                        src={preview}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            marginTop: 2,
                                            borderRadius: 8,
                                        }}
                                    />
                                ) : null}
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <GradientButton type="submit" variant="contained" fullWidth>
                                    Submit
                                </GradientButton>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </GlassCard>
        </Box>
    );
};

export default UploadMedia;
