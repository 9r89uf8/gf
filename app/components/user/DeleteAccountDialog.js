// app/profile/components/DeleteAccountDialog.jsx
'use client';

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { deleteUser } from "@/app/services/authService";

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 20,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
}));

const DeleteAccountDialog = ({ open, onClose, onConfirm }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteUser = async () => {
        setIsDeleting(true);
        try {
            await deleteUser();
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'user_deleted_account', {
                    event_category: 'CTA',
                    event_label: 'User Delete Button'
                });
            }
            onConfirm();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(`Failed to delete account: ${error.message || 'Unknown error'}`);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperComponent={StyledPaper}
        >
            <DialogTitle sx={{ 
                fontSize: '1.5rem', 
                fontWeight: 600,
                color: 'rgba(15, 23, 42, 0.95)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                pb: 2
            }}>
                {"Confirmar eliminación"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ 
                    color: 'rgba(51, 65, 85, 0.95)',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    mt: 2
                }}>
                    ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer. Todos tus datos serán eliminados permanentemente.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ padding: '8px 24px 16px' }}>
                <Button 
                    onClick={onClose} 
                    sx={{ 
                        color: 'rgba(71, 85, 105, 0.8)',
                        fontWeight: 600,
                        borderRadius: '12px',
                        padding: '10px 24px',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            color: 'rgba(15, 23, 42, 0.95)',
                        },
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleDeleteUser}
                    variant="contained"
                    autoFocus
                    disabled={isDeleting}
                    sx={{
                        background: '#dc2626',
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: '12px',
                        padding: '10px 24px',
                        textTransform: 'none',
                        boxShadow: '0 4px 15px 0 rgba(220, 38, 38, 0.3)',
                        '&:hover': {
                            background: '#b91c1c',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 6px 20px 0 rgba(220, 38, 38, 0.4)',
                        },
                        '&:disabled': {
                            background: 'rgba(220, 38, 38, 0.3)',
                            color: 'rgba(255, 255, 255, 0.7)',
                        },
                    }}
                >
                    Eliminar Definitivamente
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteAccountDialog;