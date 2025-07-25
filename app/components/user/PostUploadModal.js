'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    CircularProgress,
    Alert,
    IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const ImagePreview = styled('img')({
    width: '100%',
    maxHeight: '400px',
    objectFit: 'contain',
    borderRadius: '8px',
    marginTop: '16px'
});

const UploadButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
    color: '#ffffff',
    '&:hover': {
        background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
    }
}));

const PostUploadModal = ({ open, onClose, onPostCreated }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [text, setText] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
                setError('Solo se permiten imágenes JPEG y PNG');
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                setError('La imagen debe ser menor a 10MB');
                return;
            }

            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleClose = () => {
        if (!uploading) {
            setSelectedFile(null);
            setPreviewUrl(null);
            setText('');
            setError(null);
            onClose();
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Por favor selecciona una imagen');
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('text', text);

        try {
            const response = await fetch('/api/v2/user-posts/create', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al subir la publicación');
            }

            onPostCreated(data.post);
            handleClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    Nueva Publicación
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    disabled={uploading}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ textAlign: 'center' }}>
                    <UploadButton
                        component="label"
                        variant="contained"
                        startIcon={<InsertPhotoIcon />}
                        disabled={uploading}
                    >
                        Seleccionar Imagen
                        <VisuallyHiddenInput
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={handleFileSelect}
                        />
                    </UploadButton>

                    {previewUrl && (
                        <ImagePreview src={previewUrl} alt="Preview" />
                    )}
                </Box>

                <TextField
                    margin="normal"
                    fullWidth
                    label="Descripción (opcional)"
                    multiline
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={uploading}
                    sx={{ mt: 3 }}
                />
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClose} disabled={uploading}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleUpload}
                    variant="contained"
                    startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                    disabled={!selectedFile || uploading}
                    sx={{
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                        color: '#ffffff',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
                        },
                        '&:disabled': {
                            background: 'rgba(0, 0, 0, 0.12)',
                            color: 'rgba(0, 0, 0, 0.26)'
                        }
                    }}
                >
                    {uploading ? 'Subiendo...' : 'Publicar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PostUploadModal;