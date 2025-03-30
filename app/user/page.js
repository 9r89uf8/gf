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
// Removed ExpandLessIcon and ExpandMoreIcon as they weren't used
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// --- Styled Components remain the same ---
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
// --- End Styled Components ---


const UserProfile = () => {
    const user = useStore((state) => state.user);
    const girl = useStore((state) => state.girl); // Assuming girl is used for premium check logic
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [newUserInfo, setNewUserInfo] = useState({ name: '', email: '', profilePic: '' });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const router = useRouter();

    const [turnstileToken, setTurnstileToken] = useState(null);
    // ---- NEW: Create a ref for the Turnstile container ----
    const turnstileContainerRef = useRef(null);
    // ---- NEW: Keep track if widget has been rendered ----
    const turnstileWidgetId = useRef(null); // To store the ID returned by render for potential cleanup

    // ---- MODIFIED: useEffect for Turnstile ----
    useEffect(() => {
        // Only proceed if we are in editing mode AND the container ref is set AND Turnstile script is loaded
        if (isEditing && turnstileContainerRef.current && window.turnstile) {
            // Check if a widget already exists in this container (using the stored ID)
            // This prevents rendering multiple widgets if the component re-renders while editing
            if (!turnstileWidgetId.current) {
                try {
                    const widgetId = window.turnstile.render(turnstileContainerRef.current, { // Pass the DOM element
                        sitekey: '0x4AAAAAAA_HdjBUf9sbezTK', // Replace with your ACTUAL site key
                        callback: (token) => {
                            console.log("Turnstile token received:", token); // Good for debugging
                            setTurnstileToken(token);
                        },
                        'error-callback': (errorCode) => {
                            console.error(`Turnstile error: ${errorCode}`);
                            // Handle error appropriately, maybe disable save button or show message
                        },
                        'expired-callback': () => {
                            console.log("Turnstile token expired");
                            setTurnstileToken(null); // Reset token
                            // Optionally re-render or prompt user
                        },
                        'timeout-callback': () => {
                            console.log("Turnstile challenge timed out");
                            // Handle timeout
                        }
                    });
                    turnstileWidgetId.current = widgetId; // Store the widget ID
                    console.log("Turnstile rendered with widget ID:", widgetId); // Debugging
                } catch (error) {
                    console.error("Error rendering Turnstile:", error); // Catch potential render errors
                }
            }
        }

        // Cleanup function: Remove the widget when the component unmounts OR when isEditing becomes false
        return () => {
            if (turnstileWidgetId.current && window.turnstile) {
                console.log("Removing Turnstile widget:", turnstileWidgetId.current); // Debugging
                window.turnstile.remove(turnstileWidgetId.current);
                turnstileWidgetId.current = null;
                setTurnstileToken(null); // Also reset the token state on cleanup
            }
        };
        // ---- NEW: Add isEditing to dependency array ----
        // This ensures the effect runs when isEditing changes (to render when true, cleanup when false)
    }, [isEditing]);


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
            const file = e.target.files[0];
            setImage(file);
            // Use FileReader for preview to avoid revoking issues with URL.createObjectURL
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewUserInfo(prevState => ({ ...prevState, profilePic: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!turnstileToken) {
            console.error('Turnstile token is missing. Cannot save.');
            // Optionally show an error message to the user
            alert("Please complete the security check.");
            return; // Prevent submission without token
        }

        setIsUpdating(true);
        const formData = new FormData();
        formData.append('name', newUserInfo.name);
        formData.append('email', newUserInfo.email);
        formData.append('turnstileToken', turnstileToken); // Send the token

        if (image) {
            formData.append('image', image);
        }

        try {
            await editUser(formData); // Assuming editUser handles the FormData
            setIsEditing(false); // Exit editing mode on success
            // Optional: Re-fetch user data or update store state if editUser doesn't do it
        } catch (error) {
            console.error('Error updating user profile:', error);
            // Handle error (e.g., show error message to user)
            alert(`Failed to update profile: ${error.message || 'Unknown error'}`);
        } finally {
            setIsUpdating(false);
            // Reset Turnstile token after attempt (success or fail)
            // The cleanup effect should handle removing the widget when isEditing becomes false
            setTurnstileToken(null);
            if (turnstileWidgetId.current && window.turnstile) {
                window.turnstile.reset(turnstileWidgetId.current); // Reset widget for potential reuse if needed
            }
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewUserInfo(user || { name: '', email: '', profilePic: '' }); // Reset form
        setImage(null); // Reset image state
        // Turnstile cleanup is handled by the useEffect hook when isEditing changes to false
    };

    const handleDeleteUser = async () => {
        setIsUpdating(true); // Prevent other actions during delete
        try {
            await deleteUser();
            setOpenDeleteDialog(false);
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'user_deleted_account', {
                    event_category: 'CTA',
                    event_label: 'User Delete Button'
                });
            }
            // Update store or redirect immediately
            // Assuming deleteUser logs the user out or updates the store state
            router.push('/register'); // Or login page
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(`Failed to delete account: ${error.message || 'Unknown error'}`);
            // Handle error
        } finally {
            setIsUpdating(false);
        }
    };

    // Calculate the days and hours remaining
    let daysRemaining = null;
    let hoursRemaining = null;

    // Check user, premium status, and expirationDate before calculation
    if (user?.premium && user?.expirationDate?._seconds) {
        try {
            const expirationDate = new Date(user.expirationDate._seconds * 1000);
            const now = new Date();
            if (expirationDate > now) { // Only calculate if not expired
                daysRemaining = differenceInDays(expirationDate, now);
                hoursRemaining = differenceInHours(expirationDate, now) % 24;
            }
        } catch (e) {
            console.error("Error calculating remaining time:", e); // Handle potential date errors
        }
    }

    // If there is no user, show a friendly message
    if (!user) {
        return (
            <Box sx={{ minHeight: '100vh', padding: 2 }}>
                <Container maxWidth="sm">
                    <StyledCard>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Para hablar tienes que crear una cuenta o inicia sesión.
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
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

    // Main User Profile View
    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(45deg, #343a40 0%, #212529 100%)',
                padding: 2,
                paddingTop: 4, // Add some top padding
            }}
        >
            <Container maxWidth="sm">
                <StyledCard>
                    <Avatar
                        // Use newUserInfo.profilePic for preview during editing, otherwise user.profilePic
                        src={isEditing ? newUserInfo.profilePic : user.profilePic || ''}
                        alt={newUserInfo.name || user.name} // Use state or original user data
                        sx={{ width: 100, height: 100, margin: 'auto', mb: 2, border: '2px solid white' }}
                    />
                    {isEditing ? (
                        <>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="icon-button-file"
                                type="file"
                                onChange={handleImageChange}
                                ref={fileInputRef} // Keep ref if needed elsewhere, otherwise optional
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

                            {/* ---- MODIFIED: Turnstile container div with ref ---- */}
                            <Box
                                ref={turnstileContainerRef}
                                id="turnstile-widget-container" // ID can be useful for debugging/styling
                                sx={{ my: 2, display: 'flex', justifyContent: 'center' }} // Center the widget
                            />

                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <ActionButton
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Save />}
                                    onClick={handleSave}
                                    // Disable save if updating OR if Turnstile token is missing
                                    disabled={isUpdating || !turnstileToken}
                                >
                                    Guardar
                                </ActionButton>
                                <ActionButton
                                    variant="outlined"
                                    color="secondary"
                                    sx={{ color: 'white', borderColor: 'white' }} // Style outline button
                                    startIcon={<Close />}
                                    onClick={handleCancel}
                                    disabled={isUpdating} // Only disable cancel if actively updating
                                >
                                    Cancelar
                                </ActionButton>
                            </Box>
                        </>
                    ) : (
                        <>
                            {/* Display current user info */}
                            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>{user.name}</Typography>
                            <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.8)' }}>{user.email}</Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                                <ActionButton variant="contained" startIcon={<Edit />} onClick={() => setIsEditing(true)}>
                                    Editar Perfil
                                </ActionButton>
                                <ActionButton
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteForever />}
                                    onClick={() => setOpenDeleteDialog(true)}
                                >
                                    Eliminar cuenta
                                </ActionButton>
                            </Box>

                            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

                            {/* Premium Status Section */}
                            {user.premium ? (
                                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ffd700' }}>
                                        Cuenta Premium ✨
                                    </Typography>
                                    {daysRemaining !== null && hoursRemaining !== null ? (
                                        <>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                Tu cuenta premium está activa.
                                            </Typography>
                                            <Typography variant="body1">
                                                Expira en: <strong>{daysRemaining}</strong> día{daysRemaining !== 1 ? 's' : ''} y <strong>{hoursRemaining}</strong> hora{hoursRemaining !== 1 ? 's' : ''}
                                            </Typography>
                                        </>
                                    ) : (
                                        // This covers both expired and calculation error/pending cases
                                        <Typography variant="body1" sx={{ color: '#ffcbcb' }}>
                                            Tu membresía premium no está activa o ha expirado.
                                        </Typography>
                                    )}
                                </Box>
                            ) : (
                                // Not premium - show upgrade button
                                <GradientButton
                                    onClick={() => router.push('/premium')}
                                    sx={{ mt: 2 }} // Add margin if needed
                                >
                                    ✨ Hacerse Premium ✨
                                </GradientButton>
                            )}
                        </>
                    )}
                </StyledCard>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    PaperComponent={styled(Paper)(({ theme }) => ({
                        backgroundColor: '#424242', // Darker background for dialog
                        color: 'white',
                        borderRadius: theme.shape.borderRadius * 2,
                    }))}
                >
                    <DialogTitle>{"Confirmar eliminación"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer. Todos tus datos serán eliminados permanentemente.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ padding: '8px 24px 16px' }}>
                        <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: 'white' }}>Cancelar</Button>
                        <Button onClick={handleDeleteUser} color="error" variant="contained" autoFocus disabled={isUpdating}>
                            Eliminar Definitivamente
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default UserProfile;
