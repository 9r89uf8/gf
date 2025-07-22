'use client';
import React, { useState, useRef } from 'react';
import { 
    TextField, 
    Button, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Box, 
    Typography, 
    Alert, 
    LinearProgress,
    FormControlLabel,
    Switch,
    Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoIcon from '@mui/icons-material/Photo';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import StarIcon from '@mui/icons-material/Star';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import VisibilityIcon from '@mui/icons-material/Visibility';

const MediaTypeButton = styled(Button)(({ theme, selected }) => ({
    flex: 1,
    padding: theme.spacing(2),
    borderRadius: 25,
    background: selected 
        ? 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)' 
        : 'transparent',
    border: selected 
        ? 'none' 
        : '2px solid rgba(15, 23, 42, 0.2)',
    color: selected ? '#ffffff' : 'rgba(15, 23, 42, 0.7)',
    fontWeight: 600,
    '&:hover': {
        background: selected 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)' 
            : 'rgba(15, 23, 42, 0.05)',
        borderColor: selected ? 'transparent' : 'rgba(15, 23, 42, 0.3)',
    },
    transition: 'all 0.3s ease',
}));

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

export default function GalleryForm({ girls, onItemCreated, onGirlSelected, selectedGirl }) {
    const [mediaType, setMediaType] = useState('image');
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [isPremium, setIsPremium] = useState(false);
    const [overlayText, setOverlayText] = useState('');
    const [displayToGallery, setDisplayToGallery] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    const handleGirlChange = (e) => {
        onGirlSelected(e.target.value);
    };

    const handleMediaTypeChange = (type) => {
        setMediaType(type);
        setSelectedFile(null);
        setPreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!selectedGirl) {
            setError('Please select a girl');
            return;
        }
        if (!overlayText) {
            setError('Please add text');
            return;
        }

        if (!selectedFile) {
            setError('Please select a file to upload');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Step 1: Create gallery item and get upload URL
            const createResponse = await fetch('/api/v2/gallery/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    girlId: selectedGirl,
                    mediaType,
                    isPremium,
                    text: overlayText.trim(),
                    displayToGallery
                })
            });

            if (!createResponse.ok) {
                const errorData = await createResponse.json();
                throw new Error(errorData.error || 'Failed to create gallery item');
            }

            const { itemId, uploadURL, uploadId } = await createResponse.json();

            // Step 2: Upload file to Cloudflare
            const formData = new FormData();
            formData.append('file', selectedFile);

            const uploadResponse = await fetch(uploadURL, {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload file to Cloudflare');
            }

            let uploadResult;
            try {
                const responseText = await uploadResponse.text();
                if (responseText) {
                    uploadResult = JSON.parse(responseText);
                } else {
                    uploadResult = { result: { uid: uploadId, id: uploadId } };
                }
            } catch (parseError) {
                console.log('Upload response parsing failed, using uploadId from create endpoint');
                uploadResult = { result: { uid: uploadId, id: uploadId } };
            }

            // Step 3: Process media URL based on type
            let mediaUrl;
            if (mediaType === 'video') {
                const videoId = uploadResult.result?.uid || uploadResult.result?.id || uploadId;
                mediaUrl = `https://iframe.videodelivery.net/${videoId}`;
            } else {
                if (uploadResult.result?.variants && uploadResult.result.variants.length > 0) {
                    mediaUrl = uploadResult.result.variants.find(v => v.includes('/public')) || uploadResult.result.variants[0];
                } else {
                    const imageId = uploadResult.result?.id || uploadId;
                    mediaUrl = `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${imageId}/public`;
                }
            }

            // Step 4: Complete the upload
            const completeResponse = await fetch('/api/v2/gallery/upload-complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemId,
                    uploadId,
                    mediaUrl
                })
            });

            if (!completeResponse.ok) {
                const errorData = await completeResponse.json();
                throw new Error(errorData.error || 'Failed to complete upload');
            }

            setSuccess('Gallery item uploaded successfully!');
            setSelectedFile(null);
            setPreview('');
            setIsPremium(false);
            setOverlayText('');
            setDisplayToGallery(true);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            onItemCreated();

        } catch (error) {
            console.error('Upload error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModernCard variant="elevated" animate={true}>
            <CardContentWrapper>
                <Typography variant="h5" sx={{ mb: 3, color: 'rgba(15, 23, 42, 0.95)', fontWeight: 700 }}>
                    Add Gallery Item
                </Typography>

                {/* Girl Selection */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>Select Girl</InputLabel>
                    <Select
                        value={selectedGirl}
                        onChange={handleGirlChange}
                        sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(15, 23, 42, 0.2)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(15, 23, 42, 0.4)',
                            },
                            '& .MuiSvgIcon-root': {
                                color: 'rgba(71, 85, 105, 0.8)',
                            }
                        }}
                    >
                        {girls.map((girl) => (
                            <MenuItem key={girl.id} value={girl.id}>
                                {girl.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Media Type Selection */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'rgba(71, 85, 105, 0.8)' }}>
                        Media Type
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <MediaTypeButton
                            selected={mediaType === 'image'}
                            onClick={() => handleMediaTypeChange('image')}
                            startIcon={<PhotoIcon />}
                        >
                            Image
                        </MediaTypeButton>
                        <MediaTypeButton
                            selected={mediaType === 'video'}
                            onClick={() => handleMediaTypeChange('video')}
                            startIcon={<VideoFileIcon />}
                        >
                            Video
                        </MediaTypeButton>
                    </Stack>
                </Box>

                {/* Premium Toggle */}
                <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                        control={
                            <PremiumSwitch
                                checked={isPremium}
                                onChange={(e) => setIsPremium(e.target.checked)}
                            />
                        }
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <StarIcon sx={{ color: isPremium ? '#FFD700' : 'rgba(71, 85, 105, 0.5)', fontSize: 20 }} />
                                <Typography sx={{ color: 'rgba(15, 23, 42, 0.95)' }}>
                                    Premium Content
                                </Typography>
                            </Box>
                        }
                    />
                </Box>

                {/* Text  Description*/}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Overlay Text (Required)"
                        value={overlayText}
                        onChange={(e) => setOverlayText(e.target.value)}
                        placeholder="Enter text"
                        InputProps={{
                            startAdornment: <TextFieldsIcon sx={{ mr: 1, color: 'rgba(71, 85, 105, 0.5)' }} />
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                '& fieldset': {
                                    borderColor: 'rgba(15, 23, 42, 0.2)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(15, 23, 42, 0.4)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(71, 85, 105, 0.8)',
                            }
                        }}
                    />
                </Box>

                {/* Display Toggle */}
                <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={displayToGallery}
                                onChange={(e) => setDisplayToGallery(e.target.checked)}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#1a1a1a',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#1a1a1a',
                                    }
                                }}
                            />
                        }
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <VisibilityIcon sx={{ color: displayToGallery ? '#1a1a1a' : 'rgba(71, 85, 105, 0.5)', fontSize: 20 }} />
                                <Typography sx={{ color: 'rgba(15, 23, 42, 0.95)' }}>
                                    Display in Gallery
                                </Typography>
                            </Box>
                        }
                    />
                </Box>

                {/* File Upload */}
                <Box sx={{ mb: 3 }}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                        id="file-upload"
                    />
                    <label htmlFor="file-upload">
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<CloudUploadIcon />}
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
                            {selectedFile ? selectedFile.name : `Choose ${mediaType === 'image' ? 'Image' : 'Video'}`}
                        </Button>
                    </label>
                </Box>

                {/* Preview */}
                {preview && (
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        {mediaType === 'image' ? (
                            <img 
                                src={preview} 
                                alt="Preview" 
                                style={{ 
                                    maxWidth: '100%', 
                                    maxHeight: 200, 
                                    borderRadius: 12,
                                    border: '2px solid rgba(15, 23, 42, 0.1)',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }} 
                            />
                        ) : (
                            <video 
                                src={preview} 
                                controls 
                                style={{ 
                                    maxWidth: '100%', 
                                    maxHeight: 200, 
                                    borderRadius: 12,
                                    border: '2px solid rgba(15, 23, 42, 0.1)',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }} 
                            />
                        )}
                    </Box>
                )}

                {/* Submit Button */}
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={loading || !selectedGirl || !selectedFile}
                    sx={{
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                        color: '#ffffff',
                        borderRadius: 25,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
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
                    {loading ? 'Uploading...' : 'Upload to Gallery'}
                </Button>

                {loading && <LinearProgress sx={{ mt: 2 }} />}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            </CardContentWrapper>
        </ModernCard>
    );
}