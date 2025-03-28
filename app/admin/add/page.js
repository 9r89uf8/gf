// src/components/addPost
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
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';
import { addPost, uploadFileToS3 } from '@/app/services/girlService';
import { useStore } from '@/app/store/store';

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
    const girls = useStore((state) => state.girls);
    const [isPremium, setIsPremium] = useState(false);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedGirl, setSelectedGirl] = useState('');

    const handlePremiumChange = (event) => {
        setIsPremium(event.target.checked);
    };

    const onFinish = async (event) => {
        event.preventDefault();

        if (!selectedGirl) {
            alert('Por favor, selecciona una chica.');
            return;
        }

        let fileKey = null;
        if (image) {
            try {
                fileKey = await uploadFileToS3(image);
            } catch (error) {
                console.error('Error uploading fileee:', error.message);
                alert('File upload failed.');
                return;
            }
        }

        // Now create the post record. Include the file key (or construct a full URL if needed)
        const formData = new FormData();
        formData.append('premium', isPremium ? 'true' : 'false');
        formData.append('description', description);
        formData.append('girlId', selectedGirl);
        // Append the S3 key or URL so your API can record it in Firestore:
        if (fileKey) {
            formData.append('fileKey', fileKey);
        }

        try {
            await addPost(formData);
            // Reset form fields
            setIsPremium(false);
            setDescription('');
            setImage(null);
            setImagePreview(null);
            setSelectedGirl('');
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
                                <FormControl fullWidth required sx={{ marginBottom: 2 }}>
                                    <InputLabel id="select-girl-label" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Seleccionar Chica</InputLabel>
                                    <Select
                                        labelId="select-girl-label"
                                        id="select-girl"
                                        value={selectedGirl}
                                        label="Seleccionar Chica"
                                        onChange={(e) => setSelectedGirl(e.target.value)}
                                        sx={{
                                            color: 'white',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'white',
                                            },
                                            '& .MuiSvgIcon-root': {
                                                color: 'white',
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                            },
                                        }}
                                    >
                                        {girls.map((girl) => (
                                            <MenuItem key={girl.id} value={girl.id}>
                                                <Avatar
                                                    src={'https://d3sog3sqr61u3b.cloudfront.net/'+girl.picture}
                                                    alt={girl.username}
                                                    sx={{ width: 64, height: 64, marginRight: 2 }}
                                                />
                                                {girl.username}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
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