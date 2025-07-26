'use client';
import React, { useState, useRef } from 'react';
import {
    TextField,
    Button,
    FormControlLabel,
    Switch,
    Box,
    Typography,
    Alert,
    LinearProgress,
    Stack,
    Grid,
    InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoIcon from '@mui/icons-material/Photo';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import StarIcon from '@mui/icons-material/Star';
import { useRouter } from 'next/navigation';

const PremiumSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: '#FFD700',
        '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.08)',
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#FFD700',
    },
}));

const ToggleSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: '#1a1a1a',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#1a1a1a',
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    color: 'rgba(15, 23, 42, 0.95)',
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    borderBottom: '2px solid rgba(15, 23, 42, 0.1)',
    paddingBottom: theme.spacing(1),
}));

const ImagePreviewBox = styled(Box)(({ theme }) => ({
    width: '100%',
    height: 200,
    border: '2px dashed rgba(15, 23, 42, 0.2)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '&:hover': {
        borderColor: 'rgba(15, 23, 42, 0.4)',
        backgroundColor: 'rgba(15, 23, 42, 0.02)',
    },
}));

export default function CreateGirlForm() {
    const router = useRouter();
    const profileImageRef = useRef(null);
    const backgroundImageRef = useRef(null);
    const audioFilesRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        // Basic Info
        username: '',
        name: '',
        fullName: '',
        age: '',
        country: '',
        bio: '',
        
        // Feature Toggles
        private: false,
        premium: false,
        audioEnabled: false,
        imagesEnabled: false,
        videosEnabled: false,
        
        // Personal Info
        birthDate: '',
        instagram: '',
        brothers: '',
        mom: '',
        dad: '',
        sexHistory: '',
        
        // Technical
        audioId: '',
        priority: '5',
        
        // AI Prompts
        bioPrompt: '',
        physicalAttributes: '',
        slang: '',
    });

    // File state
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState('');
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [backgroundImagePreview, setBackgroundImagePreview] = useState('');
    const [audioFiles, setAudioFiles] = useState([]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleProfileImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBackgroundImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackgroundImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackgroundImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAudioFilesSelect = (e) => {
        const files = Array.from(e.target.files);
        setAudioFiles(files);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Validate required fields
            if (!formData.username || !formData.name || !formData.fullName || !formData.age || !formData.country || !formData.bio) {
                throw new Error('Please fill in all required fields');
            }

            if (!profileImage) {
                throw new Error('Please select a profile image');
            }

            if (!backgroundImage) {
                throw new Error('Please select a background image');
            }

            // Create FormData for multipart upload
            const submitData = new FormData();
            
            // Add all text fields
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });

            // Add files
            submitData.append('profileImage', profileImage);
            submitData.append('backgroundImage', backgroundImage);
            
            // Add audio files
            audioFiles.forEach((file, index) => {
                submitData.append(`audioFile${index}`, file);
            });
            submitData.append('audioFileCount', audioFiles.length.toString());

            // Submit to API
            const response = await fetch('/api/v2/admin/create-girl', {
                method: 'POST',
                body: submitData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create girl');
            }

            setSuccess('Girl created successfully!');
            
            // Reset form
            setFormData({
                username: '',
                name: '',
                fullName: '',
                age: '',
                country: '',
                bio: '',
                private: false,
                premium: false,
                audioEnabled: false,
                imagesEnabled: false,
                videosEnabled: false,
                birthDate: '',
                instagram: '',
                brothers: '',
                mom: '',
                dad: '',
                sexHistory: '',
                audioId: '',
                priority: '5',
                bioPrompt: '',
                physicalAttributes: '',
                slang: '',
            });
            setProfileImage(null);
            setProfileImagePreview('');
            setBackgroundImage(null);
            setBackgroundImagePreview('');
            setAudioFiles([]);

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/admin/posts');
            }, 2000);

        } catch (error) {
            console.error('Create girl error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModernCard variant="elevated" animate={true}>
            <CardContentWrapper>
                <Stack spacing={4}>
                    {/* Basic Information Section */}
                    <Box>
                        <SectionTitle variant="h5">Basic Information</SectionTitle>
                        <Grid container spacing={2}>
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Username *"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    helperText="Will be converted to lowercase"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Display Name *"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    helperText="Will be converted to lowercase"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Full Name *"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Arely Ruiz"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Age *"
                                    name="age"
                                    type="number"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Country *"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Mexico"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Priority"
                                    name="priority"
                                    type="number"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                    helperText="1-10, affects display order"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Bio *"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={3}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Feature Toggles Section */}
                    <Box>
                        <SectionTitle variant="h5">Features & Access</SectionTitle>
                        <Grid container spacing={2}>
                            <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                                <FormControlLabel
                                    control={
                                        <ToggleSwitch
                                            checked={formData.private}
                                            onChange={handleInputChange}
                                            name="private"
                                        />
                                    }
                                    label="Private (Coming Soon)"
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                                <FormControlLabel
                                    control={
                                        <PremiumSwitch
                                            checked={formData.premium}
                                            onChange={handleInputChange}
                                            name="premium"
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <StarIcon sx={{ color: formData.premium ? '#FFD700' : 'rgba(71, 85, 105, 0.5)', fontSize: 20 }} />
                                            Premium
                                        </Box>
                                    }
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                                <FormControlLabel
                                    control={
                                        <ToggleSwitch
                                            checked={formData.audioEnabled}
                                            onChange={handleInputChange}
                                            name="audioEnabled"
                                        />
                                    }
                                    label="Audio Messages"
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                                <FormControlLabel
                                    control={
                                        <ToggleSwitch
                                            checked={formData.imagesEnabled}
                                            onChange={handleInputChange}
                                            name="imagesEnabled"
                                        />
                                    }
                                    label="Image Messages"
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                                <FormControlLabel
                                    control={
                                        <ToggleSwitch
                                            checked={formData.videosEnabled}
                                            onChange={handleInputChange}
                                            name="videosEnabled"
                                        />
                                    }
                                    label="Video Messages"
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Personal Information Section */}
                    <Box>
                        <SectionTitle variant="h5">Personal Information</SectionTitle>
                        <Grid container spacing={2}>
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Birth Date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 6 de octubre"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Instagram Username"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">@</InputAdornment>,
                                    }}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Brothers/Siblings"
                                    name="brothers"
                                    value={formData.brothers}
                                    onChange={handleInputChange}
                                    placeholder="e.g., I have 3 brothers"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Mother"
                                    name="mom"
                                    value={formData.mom}
                                    onChange={handleInputChange}
                                    placeholder="e.g., My mom is..."
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Father"
                                    name="dad"
                                    value={formData.dad}
                                    onChange={handleInputChange}
                                    placeholder="e.g., My dad's name is..."
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Sexual History"
                                    name="sexHistory"
                                    value={formData.sexHistory}
                                    onChange={handleInputChange}
                                    placeholder="e.g., I had sex 2 times"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Technical Settings Section */}
                    <Box>
                        <SectionTitle variant="h5">Technical Settings</SectionTitle>
                        <TextField
                            fullWidth
                            label="ElevenLabs Audio ID"
                            name="audioId"
                            value={formData.audioId}
                            onChange={handleInputChange}
                            helperText="Voice ID from ElevenLabs for audio generation"
                            sx={{ mb: 2 }}
                        />
                    </Box>

                    {/* AI Prompts Section */}
                    <Box>
                        <SectionTitle variant="h5">AI Prompts & Personality</SectionTitle>
                        <Grid container spacing={2}>
                            <Grid item size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Bio Prompt"
                                    name="bioPrompt"
                                    value={formData.bioPrompt}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={3}
                                    helperText="Instructions for AI to generate personalized bio content"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Physical Attributes"
                                    name="physicalAttributes"
                                    value={formData.physicalAttributes}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={2}
                                    helperText="Physical characteristics for image generation (e.g., hair color, eye color, body type)"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Slang & Speaking Style"
                                    name="slang"
                                    value={formData.slang}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={2}
                                    helperText="Specific slang words, phrases, or speaking patterns to use"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Media Upload Section */}
                    <Box>
                        <SectionTitle variant="h5">Media Files</SectionTitle>
                        <Grid container spacing={2}>
                            {/* Profile Image */}
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle1" sx={{ mb: 1, color: 'rgba(71, 85, 105, 0.8)' }}>
                                    Profile Image *
                                </Typography>
                                <input
                                    ref={profileImageRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleProfileImageSelect}
                                    id="profile-image-upload"
                                />
                                <label htmlFor="profile-image-upload">
                                    <ImagePreviewBox
                                        sx={{
                                            backgroundImage: profileImagePreview ? `url(${profileImagePreview})` : 'none',
                                        }}
                                    >
                                        {!profileImagePreview && (
                                            <Stack alignItems="center" spacing={1}>
                                                <PhotoIcon sx={{ fontSize: 40, color: 'rgba(71, 85, 105, 0.5)' }} />
                                                <Typography color="textSecondary">Click to upload profile image</Typography>
                                            </Stack>
                                        )}
                                    </ImagePreviewBox>
                                </label>
                            </Grid>

                            {/* Background Image */}
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle1" sx={{ mb: 1, color: 'rgba(71, 85, 105, 0.8)' }}>
                                    Background Image *
                                </Typography>
                                <input
                                    ref={backgroundImageRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleBackgroundImageSelect}
                                    id="background-image-upload"
                                />
                                <label htmlFor="background-image-upload">
                                    <ImagePreviewBox
                                        sx={{
                                            backgroundImage: backgroundImagePreview ? `url(${backgroundImagePreview})` : 'none',
                                        }}
                                    >
                                        {!backgroundImagePreview && (
                                            <Stack alignItems="center" spacing={1}>
                                                <PhotoIcon sx={{ fontSize: 40, color: 'rgba(71, 85, 105, 0.5)' }} />
                                                <Typography color="textSecondary">Click to upload background image</Typography>
                                            </Stack>
                                        )}
                                    </ImagePreviewBox>
                                </label>
                            </Grid>

                            {/* Audio Files */}
                            <Grid item size={{ xs: 12 }}>
                                <Typography variant="subtitle1" sx={{ mb: 1, color: 'rgba(71, 85, 105, 0.8)' }}>
                                    Audio Files (Optional)
                                </Typography>
                                <input
                                    ref={audioFilesRef}
                                    type="file"
                                    accept="audio/*"
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={handleAudioFilesSelect}
                                    id="audio-files-upload"
                                />
                                <label htmlFor="audio-files-upload">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        startIcon={<AudiotrackIcon />}
                                        fullWidth
                                        sx={{
                                            borderColor: 'rgba(15, 23, 42, 0.2)',
                                            color: 'rgba(15, 23, 42, 0.9)',
                                            borderRadius: 25,
                                            py: 1.5,
                                            fontWeight: 600,
                                            '&:hover': {
                                                borderColor: 'rgba(15, 23, 42, 0.4)',
                                                background: 'rgba(15, 23, 42, 0.05)',
                                            }
                                        }}
                                    >
                                        {audioFiles.length > 0 
                                            ? `${audioFiles.length} audio file(s) selected` 
                                            : 'Click to upload audio files'
                                        }
                                    </Button>
                                </label>
                                {audioFiles.length > 0 && (
                                    <Box sx={{ mt: 1 }}>
                                        {audioFiles.map((file, index) => (
                                            <Typography key={index} variant="body2" color="textSecondary">
                                                • {file.name}
                                            </Typography>
                                        ))}
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Submit Button */}
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading}
                        startIcon={loading ? null : <CloudUploadIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                            color: '#ffffff',
                            borderRadius: 25,
                            py: 2,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                            },
                            '&:disabled': {
                                background: 'rgba(15, 23, 42, 0.1)',
                                color: 'rgba(15, 23, 42, 0.4)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {loading ? 'Creating Girl...' : 'Create Girl'}
                    </Button>

                    {loading && <LinearProgress />}
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}
                </Stack>
            </CardContentWrapper>
        </ModernCard>
    );
}