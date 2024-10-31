// src/components/Girls/UpdateGirlInfo.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/app/store/store';
import { getGirl, updateGirl } from "@/app/services/girlService";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Card,
    Avatar,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    FormControl,
    FormLabel,
    IconButton,
    ListItemSecondaryAction, FormControlLabel, Switch,
} from '@mui/material';
import { alpha, styled } from "@mui/material/styles";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';

// Styled Components
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

const UpdateGirlInfo = () => {
    const router = useRouter();
    const girls = useStore((state) => state.girls);
    const selectedGirl = useStore((state) => state.girl);

    // Updated formData state with 'priority' and 'audios'
    const [formData, setFormData] = useState({
        username: '',
        age: '',
        country: '',
        bio: '',
        priority: 1,  // Default priority value
        audios: [],   // Array to hold new audio files
        fullName: '',
        audioEnabled: false,
        imagesEnabled: false,
        videosEnabled: false,
        birthDate: '',
        brothers: '',
        instagram: '',
        mom: '',
        dad: '',
        sexActivity: '',
        sexHistory: '',
        audioId: '',
        sexStory: '',
        name: ''
    });
    const [existingAudioFiles, setExistingAudioFiles] = useState([]); // Existing audio files
    const [audioFilesToRemove, setAudioFilesToRemove] = useState([]); // Audio files marked for removal
    const [picture, setPicture] = useState(null);
    const [background, setBackground] = useState(null);
    const [picturePreview, setPicturePreview] = useState('');
    const [backgroundPreview, setBackgroundPreview] = useState('');
    const [loading, setLoading] = useState(false);

    // Populate form when a girl is selected
    useEffect(() => {
        if (selectedGirl) {
            setFormData({
                username: selectedGirl.username,
                age: selectedGirl.age,
                country: selectedGirl.country,
                bio: selectedGirl.bio,
                priority: selectedGirl.priority || 1,
                audios: [], // Start with an empty array for new uploads
                fullName: selectedGirl.fullName,
                birthDate: selectedGirl.birthDate,
                audioId: selectedGirl.audioId,
                brothers: selectedGirl.brothers,
                instagram: selectedGirl.instagram,
                audioEnabled: selectedGirl.audioEnabled,
                imagesEnabled: selectedGirl.imagesEnabled,
                videosEnabled: selectedGirl.videosEnabled,
                mom: selectedGirl.mom,
                dad: selectedGirl.dad,
                sexActivity: selectedGirl.sexActivity,
                sexHistory: selectedGirl.sexHistory,
                sexStory: selectedGirl.sexStory,
                name: selectedGirl.name
            });
            setPicturePreview(`https://d3sog3sqr61u3b.cloudfront.net/${selectedGirl.picture}`);
            setBackgroundPreview(`https://d3sog3sqr61u3b.cloudfront.net/${selectedGirl.background}`);
            setExistingAudioFiles(selectedGirl.audioFiles || []); // Set existing audio files
            setAudioFilesToRemove([]); // Reset the list of audio files to remove
        }
    }, [selectedGirl]);

    // Handle girl selection
    const handleSelectGirl = async (girlId) => {
        setLoading(true);
        try {
            await getGirl({ id: girlId }); // Assuming getGirl updates the store
        } catch (error) {
            console.error('Error fetching girl:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes with parsing for 'priority'
    const handleInputChange = (e) => {
        const {  name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'priority' ? parseInt(value) : value,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle picture changes
    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPicture(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle background picture changes
    const handleBackgroundChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackground(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackgroundPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle audio files input changes
    const handleAudioFilesChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prevState => ({
            ...prevState,
            audios: files
        }));
    };

    // Handle removal of existing audio files
    const handleRemoveAudioFile = (index) => {
        const fileToRemove = existingAudioFiles[index];
        setAudioFilesToRemove(prev => [...prev, fileToRemove]);
        setExistingAudioFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedGirl) {
            alert("Please select a girl to update.");
            return;
        }

        const updateData = new FormData();
        // Append formData fields except 'audios'
        Object.keys(formData).forEach(key => {
            if (key !== 'audios') {
                updateData.append(key, formData[key]);
            }
        });
        // Append new audio files
        if (formData.audios && formData.audios.length > 0) {
            formData.audios.forEach((audioFile) => {
                updateData.append('audios[]', audioFile);
            });
        }
        if (picture) {
            updateData.append('image', picture);
        }
        if (background) {
            updateData.append('background', background);
        }
        updateData.append('girlId', selectedGirl.id);

        updateData.append('audioEnabled', formData.audioEnabled.toString());
        updateData.append('imagesEnabled', formData.imagesEnabled.toString());
        updateData.append('videosEnabled', formData.videosEnabled.toString());


        // Append audio files to remove
        if (audioFilesToRemove.length > 0) {
            audioFilesToRemove.forEach((audioUrl) => {
                updateData.append('audioFilesToRemove[]', audioUrl);
            });
        }

        try {
            await updateGirl(updateData); // Pass the girl ID and data
            router.push('/'); // Redirect after successful update
        } catch (error) {
            console.error('Error updating girl info:', error);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: 'linear-gradient(45deg, #343a40 0%, #212529 100%)',
                padding: 2
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Girls List */}
                    <Grid item xs={12} md={4}>
                        <GlassCard elevation={4}>
                            <Typography variant="h5" gutterBottom sx={{ color: 'white', marginBottom: 2 }}>
                                Girls List
                            </Typography>
                            <List>
                                {girls.map(girl => (
                                    <React.Fragment key={girl.id}>
                                        <ListItem button onClick={() => handleSelectGirl(girl.id)} selected={selectedGirl?.id === girl.id}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                                                    alt={girl.username}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={girl.username}
                                                secondary={`Age: ${girl.age}, Country: ${girl.country}`}
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                    </React.Fragment>
                                ))}
                            </List>
                            {loading && <Typography>Loading selected girl...</Typography>}
                        </GlassCard>
                    </Grid>

                    {/* Update Form */}
                    <Grid item xs={12} md={8}>
                        {selectedGirl ? (
                            <GlassCard elevation={4}>
                                <Typography variant="h4" gutterBottom sx={{ color: 'white', marginBottom: 3 }}>
                                    Update Profile
                                </Typography>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} md={4}>
                                            <Box position="relative" display="inline-block">
                                                <StyledAvatar
                                                    src={picturePreview}
                                                    alt={formData.username}
                                                />
                                                <img src={backgroundPreview} alt="foto" style={{width: 150, marginTop:10}}/>
                                                <Button
                                                    component="label"
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 100,
                                                        right: 5,
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
                                                        onChange={handlePictureChange}
                                                        accept="image/*"
                                                    />
                                                </Button>
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
                                                        onChange={handleBackgroundChange}
                                                        accept="image/*"
                                                    />
                                                </Button>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <StyledTextField
                                                fullWidth
                                                label="Username"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                            />
                                            <StyledTextField
                                                fullWidth
                                                label="fullName"
                                                name="fullname"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                            />
                                            <StyledTextField
                                                fullWidth
                                                label="Audio Id"
                                                name="audioId"
                                                value={formData.audioId}
                                                onChange={handleInputChange}
                                            />
                                            <StyledTextField
                                                fullWidth
                                                label="birthDate"
                                                name="birthDate"
                                                value={formData.birthDate}
                                                onChange={handleInputChange}
                                            />
                                            <StyledTextField
                                                fullWidth
                                                label="brothers"
                                                name="brothers"
                                                multiline
                                                rows={4}
                                                value={formData.brothers}
                                                onChange={handleInputChange}
                                            />
                                            <StyledTextField
                                                fullWidth
                                                label="instagram"
                                                name="instagram"
                                                value={formData.instagram}
                                                onChange={handleInputChange}
                                            />
                                            <StyledTextField
                                                fullWidth
                                                label="mom"
                                                name="mom"
                                                value={formData.mom}
                                                onChange={handleInputChange}
                                            />
                                            <StyledTextField
                                                fullWidth
                                                label="dad"
                                                name="dad"
                                                value={formData.dad}
                                                onChange={handleInputChange}
                                            />
                                            <StyledTextField
                                                fullWidth
                                                label="sexActivity"
                                                name="sexActivity"
                                                multiline
                                                rows={8}
                                                value={formData.sexActivity}
                                                onChange={handleInputChange}
                                            />
                                            <StyledTextField
                                                fullWidth
                                                label="sexHistory"
                                                name="sexHistory"
                                                multiline
                                                rows={8}
                                                value={formData.sexHistory}
                                                onChange={handleInputChange}
                                            />
                                            <StyledTextField
                                                fullWidth
                                                label="sexStory"
                                                name="sexStory"
                                                multiline
                                                rows={8}
                                                value={formData.sexStory}
                                                onChange={handleInputChange}
                                            />
                                            <StyledTextField
                                                fullWidth
                                                label="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />

                                            <StyledTextField
                                                fullWidth
                                                label="Age"
                                                name="age"
                                                type="number"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                            />
                                            <StyledTextField
                                                fullWidth
                                                label="Country"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={formData.imagesEnabled}
                                                        onChange={handleInputChange}
                                                        name="imagesEnabled"
                                                        color="primary"
                                                    />
                                                }
                                                label="imagesEnabled"
                                                sx={{ marginTop: 2 }}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={formData.audioEnabled}
                                                        onChange={handleInputChange}
                                                        name="audioEnabled"
                                                        color="primary"
                                                    />
                                                }
                                                label="audioEnabled"
                                                sx={{ marginTop: 2 }}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={formData.videosEnabled}
                                                        onChange={handleInputChange}
                                                        name="videosEnabled"
                                                        color="primary"
                                                    />
                                                }
                                                label="videosEnabled"
                                                sx={{ marginTop: 2 }}
                                            />
                                            <StyledTextField
                                                fullWidth
                                                label="Bio"
                                                name="bio"
                                                multiline
                                                rows={4}
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                            />
                                            {/* Priority Field */}
                                            <StyledTextField
                                                fullWidth
                                                label="Priority"
                                                name="priority"
                                                type="number"
                                                value={formData.priority}
                                                onChange={handleInputChange}
                                                InputProps={{ inputProps: { min: 1, max: 9 } }}
                                            />

                                            {/* Audio Files Upload */}
                                            <FormControl fullWidth sx={{ marginTop: 2 }}>
                                                <FormLabel sx={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: 1 }}>Upload New Audios</FormLabel>
                                                <Button
                                                    variant="contained"
                                                    component="label"
                                                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                                                >
                                                    Select Audio Files
                                                    <input
                                                        type="file"
                                                        accept="audio/*"
                                                        multiple
                                                        hidden
                                                        onChange={handleAudioFilesChange}
                                                    />
                                                </Button>
                                                {/* Display selected audio file names */}
                                                {formData.audios.length > 0 && (
                                                    <Box sx={{ marginTop: 2 }}>
                                                        {formData.audios.map((file, index) => (
                                                            <Typography key={index} sx={{ color: 'white' }}>
                                                                {file.name}
                                                            </Typography>
                                                        ))}
                                                    </Box>
                                                )}
                                            </FormControl>

                                            {/* Display existing audio files with remove option */}
                                            {existingAudioFiles.length > 0 && (
                                                <Box sx={{ marginTop: 2 }}>
                                                    <Typography sx={{ color: 'white' }}>Existing Audio Files:</Typography>
                                                    <List>
                                                        {existingAudioFiles.map((url, index) => (
                                                            <ListItem key={index} sx={{ color: 'white' }}>
                                                                <ListItemText primary={url} />
                                                                <ListItemSecondaryAction>
                                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveAudioFile(index)}>
                                                                        <DeleteIcon sx={{ color: 'white' }} />
                                                                    </IconButton>
                                                                </ListItemSecondaryAction>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>
                                            )}

                                            <GradientButton type="submit" fullWidth>
                                                Update Profile
                                            </GradientButton>
                                        </Grid>
                                    </Grid>
                                </form>
                            </GlassCard>
                        ) : (
                            <GlassCard elevation={4}>
                                <Typography variant="h6" sx={{ color: 'white' }}>
                                    Please select a girl from the list to update her profile.
                                </Typography>
                            </GlassCard>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default UpdateGirlInfo;
