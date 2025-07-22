import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Grid,
    Typography,
    Avatar,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
    LinearProgress,
    Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import MediaTypeSelector from './MediaTypeSelector';
import TweetGenerator from './TweetGenerator';


const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-input': {
        color: 'rgba(15, 23, 42, 0.95)',
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(71, 85, 105, 0.8)',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(203, 213, 225, 0.5)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(148, 163, 184, 0.7)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'rgba(15, 23, 42, 0.8)',
        },
    },
}));

export default function PostForm({ girls, onPostCreated, onGirlSelected, selectedGirl: selectedGirlProp }) {
    const [text, setText] = useState('');
    const [mediaType, setMediaType] = useState('image');
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleGirlChange = (girlId) => {
        if (onGirlSelected) {
            onGirlSelected(girlId);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!selectedGirlProp || !text) {
            setError('Please fill all required fields');
            return;
        }

        if (mediaType !== 'text' && !file) {
            setError('Please select a file');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/v2/posts/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    girlId: selectedGirlProp,
                    text,
                    mediaType
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create post');
            }

            if (mediaType !== 'text') {
                const formData = new FormData();
                formData.append('file', file);

                const uploadResponse = await fetch(data.uploadURL, {
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
                        uploadResult = { result: { uid: data.uploadId, id: data.uploadId } };
                    }
                } catch (parseError) {
                    console.log('Upload response parsing failed, using uploadId from create endpoint');
                    uploadResult = { result: { uid: data.uploadId, id: data.uploadId } };
                }
                
                let mediaUrl;
                if (mediaType === 'video') {
                    const videoId = uploadResult.result.uid || uploadResult.result.id || data.uploadId;
                    mediaUrl = `https://iframe.videodelivery.net/${videoId}`;
                } else {
                    if (uploadResult.result.variants && uploadResult.result.variants.length > 0) {
                        mediaUrl = uploadResult.result.variants.find(v => v.includes('/public')) || uploadResult.result.variants[0];
                    } else {
                        const imageId = uploadResult.result.id;
                        mediaUrl = `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${imageId}/public`;
                    }
                }

                const completeResponse = await fetch('/api/v2/posts/upload-complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        postId: data.postId,
                        uploadId: data.uploadId,
                        mediaUrl
                    })
                });

                if (!completeResponse.ok) {
                    throw new Error('Failed to complete upload');
                }
            }

            setText('');
            setFile(null);
            setFilePreview(null);
            setMediaType('image'); // Reset to default
            setSuccess('Post created successfully!');
            onPostCreated();

        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Clear file when switching to text mode
    useEffect(() => {
        if (mediaType === 'text') {
            setFile(null);
            setFilePreview(null);
        }
    }, [mediaType]);

    const handleTweetGenerated = (tweet) => {
        setText(tweet);
    };

    return (
        <ModernCard variant="elevated" animate={true}>
            <CardContentWrapper>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        mb: 3, 
                        color: 'rgba(15, 23, 42, 0.95)', 
                        fontWeight: 700
                    }}
                >
                    Create Post
                </Typography>
                
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>Select Girl</InputLabel>
                                <Select
                                    value={selectedGirlProp || ''}
                                    onChange={(e) => handleGirlChange(e.target.value)}
                                    sx={{
                                        color: 'rgba(15, 23, 42, 0.95)',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(15, 23, 42, 0.2)',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(15, 23, 42, 0.4)',
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: 'rgba(71, 85, 105, 0.8)',
                                        },
                                    }}
                                >
                                    {girls.map((girl) => (
                                        <MenuItem key={girl.id} value={girl.id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar src={girl.pictureUrl} sx={{ width: 30, height: 30, mr: 1 }} />
                                                {girl.name} (@{girl.username})
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <MediaTypeSelector 
                                mediaType={mediaType} 
                                onChange={setMediaType} 
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <StyledTextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Post Text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            />
                            {mediaType === 'text' && (
                                <Box sx={{ mt: 1, textAlign: 'right' }}>
                                    <TweetGenerator
                                        girlId={selectedGirlProp}
                                        onTweetGenerated={handleTweetGenerated}
                                        disabled={uploading}
                                    />
                                </Box>
                            )}
                        </Grid>

                        {mediaType !== 'text' && (
                            <Grid item xs={12}>
                                <input
                                    type="file"
                                    accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload">
                                    <Button
                                        component="span"
                                        variant="outlined"
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
                                        {file ? file.name : `Choose ${mediaType}`}
                                    </Button>
                                </label>
                            </Grid>
                        )}

                        {filePreview && mediaType !== 'text' && (
                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'center' }}>
                                    {mediaType === 'image' ? (
                                        <img
                                            src={filePreview}
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
                                            src={filePreview}
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
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={uploading}
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
                                {uploading ? 'Creating Post...' : 'Create Post'}
                            </Button>
                            {uploading && <LinearProgress sx={{ mt: 2 }} />}
                        </Grid>
                    </Grid>
                </form>

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            </CardContentWrapper>
        </ModernCard>
    );
}