// app/profile/components/DeleteAccountDialog.jsx
'use client';

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { deleteUser } from "@/app/services/authService";

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: '#424242',
    color: 'white',
    borderRadius: theme.shape.borderRadius * 2,
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
            <DialogTitle>{"Confirmar eliminación"}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer. Todos tus datos serán eliminados permanentemente.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ padding: '8px 24px 16px' }}>
                <Button onClick={onClose} sx={{ color: 'white' }}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleDeleteUser}
                    color="error"
                    variant="contained"
                    autoFocus
                    disabled={isDeleting}
                >
                    Eliminar Definitivamente
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteAccountDialog;