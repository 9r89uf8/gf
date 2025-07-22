// app/profile/components/ProfileEditForm.jsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Box, Avatar } from '@mui/material';
import { Save, Close, PhotoCamera } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { editUser } from "@/app/services/authService";

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& label': {
        color: 'rgba(71, 85, 105, 0.8)',
    },
    '& label.Mui-focused': {
        color: '#1a1a1a',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.2)',
            borderWidth: '2px',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.3)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#1a1a1a',
            borderWidth: '2px',
        },
        '& input': {
            color: 'rgba(15, 23, 42, 0.95)',
        }
    }
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
    margin: theme.spacing(1),
    borderRadius: 12,
    padding: '10px 24px',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    
    ...(variant === 'contained' && {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
        color: 'white',
        boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.2)',
        '&:hover': {
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.3)',
        },
        '&:disabled': {
            background: 'rgba(0, 0, 0, 0.12)',
            color: 'rgba(0, 0, 0, 0.26)',
        },
    }),
    
    ...(variant === 'outlined' && {
        border: '2px solid rgba(0, 0, 0, 0.2)',
        color: 'rgba(15, 23, 42, 0.95)',
        '&:hover': {
            border: '2px solid rgba(0, 0, 0, 0.4)',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
    }),
}));

const ProfileEditForm = ({ user, onSave, onCancel }) => {
    const [newUserInfo, setNewUserInfo] = useState({ ...user });
    const [image, setImage] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState(null);
    const fileInputRef = useRef(null);
    const turnstileContainerRef = useRef(null);
    const turnstileWidgetId = useRef(null);

    useEffect(() => {
        // Turnstile integration
        if (turnstileContainerRef.current && window.turnstile) {
            if (!turnstileWidgetId.current) {
                try {
                    const widgetId = window.turnstile.render(turnstileContainerRef.current, {
                        sitekey: '0x4AAAAAAA_HdjBUf9sbezTK',
                        callback: (token) => {
                            setTurnstileToken(token);
                        },
                        'error-callback': (errorCode) => {
                            console.error(`Turnstile error: ${errorCode}`);
                        },
                    });
                    turnstileWidgetId.current = widgetId;
                } catch (error) {
                    console.error("Error rendering Turnstile:", error);
                }
            }
        }

        return () => {
            if (turnstileWidgetId.current && window.turnstile) {
                window.turnstile.remove(turnstileWidgetId.current);
                turnstileWidgetId.current = null;
                setTurnstileToken(null);
            }
        };
    }, []);

    const handleInputChange = (e) => {
        setNewUserInfo({ ...newUserInfo, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewUserInfo(prevState => ({ ...prevState, profilePic: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!turnstileToken) {
            alert("Please complete the security check.");
            return;
        }

        setIsUpdating(true);
        const formData = new FormData();
        formData.append('name', newUserInfo.name);
        formData.append('email', newUserInfo.email);
        formData.append('turnstileToken', turnstileToken);

        if (image) {
            formData.append('image', image);
        }

        try {
            const updatedUser = await editUser(formData);
            onSave(updatedUser);
        } catch (error) {
            console.error('Error updating user profile:', error);
            alert(`Failed to update profile: ${error.message || 'Unknown error'}`);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>
            <Avatar
                src={newUserInfo.profilePic || ''}
                alt={newUserInfo.name}
                sx={{ 
                    width: 100, 
                    height: 100, 
                    margin: 'auto', 
                    mb: 2, 
                    border: '3px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.1)'
                }}
            />
            <input
                accept="image/*"
                style={{ display: 'none' }}
                id="icon-button-file"
                type="file"
                onChange={handleImageChange}
                ref={fileInputRef}
            />
            <label htmlFor="icon-button-file">
                <Button
                    variant="contained"
                    component="span"
                    startIcon={<PhotoCamera />}
                    sx={{ 
                        mb: 2,
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                        color: 'white',
                        borderRadius: '12px',
                        padding: '10px 24px',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                        },
                    }}
                >
                    Cambiar foto de perfil
                </Button>
            </label>
            <StyledTextField
                fullWidth
                name="name"
                label="Nombre"
                value={newUserInfo.name}
                onChange={handleInputChange}
                InputLabelProps={{ style: { color: 'rgba(71, 85, 105, 0.8)' } }}
            />
            <StyledTextField
                fullWidth
                name="email"
                label="Correo electrónico"
                value={newUserInfo.email}
                onChange={handleInputChange}
                InputLabelProps={{ style: { color: 'rgba(71, 85, 105, 0.8)' } }}
            />

            <Box
                ref={turnstileContainerRef}
                id="turnstile-widget-container"
                sx={{ my: 2, display: 'flex', justifyContent: 'center' }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <ActionButton
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={isUpdating || !turnstileToken}
                >
                    Guardar
                </ActionButton>
                <ActionButton
                    variant="outlined"
                    startIcon={<Close />}
                    onClick={onCancel}
                    disabled={isUpdating}
                >
                    Cancelar
                </ActionButton>
            </Box>
        </>
    );
};

export default ProfileEditForm;