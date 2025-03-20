'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/app/store/store';
import { useRouter } from 'next/navigation';
import { differenceInDays, differenceInHours } from 'date-fns';
import { editUser, deleteUser } from "@/app/services/authService";
import {
    Box,
    Card,
    TextField,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Paper,
    Divider,
    Avatar,
    Container
} from '@mui/material';
import { Edit, Save, Close, DeleteForever, PhotoCamera } from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StyledCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 15,
    marginBottom: 40,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.10)',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    padding: theme.spacing(3),
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)',
    border: 0,
    borderRadius: 25,
    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .2)',
    color: 'black',
    height: 48,
    padding: '0 30px',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
    },
}));

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

const UserProfile = () => {
    const user = useStore((state) => state.user);
    const girl = useStore((state) => state.girl);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [newUserInfo, setNewUserInfo] = useState({ name: '', email: '', profilePic: '' });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const router = useRouter();

    const [turnstileToken, setTurnstileToken] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.turnstile) {
                window.turnstile.render('#turnstile-widget', {
                    sitekey: '0x4AAAAAAA_HdjBUf9sbezTK',
                    callback: (token) => setTurnstileToken(token),
                });
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (user) {
            setNewUserInfo(user);
        }
    }, [user]);

    const handleInputChange = (e) => {
        setNewUserInfo({ ...newUserInfo, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setNewUserInfo({ ...newUserInfo, profilePic: URL.createObjectURL(e.target.files[0]) });
        }
    };

    const handleSave = async () => {
        setIsUpdating(true);
        const formData = new FormData();
        formData.append('name', newUserInfo.name);
        formData.append('email', newUserInfo.email);
        formData.append('turnstileToken', turnstileToken);

        if (image) {
            formData.append('image', image);
        }

        try {
            await editUser(formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user profile:', error);
            // Handle error (e.g., show error message to user)
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewUserInfo(user || { name: '', email: '', profilePic: '' });
        setImage(null);
    };

    const handleDeleteUser = async () => {
        try {
            await deleteUser();
            setOpenDeleteDialog(false);
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'user_deleted_account', {
                    event_category: 'CTA',
                    event_label: 'User Delete Button'
                });
            }
            router.push('/register');
        } catch (error) {
            console.error('Error deleting user:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    // Calculate the days and hours remaining until the membership expires
    let daysRemaining = null;
    let hoursRemaining = null;

    if (user && user.premium && girl && user.expirationDate) {
        const expirationDate = new Date(user.expirationDate._seconds * 1000);
        daysRemaining = differenceInDays(expirationDate, new Date());
        hoursRemaining = differenceInHours(expirationDate, new Date()) % 24;
    }

    // If there is no user, show a friendly message with Login and Register options
    if (!user) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    padding: 2,
                }}
            >
                <Container maxWidth="sm">
            <StyledCard>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Para hablar con los creadores, por favor crea una cuenta o inicia sesión.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ActionButton variant="contained" onClick={() => router.push('/login')}>
                        Iniciar sesión
                    </ActionButton>
                    <ActionButton variant="outlined" onClick={() => router.push('/register')}>
                        Registrarse
                    </ActionButton>
                </Box>
            </StyledCard>
                </Container>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(45deg, #343a40 0%, #212529 100%)',
                padding: 2,
            }}
        >
            <Container maxWidth="sm">
                <StyledCard>
                <Avatar
                    src={newUserInfo.profilePic}
                    alt={newUserInfo.name}
                    sx={{ width: 100, height: 100, margin: 'auto', mb: 2 }}
                />
                {isEditing ? (
                    <>
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
                        />
                        <StyledTextField
                            fullWidth
                            name="email"
                            label="Correo electrónico"
                            value={newUserInfo.email}
                            onChange={handleInputChange}
                        />
                        <div id="turnstile-widget"></div>
                        <ActionButton
                            variant="contained"
                            startIcon={<Save />}
                            onClick={handleSave}
                            disabled={isUpdating}
                        >
                            Guardar
                        </ActionButton>
                        <ActionButton
                            variant="outlined"
                            startIcon={<Close />}
                            onClick={handleCancel}
                            disabled={isUpdating}
                        >
                            Cancelar
                        </ActionButton>
                    </>
                ) : (
                    <>
                        <Typography variant="body1" sx={{ mb: 2 }}>{newUserInfo.name}</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>{newUserInfo.email}</Typography>
                        <ActionButton variant="contained" startIcon={<Edit />} onClick={() => setIsEditing(true)}>
                            Editar
                        </ActionButton>
                        <ActionButton
                            style={{ marginBottom: 20 }}
                            variant="contained"
                            color="error"
                            startIcon={<DeleteForever />}
                            onClick={() => setOpenDeleteDialog(true)}
                            sx={{ mt: 2 }}
                        >
                            Eliminar cuenta
                        </ActionButton>
                    </>
                )}

                {user && user.premium ? (
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#ffd700' }}>
                            Cuenta Premium
                        </Typography>
                        {!user.expired ? (
                            <>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Tu cuenta premium está activa.
                                </Typography>
                                {daysRemaining !== null && hoursRemaining !== null ? (
                                    <Typography variant="h6">
                                        Expira en: <strong>{daysRemaining}</strong> día{daysRemaining !== 1 ? 's' : ''} y <strong>{hoursRemaining}</strong> hora{hoursRemaining !== 1 ? 's' : ''}
                                    </Typography>
                                ) : (
                                    <Typography variant="body2">
                                        Calculando tiempo restante...
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <Typography variant="body1" sx={{ color: '#ff6b6b' }}>
                                Tu membresía premium ha expirado.
                            </Typography>
                        )}
                    </Box>
                ) :
                    <>
                        <GradientButton
                            onClick={() => router.push('/premium')}
                        >
                            comprar premium
                        </GradientButton>
                    </>
                }

                </StyledCard>
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                PaperComponent={styled(Paper)(({ theme }) => ({
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: theme.shape.borderRadius * 2,
                }))}
            >
                <DialogTitle>{"Confirmar eliminación"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                    <Button onClick={handleDeleteUser} color="error" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
            </Container>
        </Box>
    );
};

export default UserProfile;
