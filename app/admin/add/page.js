// src/components/Philosophy/CreatePhilosophy.js
'use client';
import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    FormControlLabel,
    Switch,
    Grid,
    Typography,
    Avatar,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';
import { addPost } from '@/app/services/girlService';

// Styled components
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

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: 20,
    '& label.Mui-focused': {
        color: 'white',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },
    '& .MuiInputBase-input': {
        color: 'white',
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
    },
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: '#FE6B8B',
        '&:hover': {
            backgroundColor: alpha('#FE6B8B', theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#FE6B8B',
    },
}));

const AddPost = () => {
    const [isPremium, setIsPremium] = useState(false);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handlePremiumChange = (event) => {
        setIsPremium(event.target.checked);
    };

    const onFinish = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('premium', isPremium ? 'true' : 'false');
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        try {
            await addPost(formData);
            setIsPremium(false);
            setDescription('');
            setImage(null);
            setImagePreview(null);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: 'linear-gradient(45deg, #343a40 0%, #212529 100%)',
                padding: 2
            }}
        >
            <GlassCard sx={{ width: '430px', maxWidth: '100%', marginTop: 3 }}>
                <CardContent>
                    <Typography variant="h4" component="h1" sx={{ color: 'white', marginBottom: 3, fontWeight: 'bold' }}>
                        Crear Post
                    </Typography>
                    <form onSubmit={onFinish}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <StyledTextField
                                    label="Descripción"
                                    multiline
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <StyledSwitch
                                            checked={isPremium}
                                            onChange={handlePremiumChange}
                                        />
                                    }
                                    label="Premium"
                                    sx={{ color: 'white' }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <GradientButton
                                    variant="contained"
                                    component="label"
                                    startIcon={<PhotoCamera />}
                                    fullWidth
                                >
                                    Subir Imagen
                                    <input type="file" hidden onChange={handleFileChange} />
                                </GradientButton>
                            </Grid>
                            <Grid item xs={12}>
                                {imagePreview && (
                                    <Avatar
                                        variant="rounded"
                                        src={imagePreview}
                                        sx={{ width: '100%', height: 'auto', marginTop: 2 }}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <GradientButton type="submit" variant="contained" fullWidth>
                                    Crear Post
                                </GradientButton>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </GlassCard>
        </Box>
    );
};

export default AddPost;
