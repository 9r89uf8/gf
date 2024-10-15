// src/components/Girls/AddGirl.js
'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/app/store/store';
import { addGirl } from "@/app/services/girlService";
import {
    Container,
    Grid,
    TextField,
    Button,
    FormControl,
    FormLabel,
    Switch,
    FormControlLabel,
    MenuItem,
    Select,
    Avatar,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Card,
} from '@mui/material';
import { alpha, styled } from "@mui/material/styles";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useRouter } from 'next/navigation';

// Styled Components (Same as in UpdateGirlInfo)
const GlassCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 15,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
    marginTop: 10,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    border: `4px solid ${alpha('#ffffff', 0.5)}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    margin: 'auto',
    cursor: 'pointer',
    '&:hover': {
        opacity: 0.8,
    },
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 25,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: '10px 0',
    fontWeight: 'bold',
    textTransform: 'none',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
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

const AddGirl = () => {
    const router = useRouter();
    const user = useStore((state) => state.user);


    // Consolidated form state
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        audioId: '',
        bio: '',
        image: null,
        isPrivate: false,
        country: '',
        education: '',
        age: 15,
    });

    // Additional states for image preview and form feedback
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle file input changes and set image preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('username', formData.username);
        data.append('age', formData.age);
        data.append('private', formData.isPrivate.toString());
        data.append('country', formData.country);
        data.append('education', formData.education);
        data.append('audioId', formData.audioId);
        data.append('user', user ? user.uid : '');
        data.append('bio', formData.bio);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            await addGirl(data);
            setSuccessMessage('Girl created successfully!');
            // Reset form fields
            setFormData({
                name: '',
                username: '',
                audioId: '',
                bio: '',
                image: null,
                isPrivate: false,
                country: '',
                education: '',
                age: 15,
            });
            setImagePreview(null);
        } catch (error) {
            console.error('Error creating girl:', error);
            setErrorMessage('Failed to create girl. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Clean up image preview URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: 'linear-gradient(45deg, #343a40 0%, #212529 100%)',
                padding: 2,
            }}
        >
            <Container maxWidth="md">
                <GlassCard elevation={4}>
                    <Typography variant="h4" gutterBottom sx={{ color: 'white', marginBottom: 3 }}>
                        Create Girl
                    </Typography>

                    {/* Display success or error messages */}
                    {successMessage && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {successMessage}
                        </Alert>
                    )}
                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <Grid container spacing={4}>
                            {/* Avatar and Image Upload */}
                            <Grid item xs={12} md={4}>
                                <Box position="relative" display="inline-block">
                                    <StyledAvatar
                                        src={imagePreview}
                                        alt={formData.name || "Upload Image"}
                                    />
                                    <Button
                                        component="label"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            borderRadius: '50%',
                                            minWidth: 'auto',
                                            padding: 1,
                                        }}
                                    >
                                        <CameraAltIcon />
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </Button>
                                </Box>
                            </Grid>

                            {/* Form Fields */}
                            <Grid item xs={12} md={8}>
                                <StyledTextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <StyledTextField
                                    fullWidth
                                    label="Username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                                <StyledTextField
                                    fullWidth
                                    label="Age"
                                    name="age"
                                    type="number"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                    InputProps={{ inputProps: { min: 14, max: 25 } }}
                                />
                                <StyledTextField
                                    fullWidth
                                    label="Country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                />
                                <StyledTextField
                                    fullWidth
                                    label="Education"
                                    name="education"
                                    value={formData.education}
                                    onChange={handleChange}
                                    required
                                />
                                <StyledTextField
                                    fullWidth
                                    label="Audio ID"
                                    name="audioId"
                                    value={formData.audioId}
                                    onChange={handleChange}
                                    required
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isPrivate}
                                            onChange={handleChange}
                                            name="isPrivate"
                                            color="primary"
                                        />
                                    }
                                    label="Private"
                                    sx={{ marginTop: 2 }}
                                />
                                <StyledTextField
                                    fullWidth
                                    label="Bio"
                                    name="bio"
                                    multiline
                                    rows={4}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <GradientButton
                                    type="submit"
                                    fullWidth
                                    disabled={loading}
                                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                                >
                                    {loading ? 'Creating...' : 'Create Girl'}
                                </GradientButton>
                            </Grid>
                        </Grid>
                    </form>
                </GlassCard>
            </Container>
        </Box>
    );
};

export default AddGirl;
