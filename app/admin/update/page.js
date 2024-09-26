'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/app/store/store';
import { updateGirl } from "@/app/services/girlService";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Card,
    Avatar,
    Grid,
} from '@mui/material';
import { alpha, styled } from "@mui/material/styles";
import CameraAltIcon from '@mui/icons-material/CameraAlt';

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
    const girl = useStore((state) => state.girl);
    const [formData, setFormData] = useState({
        username: '',
        age: '',
        country: '',
        bio: '',
    });
    const [picture, setPicture] = useState(null);
    const [picturePreview, setPicturePreview] = useState('');

    useEffect(() => {
        if (girl) {
            setFormData({
                username: girl.username,
                age: girl.age,
                country: girl.country,
                bio: girl.bio,
            });
            setPicturePreview(`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`);
        }
    }, [girl]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updateData = new FormData();
        Object.keys(formData).forEach(key => {
            updateData.append(key, formData[key]);
        });
        if (picture) {
            updateData.append('picture', picture);
        }

        try {
            await updateGirl(updateData);
            router.push('/novia-virtual');
        } catch (error) {
            console.error('Error updating girl info:', error);
        }
    };

    if (!girl) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: 'linear-gradient(45deg, #343a40 0%, #212529 100%)',
                padding: 2
            }}
        >
            <Container maxWidth="md">
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
                                            onChange={handlePictureChange}
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
                                <StyledTextField
                                    fullWidth
                                    label="Bio"
                                    name="bio"
                                    multiline
                                    rows={4}
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                />
                                <GradientButton type="submit" fullWidth>
                                    Update Profile
                                </GradientButton>
                            </Grid>
                        </Grid>
                    </form>
                </GlassCard>
            </Container>
        </Box>
    );
};

export default UpdateGirlInfo;