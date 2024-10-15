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
} from '@mui/material';
import { alpha, styled } from "@mui/material/styles";
import CameraAltIcon from '@mui/icons-material/CameraAlt';

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
    const girls = useStore((state) => state.girls); // List of girls
    const selectedGirl = useStore((state) => state.girl); // Currently selected girl
    const setSelectedGirl = useStore((state) => state.setGirl); // Function to set the selected girl

    const [formData, setFormData] = useState({
        username: '',
        age: '',
        country: '',
        bio: '',
    });
    const [picture, setPicture] = useState(null);
    const [picturePreview, setPicturePreview] = useState('');
    const [loading, setLoading] = useState(false);

    // Populate form when a girl is selected
    useEffect(() => {
        if (selectedGirl) {
            setFormData({
                username: selectedGirl.username,
                age: selectedGirl.age,
                country: selectedGirl.country,
                bio: selectedGirl.bio,
            });
            setPicturePreview(`https://d3sog3sqr61u3b.cloudfront.net/${selectedGirl.picture}`);
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

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedGirl) {
            alert("Please select a girl to update.");
            return;
        }

        const updateData = new FormData();
        Object.keys(formData).forEach(key => {
            updateData.append(key, formData[key]);
        });
        if (picture) {
            updateData.append('image', picture);
        }
        updateData.append('girlId', selectedGirl.id)

        try {
            await updateGirl(updateData); // Pass the girl ID and data
            router.push('/novia-virtual'); // Redirect after successful update
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
