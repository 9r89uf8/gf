// app/profile/components/ProfileEditForm.jsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Box, Avatar } from '@mui/material';
import { Save, Close, PhotoCamera } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { editUser } from "@/app/services/authService";

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& label.Mui-focused': {
        color: 'white',
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
        '& input': {
            color: 'white',
        }
    }
}));

const ActionButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
    borderRadius: theme.shape.borderRadius * 3,
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
                sx={{ width: 100, height: 100, margin: 'auto', mb: 2, border: '2px solid white' }}
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
                    sx={{ mb: 2 }}
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
                InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
            />
            <StyledTextField
                fullWidth
                name="email"
                label="Correo electrónico"
                value={newUserInfo.email}
                onChange={handleInputChange}
                InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
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
                    color="secondary"
                    sx={{ color: 'white', borderColor: 'white' }}
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