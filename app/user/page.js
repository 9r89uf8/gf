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
} from '@mui/material';
import { Edit, Save, Close, DeleteForever, PersonAdd, PhotoCamera } from '@mui/icons-material';
import {alpha, styled} from '@mui/material/styles';

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
    width: '100%', // Set width to 100%
    maxWidth: '500px', // Add a max-width for larger screens
    padding: theme.spacing(3), // Add some padding
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
    const [newUserInfo, setNewUserInfo] = useState({ name: '', email: '', profilePic: '' });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setNewUserInfo(user);
            setLoading(false);
        } else {
            // If user is null, we might want to redirect to login or show a message
            setLoading(false);
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
        const formData = new FormData();
        formData.append('name', newUserInfo.name);
        formData.append('email', newUserInfo.email);

        if (image) {
            formData.append('image', image);
        }

        try {
            await editUser(formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user profile:', error);
            // Handle error (e.g., show error message to user)
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
            router.push('/register');
        } catch (error) {
            console.error('Error deleting user:', error);
            // Handle error (e.g., show error message to user)
        }
    };


    // Calculate the days and hours remaining until the membership expires
    let daysRemaining = null;
    let hoursRemaining = null;

    if (user&&user.premium&&girl) {
        const expirationDate = new Date(user.expirationDate._seconds * 1000);
        daysRemaining = differenceInDays(expirationDate, new Date());
        hoursRemaining = differenceInHours(expirationDate, new Date()) % 24; // To get the remainder hours after days
    }

    return (
        <>
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
                        <ActionButton variant="contained" startIcon={<Save />} onClick={handleSave}>
                            Guardar
                        </ActionButton>
                        <ActionButton variant="outlined" startIcon={<Close />} onClick={handleCancel}>
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
                            style={{marginBottom: 20}}
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
                            Membresía Premium
                        </Typography>
                        {!user.expired ? (
                            <>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Tu membresía premium está activa.
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
                ) : null}

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
        </>
    );
};

export default UserProfile;