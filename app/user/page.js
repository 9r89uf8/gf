'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/app/store/store';
import { useRouter } from 'next/navigation';
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
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(4px)',
    background: 'linear-gradient(135deg, #38a3a5, #57cc99)',
    color: theme.palette.common.white,
    textAlign: 'center',
    maxWidth: 400,
    width: '100%',
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

    const handleRegister = () => {
        router.push('/register');
    };

    if (!user) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 4, px: 2 }}>
                <StyledCard>
                    <Typography variant="h3" gutterBottom>Bienvenido</Typography>
                    <Typography variant="h5" paragraph>
                        Puedes registrarte de forma anónima con un correo electrónico ficticio.
                        Tu privacidad es importante para nosotros.
                    </Typography>
                    <ActionButton
                        variant="contained"
                        startIcon={<PersonAdd />}
                        onClick={handleRegister}
                    >
                        Registrarse Anónimamente
                    </ActionButton>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">
                        Puedes eliminar todos tus datos en cualquier momento si lo deseas.
                    </Typography>
                </StyledCard>
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 4, px: 2 }}>
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
                        <Typography variant="h5" gutterBottom>Perfil de Usuario</Typography>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Nombre</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>{newUserInfo.name}</Typography>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Correo electrónico</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>{newUserInfo.email}</Typography>
                        <ActionButton variant="contained" startIcon={<Edit />} onClick={() => setIsEditing(true)}>
                            Editar
                        </ActionButton>
                    </>
                )}
            </StyledCard>

            <ActionButton
                variant="contained"
                color="error"
                startIcon={<DeleteForever />}
                onClick={() => setOpenDeleteDialog(true)}
                sx={{ mt: 2 }}
            >
                Eliminar cuenta
            </ActionButton>

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
        </Box>
    );
};

export default UserProfile;